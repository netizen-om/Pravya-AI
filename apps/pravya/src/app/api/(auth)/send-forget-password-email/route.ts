import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/mailer";
import { prisma } from "@/lib/prismadb";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req : NextRequest) {
  const { email } = await req.json();
  try {

    const user = await prisma.user.findUnique({
      where : { email },
      include: {
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    })

    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 500 });
    }
    
    const provider = user.accounts.length > 0 ? user.accounts[0].provider : null;
    
    if(provider) {
      return NextResponse.json({ error: "Password reset is not available. You signed in using Google/GitHub." }, { status: 500 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/forget-password?token=${token}`;
    console.log("Attempting to send verification email to:", user.email);

    try {
      await sendEmail({
        to: user.email!,
        subject: "Verify Your Email - Pravya AI",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a202c; margin: 0;">Pravya AI</h1>
                    <p style="color: #4a5568; margin: 10px 0;">Your interview advantage, powered by AI.</p>
                </div>
                
                <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #e6ebf1;">
                    <h2 style="color: #1a202c; text-align: center; margin-bottom: 30px;">Reset Your Password</h2>
                    
                    <p style="color: #4a5568; text-align: center; margin-bottom: 30px; line-height: 1.6;">
                    We received a request to reset your password. Click the button below to choose a new one. This link expires in 15 minutes.
                    </p>
                    
                    <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetUrl}" 
                        style="background-color: #000000; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                        Reset Password
                    </a>
                    </div>
                    
                    <p style="color: #718096; text-align: center; font-size: 14px; margin-top: 30px;">
                    If you did not request a password reset, you can safely ignore this email. Your password will not be changed.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #a0aec0; font-size: 12px;">
                    <p>Pravya AI</p>
                    <p>Your interview advantage, powered by AI.</p>
                </div>
            </div>
        `,
        text: `Visit this link to reset password your email: ${resetUrl}`,
      });

      return NextResponse.json({
        success: true,
        message: "Verification email sent successfully",
      }, {status : 200});
    } catch (emailError) {
      console.error("[EMAIL_SEND_ERROR]", emailError);
      return NextResponse.json(
        {
          error:
            "Failed to send verification email. Please check your email configuration.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[SEND_VERIFICATION]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
