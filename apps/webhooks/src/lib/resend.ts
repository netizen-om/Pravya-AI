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

  const emailHtml = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1a202c; margin: 0; font-size: 25px">Pravya AI</h1>
    <p style="color: #4a5568; margin: 10px 0;">
      Your interview advantage, powered by AI.
    </p>
  </div>

  <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #e6ebf1;">
    
    <h2 style="color: #1a202c; text-align: center; margin-bottom: 24px;">
      Subscription activated
    </h2>

    <p style="color: #4a5568; text-align: center; line-height: 1.6; margin-bottom: 28px;">
      Your Pravya AI subscription is now active. You have full access to all features included in your plan.
    </p>

    <div style="background-color: #f9fafb; border: 1px solid #e6ebf1; border-radius: 8px; padding: 16px; margin-bottom: 30px;">
      <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
        <strong>Plan:</strong> Pravya Pro<br>
        <strong>Status:</strong> Active<br>
        <strong>Next billing date:</strong> ${sub.endDate.toDateString()}
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://pravyatech.tech/dashboard" style="background-color: #000000; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
        Go to dashboard
      </a>
    </div>

  </div>

  <div style="text-align: center; margin-top: 30px; color: #a0aec0; font-size: 12px;">
    <p>Pravya AI</p>
    <p>Your interview advantage, powered by AI.</p>
  </div>

</div>
`;

  await resend.emails.send({
    from: "Pravya AI <billing@pravyatech.tech>",
    to: user.email,
    subject: "Your subscription is now active",
    html: emailHtml,
  });
}

/* -----------------------------
   Subscription Cancelled Email
------------------------------ */
export async function sendSubscriptionCancelledEmail(userId: string, sub: any) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  if (!user?.email) return;

  const emailHtml = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1a202c; margin: 0; font-size: 25px;">Pravya AI</h1>
    <p style="color: #4a5568; margin: 10px 0;">
      Your interview advantage, powered by AI.
    </p>
  </div>

  <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #e6ebf1;">

    <h2 style="color: #1a202c; text-align: center; margin-bottom: 24px;">
      Subscription cancelled
    </h2>

    <p style="color: #4a5568; text-align: center; line-height: 1.6; margin-bottom: 28px;">
      This is a confirmation that your Pravya AI subscription has been cancelled.
    </p>

    <div style="background-color: #f9fafb; border: 1px solid #e6ebf1; border-radius: 8px; padding: 16px; margin-bottom: 30px;">
      <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
        <strong>Plan:</strong> Pravya Pro<br>
        <strong>Access available until:</strong> ${sub.endDate.toDateString()}
      </p>
    </div>

    <p style="color: #4a5568; text-align: center; line-height: 1.6;">
      You’ll continue to have access until the end of your current billing period.
      No further charges will be made.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://pravyatech.tech/dashboard" style="background-color: #000000; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
        Manage subscription
      </a>
    </div>

    <p style="color: #718096; text-align: center; font-size: 14px; margin-top: 30px;">
      Thank you for using Pravya AI. If you have feedback, we’d love to hear it.
    </p>
  </div>

  <div style="text-align: center; margin-top: 30px; color: #a0aec0; font-size: 12px;">
    <p>Pravya AI</p>
    <p>Your interview advantage, powered by AI.</p>
  </div>

</div>
`;

  await resend.emails.send({
    from: "Pravya AI <billing@pravyatech.tech>",
    to: user.email,
    subject: "Your subscription has been cancelled",
    html: emailHtml,
  });
}

/* -----------------------------
   Invoice / Payment Success
------------------------------ */
export async function sendInvoiceEmail(
  userId: string,
  payment: any,
  data: any,
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

  const emailHtml = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">

  
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1a202c; margin: 0;">Pravya AI</h1>
    <p style="color: #4a5568; margin: 10px 0;">
      Your interview advantage, powered by AI.
    </p>
  </div>

  
  <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #e6ebf1;">
    
    <h2 style="color: #1a202c; text-align: center; margin-bottom: 24px;">
      Payment successful
    </h2>

    <p style="color: #4a5568; text-align: center; line-height: 1.6; margin-bottom: 28px;">
      We’ve successfully processed your payment.  
      Your invoice is now available.
    </p>

    
    <div style="background-color: #f9fafb; border: 1px solid #e6ebf1; border-radius: 8px; padding: 16px; margin-bottom: 30px;">
      <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.7;">
        <strong>Invoice number:</strong> ${invoiceId}}<br>
        <strong>Plan:</strong> Pravya Pro<br>
        <strong>Amount paid:</strong> ${payment.currency} ${payment.amount}}<br>
        <strong>Payment date:</strong> ${payment.createdAt.toDateString()}}
      </p>
    </div>

    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${invoiceUrl}}" style="background-color: #000000; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
        View invoice
      </a>
    </div>

 <p style="color: #718096; text-align: center; font-size: 14px; margin-top: 30px;">
  This is an automated email. Please do not reply.
</p>

  </div>

  
  <div style="text-align: center; margin-top: 30px; color: #a0aec0; font-size: 12px;">
    <p>Pravya AI</p>
    <p>Your interview advantage, powered by AI.</p>
  </div>

</div>
`;

  await resend.emails.send({
    from: "Pravya AI <no-reply@pravyatech.tech>",
    to: user.email,
    subject: "Payment successful – Invoice available",
    html: emailHtml,
  });
}
