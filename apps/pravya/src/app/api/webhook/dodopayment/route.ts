import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { prisma } from "@repo/db";

const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET!;

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export async function POST(req: NextRequest) {
  try {
    const webhookId = req.headers.get("webhook-id");
    const webhookSignature = req.headers.get("webhook-signature");
    const webhookTimestamp = req.headers.get("webhook-timestamp");

    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      return NextResponse.json(
        { error: "Missing webhook headers" },
        { status: 400 }
      );
    }

    const rawBody = await req.text();

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

    const { type, data } = JSON.parse(rawBody);

    // -----------------------------
    // PAYMENT UPSERT
    // -----------------------------
    async function upsertPayment(paymentData: any) {
      const dodoPaymentId = paymentData.id;
      const dodoOrderId = paymentData.order_id || paymentData.order?.id;
      const metadata = paymentData.metadata || {};
      const userId = metadata.userId;

      if (!userId) return null;

      const existing = await prisma.payment.findFirst({
        where: {
          OR: [
            dodoPaymentId ? { dodoPaymentId } : undefined,
            dodoOrderId ? { dodoOrderId } : undefined,
          ],
        },
      });

      const mappedStatus =
        paymentData.status === "succeeded"
          ? "SUCCESS"
          : paymentData.status === "failed"
          ? "FAILED"
          : "PENDING";

      if (existing) {
        return prisma.payment.update({
          where: { paymentId: existing.paymentId },
          data: {
            status: mappedStatus,
            metadata,
            dodoPaymentId,
            dodoOrderId,
            dodoSignature: webhookSignature,
          },
        });
      }

      return prisma.payment.create({
        data: {
          userId,
          amount: Number(paymentData.amount),
          currency: paymentData.currency || "INR",
          paymentMethod: paymentData.payment_method || null,
          status: mappedStatus,
          dodoPaymentId,
          dodoOrderId,
          dodoSignature: webhookSignature,
          metadata,
        },
      });
    }

    // -----------------------------
    // SUBSCRIPTION UPSERT
    // -----------------------------
    async function upsertSubscription(subData: any) {
      const dodoSubscriptionId = subData.id;
      const metadata = subData.metadata || {};
      const userId = metadata.userId;

      if (!userId || !dodoSubscriptionId) return null;

      const plan = subData.billing?.interval || "monthly";
      const cycleDays = plan === "monthly" ? 30 : 365;

      const startDate = subData.start_date
        ? new Date(subData.start_date)
        : new Date();
      const endDate = subData.current_period_end
        ? new Date(subData.current_period_end)
        : addDays(startDate, cycleDays);

      const existing = await prisma.subscription.findUnique({
        where: { dodoSubscriptionId },
      });

      if (existing) {
        return prisma.subscription.update({
          where: { dodoSubscriptionId },
          data: {
            plan,
            status: subData.status?.toUpperCase() || "ACTIVE",
            startDate,
            endDate,
          },
        });
      }

      return prisma.subscription.create({
        data: {
          userId,
          dodoSubscriptionId,
          plan,
          status: subData.status?.toUpperCase() || "ACTIVE",
          startDate,
          endDate,
        },
      });
    }

    // -----------------------------
    // WEBHOOK EVENT HANDLERS
    // -----------------------------
    switch (type) {
      case "payment.succeeded": {
        console.log("Payment Succeeded");
        const payment = await upsertPayment(data);

        if (data.subscription_id) {
          const sub = await prisma.subscription.findUnique({
            where: { dodoSubscriptionId: data.subscription_id },
          });

          if (sub && payment) {
            await prisma.subscription.update({
              where: { dodoSubscriptionId: data.subscription_id },
              data: { lastPaymentId: payment.paymentId, status: "ACTIVE" },
            });
          }
        }

        break;
      }

      case "payment.failed": {
        console.log("Payment Failed");
        await upsertPayment(data);
        break;
      }

      case "subscription.created":
        console.log("Subscribtion created");
      case "subscription.active": {
        console.log("Subscribtion active");
        await upsertSubscription(data);
        break;
      }

      case "subscription.renewed": {
        console.log("Subscribtion renewed");
        await upsertSubscription(data);

        if (data.last_payment) {
          const payment = await upsertPayment(data.last_payment);

          await prisma.subscription.update({
            where: { dodoSubscriptionId: data.id },
            data: { lastPaymentId: payment?.paymentId },
          });
        }

        break;
      }

      case "subscription.cancelled":
        console.log("Subscribtion cancelled");
      case "subscription.deleted": {
        console.log("Subscribtion deleted");
        await prisma.subscription.updateMany({
          where: { dodoSubscriptionId: data.id },
          data: { status: "CANCELLED" },
        });
        break;
      }

      default:
        console.log("Unhandled event:", type);
    }

    return NextResponse.json({ received: true, type }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
