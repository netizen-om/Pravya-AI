import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { prisma } from "@repo/db";

const webhookSecret = process.env.DODOPAYMENTS_WEBHOOK_SECRET!;
if (!webhookSecret) {
  console.warn("DODOPAYMENTS_WEBHOOK_SECRET is not set!");
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function getEventId(payload: any) {
  // Try many possible places for a unique event id
  return (
    payload.id ||
    payload.event_id ||
    payload.messageId ||
    payload.message_id ||
    payload.eventId ||
    payload.data?.id ||
    payload.data?.event_id ||
    payload.data?.messageId ||
    null
  );
}

function getSubscriptionId(obj: any) {
  if (!obj) return null;
  return (
    obj.subscription_id ||
    obj.subscriptionId ||
    obj.subscription?.id ||
    obj.subscription?.subscription_id ||
    obj.data?.subscription_id ||
    obj.data?.subscription?.id ||
    obj.metadata?.subscription_id ||
    null
  );
}

function mapPaymentStatus(raw: string | undefined) {
  if (!raw) return "PENDING";
  const s = raw.toString().toLowerCase();
  if (s === "succeeded" || s === "success") return "SUCCESS";
  if (s === "failed") return "FAILED";
  if (s === "refunded") return "REFUNDED";
  return "PENDING";
}

export async function POST(req: NextRequest) {
  try {
    const webhookId = req.headers.get("webhook-id");
    const webhookSignature = req.headers.get("webhook-signature");
    const webhookTimestamp = req.headers.get("webhook-timestamp");

    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      return NextResponse.json({ error: "Missing webhook headers" }, { status: 400 });
    }

    const rawBody = await req.text();

    // Verify signature
    const webhook = new Webhook(webhookSecret);
    try {
      await webhook.verify(rawBody, {
        "webhook-id": webhookId,
        "webhook-signature": webhookSignature,
        "webhook-timestamp": webhookTimestamp,
      });
    } catch (err) {
      console.error("Invalid webhook signature:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const type: string = payload.type;
    const data: any = payload.data ?? {};

    // Deduplicate by event id
    const eventId = getEventId(payload) || webhookId;
    if (!eventId) {
      console.warn("No event id found on payload; continuing but deduplication not possible.");
    } else {
      // If event already processed, return early 200 (idempotent)
      const already = await prisma.webhookEvent.findUnique({ where: { eventId } }).catch(() => null);
      if (already) {
        // already processed
        console.log("Duplicate webhook event ignored:", eventId, type);
        return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
      }
      // create record (if this fails due to race, ignore and continue)
      try {
        await prisma.webhookEvent.create({ data: { eventId, type } });
      } catch (e: any) {
        // If unique constraint error happened because another worker processed simultaneously, continue.
        if (e?.code === "P2002") {
          console.log("Event was created concurrently, ignoring duplicate creation error:", eventId);
        } else {
          // non-critical: log and continue processing (we want to avoid blocking)
          console.warn("Could not create webhookEvent record:", e?.message ?? e);
        }
      }
    }

    // Resolve user by email (Dodo payload has customer.email in examples)
    async function resolveUserIdByEmail(obj: any) {
      const email = obj?.customer?.email || obj?.customer_email || obj?.email || null;
      if (!email) return null;
      const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
      return user?.id ?? null;
    }

    // UPSERT PAYMENT (idempotent)
    async function upsertPayment(paymentData: any) {
      const userId = await resolveUserIdByEmail(paymentData);
      if (!userId) {
        console.warn("No user found for payment (by email). Payment payload:", paymentData?.customer?.email ?? "<no-email>");
        return null;
      }

      const dodoPaymentId = paymentData.payment_id || paymentData.paymentId || paymentData.payment || paymentData.id || null;
      const dodoOrderId = paymentData.order_id || paymentData.order?.id || null;

      // build OR condition safely
      const orConds: any[] = [];
      if (dodoPaymentId) orConds.push({ dodoPaymentId });
      if (dodoOrderId) orConds.push({ dodoOrderId });

      let existing: any = null;
      if (orConds.length > 0) {
        existing = await prisma.payment.findFirst({ where: { OR: orConds } }).catch(() => null);
      }

      const mappedStatus = mapPaymentStatus(paymentData.status || paymentData.payment_status || paymentData.state);

      if (existing) {
        // update and return the updated payment object
        const updated = await prisma.payment.update({
          where: { paymentId: existing.paymentId },
          data: {
            status: mappedStatus as any,
            dodoPaymentId: dodoPaymentId ?? existing.dodoPaymentId,
            dodoOrderId: dodoOrderId ?? existing.dodoOrderId,
            dodoSignature: webhookSignature,
            metadata: paymentData.metadata ?? existing.metadata ?? {},
            paymentMethod: paymentData.payment_method ?? existing.paymentMethod ?? null,
            // do not alter createdAt
          },
        });
        return updated;
      }

      // Create payment
      // amount: use total_amount if provided (payload example included total_amount), otherwise fallback to amount
      const amountRaw = paymentData.total_amount ?? paymentData.amount ?? paymentData.settlement_amount ?? 0;
      const amountInt = Number(amountRaw ?? 0);

      const created = await prisma.payment.create({
        data: {
          userId,
          amount: Math.round(amountInt),
          currency: paymentData.currency || "INR",
          paymentMethod: paymentData.payment_method || paymentData.paymentMethod || null,
          status: mappedStatus as any,
          dodoPaymentId,
          dodoOrderId,
          dodoSignature: webhookSignature,
          metadata: paymentData.metadata ?? {},
        },
      });

      return created;
    }

    // UPSERT SUBSCRIPTION (idempotent and resilient)
    async function upsertSubscription(subData: any) {
      // resolve user via email
      const userId = await resolveUserIdByEmail(subData);
      if (!userId) {
        console.warn("No user found for subscription (by email). Payload:", subData?.customer?.email ?? "<no-email>");
        return null;
      }

      const dodoSubscriptionId = getSubscriptionId(subData);
      if (!dodoSubscriptionId) {
        console.warn("Missing subscription id in subscription payload:", subData);
        return null;
      }

      const plan = (subData.payment_frequency_interval && subData.payment_frequency_interval === "Month")
        ? "monthly"
        : (subData.subscription_period_interval && subData.subscription_period_interval.toLowerCase().includes("year"))
        ? "yearly"
        : (subData.plan?.interval === "month" ? "monthly" : "yearly");

      const startDate = subData.previous_billing_date ? new Date(subData.previous_billing_date) : (subData.created_at ? new Date(subData.created_at) : new Date());
      const endDate = subData.next_billing_date ? new Date(subData.next_billing_date)
        : (subData.current_period_end ? new Date(subData.current_period_end) : addDays(startDate, plan === "monthly" ? 30 : 365));

      // Try to find by external id or userId (user has at most one subscription in your schema)
      const existing = await prisma.subscription.findFirst({
        where: {
          OR: [
            dodoSubscriptionId ? { dodoSubscriptionId } : undefined,
            { userId },
          ].filter(Boolean) as any[],
        },
      });

      if (existing) {
        // update existing subscription record (return updated object)
        const updated = await prisma.subscription.update({
          where: { subscriptionId: existing.subscriptionId },
          data: {
            dodoSubscriptionId,
            plan,
            status: (subData.status?.toString().toUpperCase() ?? "ACTIVE") as any,
            startDate,
            endDate,
            updatedAt: new Date(),
          },
        });
        return updated;
      }

      // Create subscription. Because of race conditions (multiple events), creation may fail with P2002 on userId/dodoSubscriptionId.
      try {
        const created = await prisma.subscription.create({
          data: {
            userId,
            dodoSubscriptionId,
            plan,
            status: (subData.status?.toString().toUpperCase() ?? "ACTIVE") as any,
            startDate,
            endDate,
          },
        });
        return created;
      } catch (err: any) {
        // If unique constraint failed because another worker created it concurrently, fetch and return that record instead of throwing
        if (err?.code === "P2002") {
          const fallback = await prisma.subscription.findFirst({
            where: {
              OR: [
                dodoSubscriptionId ? { dodoSubscriptionId } : undefined,
                { userId },
              ].filter(Boolean) as any[],
            },
          }).catch(() => null);
          if (fallback) return fallback;
        }
        // rethrow unexpected errors
        throw err;
      }
    }

    // Process events
    switch (type) {
      case "subscription.created":
      case "subscription.active": {
        console.log("Webhook: subscription created/active", getSubscriptionId(data));
        await upsertSubscription(data);
        break;
      }

      case "subscription.renewed":
      case "subscription.updated": {
        console.log("Webhook: subscription renewed/updated", getSubscriptionId(data));
        const sub = await upsertSubscription(data);
        // If last payment info exists inside subscription payload, upsert it and attach
        if (data.last_payment) {
          const payment = await upsertPayment(data.last_payment);
          if (payment && sub) {
            // safe update; updateMany to avoid throw if not present (but we have sub so update by id)
            await prisma.subscription.update({
              where: { subscriptionId: sub.subscriptionId },
              data: { lastPaymentId: payment.paymentId, status: "ACTIVE" },
            });
          }
        }
        break;
      }

      case "subscription.cancelled":
      case "subscription.deleted": {
        const subId = getSubscriptionId(data) || data.subscription_id || null;
        console.log("Webhook: subscription cancelled/deleted", subId);
        if (subId) {
          // updateMany so zero-rows doesn't throw
          await prisma.subscription.updateMany({
            where: { dodoSubscriptionId: subId },
            data: { status: "CANCELLED" },
          });
        }
        break;
      }

      case "payment.succeeded": {
        console.log("Webhook: payment.succeeded");
        const payment = await upsertPayment(data);
        if (payment) {
          const subId = getSubscriptionId(data) || data.subscription_id || null;
          if (subId) {
            // update subscription lastPaymentId safely
            await prisma.subscription.updateMany({
              where: { dodoSubscriptionId: subId },
              data: { lastPaymentId: payment.paymentId, status: "ACTIVE" },
            });
          }
        }
        break;
      }

      case "payment.failed": {
        console.log("Webhook: payment.failed");
        const payment = await upsertPayment(data);
        if (payment) {
          const subId = getSubscriptionId(data) || data.subscription_id || null;
          if (subId) {
            await prisma.subscription.updateMany({
              where: { dodoSubscriptionId: subId },
              data: { status: "EXPIRED" },
            });
          }
        }
        break;
      }

      case "refund.succeeded":
      case "refund.created": {
        console.log("Webhook: refund event");
        // You probably want to mark payments as REFUNDED or create refund rows — left as a no-op or basic logic
        // Attempt to find payment by payment_id and mark REFUNDED
        const refundPaymentId = data.payment_id || data.paymentId || data.payment?.payment_id || null;
        if (refundPaymentId) {
          await prisma.payment.updateMany({
            where: { dodoPaymentId: refundPaymentId },
            data: { status: "REFUNDED" },
          });
        }
        break;
      }

      default:
        console.log("Unhandled Dodo event type:", type);
    }

    return NextResponse.json({ received: true, type }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook processing error:", err?.message ?? err);
    return NextResponse.json({ error: "Webhook failed", details: err?.message ?? null }, { status: 500 });
  }
}
