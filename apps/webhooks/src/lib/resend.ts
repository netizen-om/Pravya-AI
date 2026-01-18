import { prisma } from "@repo/db";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

/* -----------------------------
   Subscription Active Email
------------------------------ */
export async function sendSubscriptionActiveEmail(userId: string, sub: any) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  if (!user?.email) return;

  await resend.emails.send({
    from: "Pravya AI <billing@pravyatech.tech>",
    to: user.email,
    subject: "Your subscription is now active",
    template: {
      id: "subscription-active",
      variables: {
        planName: sub.plan,
        nextBillingDate: sub.endDate.toDateString(),
        dashboardUrl: "https://pravyatech.tech/dashboard",
      },
    },
  });
}

/* -----------------------------
   Subscription Cancelled Email
------------------------------ */
export async function sendSubscriptionCancelledEmail(
  userId: string,
  sub: any
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  if (!user?.email) return;

  await resend.emails.send({
    from: "Pravya AI <billing@pravyatech.tech>",
    to: user.email,
    subject: "Your subscription has been cancelled",
    template: {
      id: "subscription-cancel",
      variables: {
        USER_NAME: user.name ?? "there",
        planName: sub.plan,
        accessEndDate: sub.endDate.toDateString(),
        dashboardUrl: "https://pravyatech.tech/dashboard",
      },
    },
  });
}

/* -----------------------------
   Invoice / Payment Success
------------------------------ */
export async function sendInvoiceEmail(
  userId: string,
  payment: any,
  data: any
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  if (!user?.email) return;

  const invoiceId = data?.invoice_id;
  const invoiceUrl = data?.invoice_url;

  if (!invoiceId || !invoiceUrl) {
    console.warn("Invoice details missing for payment:", payment.paymentId);
    return;
  }

  await resend.emails.send({
    from: "Pravya AI <no-reply@pravyatech.tech>",
    to: user.email,
    subject: "Payment successful – Invoice available",
    template: {
      id: "payment-success",
      variables: {
        invoiceNumber: invoiceId,
        planName: "Subscription",
        amount: `${payment.currency} ${payment.amount}`,
        paymentDate: payment.createdAt.toDateString(),
        invoiceUrl: invoiceUrl,
      },
    },
  });
}
