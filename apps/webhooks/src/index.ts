import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { prisma } from "@repo/db";
import { Webhook } from "standardwebhooks";
import { sendInvoiceEmail, sendSubscriptionActiveEmail, sendSubscriptionCancelledEmail } from "./lib/resend";


const PORT = 4000;
const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

const webhookSecret = process.env.DODOPAYMENTS_WEBHOOK_SECRETE!;

if (!webhookSecret) {
  console.warn("DODOPAYMENTS_WEBHOOK_SECRET is not set!");
}

// ---------------------
// Utility Functions
// ---------------------

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function getEventId(payload: any) {
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
  const s = raw.toLowerCase();
  if (s === "succeeded" || s === "success") return "SUCCESS";
  if (s === "failed") return "FAILED";
  if (s === "refunded") return "REFUNDED";
  return "PENDING";
}

// ---------------------
// Express Webhook Handler
// ---------------------

app.post(
  "/api/webhook/dodopayment",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const webhookId = req.header("webhook-id");
      const webhookSignature = req.header("webhook-signature");
      const webhookTimestamp = req.header("webhook-timestamp");

      if (!webhookId || !webhookSignature || !webhookTimestamp) {
        return res.status(400).json({ error: "Missing webhook headers" });
      }

      const rawBody = req.body.toString("utf8");

      // Signature verification
      const webhook = new Webhook(webhookSecret);
      try {
        await webhook.verify(rawBody, {
          "webhook-id": webhookId,
          "webhook-signature": webhookSignature,
          "webhook-timestamp": webhookTimestamp,
        });
      } catch (err) {
        console.error("Invalid webhook signature:", err);
        return res.status(400).json({ error: "Invalid signature" });
      }

      const payload = JSON.parse(rawBody);
      const type: string = payload.type;
      const data: any = payload.data ?? {};

      const eventId = getEventId(payload) || webhookId;

      if (eventId) {
        const existing = await prisma.webhookEvent
          .findUnique({
            where: { eventId },
          })
          .catch(() => null);

        if (existing) {
          console.log("Duplicate webhook event ignored:", eventId, type);
          return res.status(200).json({ ok: true, duplicate: true });
        }

        try {
          await prisma.webhookEvent.create({
            data: { eventId, type },
          });
        } catch (e: any) {
          if (e?.code === "P2002") {
            console.log("Race condition—event created already:", eventId);
          } else {
            console.warn("Failed to create webhookEvent:", e);
          }
        }
      }

      async function resolveUserIdByEmail(obj: any) {
        const email =
          obj?.customer?.email || obj?.customer_email || obj?.email || null;

        if (!email) return null;
        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true },
        });
        return user?.id ?? null;
      }

      async function upsertPayment(paymentData: any) {
        const userId = await resolveUserIdByEmail(paymentData);
        if (!userId) {
          console.warn(
            "No user found for payment:",
            paymentData?.customer?.email,
          );
          return null;
        }

        const dodoPaymentId =
          paymentData.payment_id ||
          paymentData.paymentId ||
          paymentData.payment ||
          paymentData.id ||
          null;

        const dodoOrderId =
          paymentData.order_id || paymentData.order?.id || null;

        const orConds: any[] = [];
        if (dodoPaymentId) orConds.push({ dodoPaymentId });
        if (dodoOrderId) orConds.push({ dodoOrderId });

        let existing = null;
        if (orConds.length > 0) {
          existing = await prisma.payment.findFirst({ where: { OR: orConds } });
        }

        const mappedStatus = mapPaymentStatus(
          paymentData.status || paymentData.payment_status || paymentData.state,
        );

        if (existing) {
          return prisma.payment.update({
            where: { paymentId: existing.paymentId },
            data: {
              status: mappedStatus as any,
              dodoPaymentId: dodoPaymentId ?? existing.dodoPaymentId,
              dodoOrderId: dodoOrderId ?? existing.dodoOrderId,
              dodoSignature: webhookSignature,
              metadata: paymentData.metadata ?? existing.metadata ?? {},
              paymentMethod:
                paymentData.payment_method ?? existing.paymentMethod ?? null,
            },
          });
        }

        const amountRaw =
          paymentData.total_amount ??
          paymentData.amount ??
          paymentData.settlement_amount ??
          0;

        const created = await prisma.payment.create({
          data: {
            userId,
            amount: Math.round(Number(amountRaw) || 0),
            currency: paymentData.currency || "INR",
            paymentMethod:
              paymentData.payment_method || paymentData.paymentMethod || null,
            status: mappedStatus as any,
            dodoPaymentId,
            dodoOrderId,
            dodoSignature: webhookSignature,
            metadata: paymentData.metadata ?? {},
          },
        });

        return created;
      }

      // Subscription UPSERT
      async function upsertSubscription(subData: any) {
        const userId = await resolveUserIdByEmail(subData);
        if (!userId) {
          console.warn(
            "No user found for subscription:",
            subData?.customer?.email,
          );
          return null;
        }

        const dodoSubscriptionId = getSubscriptionId(subData);
        if (!dodoSubscriptionId) {
          console.warn("Missing subscription id:", subData);
          return null;
        }

        const plan =
          subData.payment_frequency_interval === "Month"
            ? "monthly"
            : subData.subscription_period_interval
                  ?.toLowerCase()
                  .includes("year")
              ? "yearly"
              : subData.plan?.interval === "month"
                ? "monthly"
                : "yearly";

        const startDate = subData.previous_billing_date
          ? new Date(subData.previous_billing_date)
          : subData.created_at
            ? new Date(subData.created_at)
            : new Date();

        const endDate = subData.next_billing_date
          ? new Date(subData.next_billing_date)
          : subData.current_period_end
            ? new Date(subData.current_period_end)
            : addDays(startDate, plan === "monthly" ? 30 : 365);

        const existing = await prisma.subscription.findFirst({
          where: {
            OR: [{ dodoSubscriptionId }, { userId }],
          },
        });

        if (existing) {
          return prisma.subscription.update({
            where: { subscriptionId: existing.subscriptionId },
            data: {
              dodoSubscriptionId,
              plan,
              status: (subData.status?.toUpperCase() || "ACTIVE") as any,
              startDate,
              endDate,
              updatedAt: new Date(),
            },
          });
        }

        try {
          return await prisma.subscription.create({
            data: {
              userId,
              dodoSubscriptionId,
              plan,
              status: (subData.status?.toUpperCase() || "ACTIVE") as any,
              startDate,
              endDate,
            },
          });
        } catch (err: any) {
          if (err.code === "P2002") {
            return prisma.subscription.findFirst({
              where: {
                OR: [{ dodoSubscriptionId }, { userId }],
              },
            });
          }
          throw err;
        }
      }

      switch (type) {
        case "subscription.created":
        case "subscription.active": {
          console.log("subscription created/active", getSubscriptionId(data));
          const sub = await upsertSubscription(data);

          if (sub) {
            await sendSubscriptionActiveEmail(sub.userId, sub);
          }
          break;
        }

        case "subscription.updated":
        case "subscription.renewed": {
          console.log("subscription updated/renewed", getSubscriptionId(data));
          const sub = await upsertSubscription(data);

          if (data.last_payment) {
            const payment = await upsertPayment(data.last_payment);
            if (payment && sub) {
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
          console.log("subscription cancelled");
          const subId = getSubscriptionId(data);
          if (subId) {
            await prisma.subscription.updateMany({
              where: { dodoSubscriptionId: subId },
              data: { status: "CANCELLED" },
            });

            const sub = await prisma.subscription.findFirst({
              where: { dodoSubscriptionId: subId },
            });

            if (sub) {
              await sendSubscriptionCancelledEmail(sub.userId, sub);
            }
          }

          break;
        }

        case "payment.succeeded": {
          console.log("payment.succeeded");
          const payment = await upsertPayment(data);

          if (payment) {
            await sendInvoiceEmail(payment.userId, payment, data);
            const subId = getSubscriptionId(data);
            if (subId) {
              await prisma.subscription.updateMany({
                where: { dodoSubscriptionId: subId },
                data: { lastPaymentId: payment.paymentId, status: "ACTIVE" },
              });
            }
          }
          break;
        }

        case "payment.failed": {
          console.log("payment.failed");
          const payment = await upsertPayment(data);
          if (payment) {
            const subId = getSubscriptionId(data);
            if (subId) {
              await prisma.subscription.updateMany({
                where: { dodoSubscriptionId: subId },
                data: { status: "EXPIRED" },
              });
            }
          }
          break;
        }

        case "refund.created":
        case "refund.succeeded": {
          console.log("refund event");
          const refundPaymentId =
            data.payment_id ||
            data.paymentId ||
            data.payment?.payment_id ||
            null;

          if (refundPaymentId) {
            await prisma.payment.updateMany({
              where: { dodoPaymentId: refundPaymentId },
              data: { status: "REFUNDED" },
            });
          }
          break;
        }

        default:
          console.log("Unhandled event:", type);
      }

      return res.status(200).json({ received: true, type });
    } catch (err: any) {
      console.error("Webhook error:", err);
      return res
        .status(500)
        .json({ error: "Webhook failed", details: err.message });
    }
  },
);

app.listen(PORT, () => {
  console.log("Webhook server running on http://localhost:4000");
});
