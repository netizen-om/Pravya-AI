import nodemailer from "nodemailer";

// Create a transporter using Gmail credentials
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Email sending function
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
    console.log("Attempting to send email to:", to);
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_SERVER_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}
