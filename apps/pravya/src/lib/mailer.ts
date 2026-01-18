import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    //@ts-ignore
    const data = await resend.emails.send({
      from: "Pravya AI <no-reply@pravyatech.tech>",
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully:", to);
    return data;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}
