// src/app/api/(auth)/send-verification-email/route.ts

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/mailer";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST() {
  try {
    const currentUser = await getCurrentUser();
    if(!currentUser) {
        return NextResponse.json(
        { error: "User not found" }, 
        { status: 500 }
      );
    }
    
    if (currentUser.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" }, 
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: currentUser.id, email: currentUser.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
    console.log("Attempting to send verification email to:", currentUser.email);

    try { 
      await sendEmail({
        to: currentUser.email!,
        subject: "Verify Your Email - Pravya AI",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1a202c; margin: 0;">Pravya AI</h1>
              <p style="color: #4a5568; margin: 10px 0;">Your interview advantage, powered by AI.</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #e6ebf1;">
              <h2 style="color: #1a202c; text-align: center; margin-bottom: 30px;">Verify your email</h2>
              
              <p style="color: #4a5568; text-align: center; margin-bottom: 30px; line-height: 1.6;">
                Click the button below to securely verify your account. This link expires in 15 minutes.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verifyUrl}" 
                   style="background-color: #000000; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                  Verify Email
                </a>
              </div>
              
              <p style="color: #718096; text-align: center; font-size: 14px; margin-top: 30px;">
                If you didn't request this, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #a0aec0; font-size: 12px;">
              <p>Pravya AI</p>
              <p>Your interview advantage, powered by AI.</p>
            </div>
          </div>
        `,
        text: `Visit this link to verify your email: ${verifyUrl}`,
      });

      return NextResponse.json({ 
        success: true,
        message: "Verification email sent successfully" 
      });
    } catch (emailError) {
      console.error("[EMAIL_SEND_ERROR]", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email. Please check your email configuration." }, 
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