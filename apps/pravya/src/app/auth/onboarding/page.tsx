"use client";
import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
import { AuthInput } from "@/components/ui/auth-input";
import { AuthButton } from "@/components/ui/auth-button";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

const CheckIcon = () => (
  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);


// Extract repeated class strings to constants
const TITLE_CLASSES = "text-2xl font-semibold text-white mb-6 font-['ABCFavorit',ui-sans-serif,system-ui,sans-serif,'Apple_Color_Emoji','Segoe_UI_Emoji','Segoe_UI_Symbol','Noto_Color_Emoji'] tracking-tight";

// Memoized success screen component
const SuccessScreen = ({ username, userEmail }: { username: string; userEmail?: string }) => {
  const [hasAttemptedSend, setHasAttemptedSend] = useState(false);

  return (
    <>
        <div className="text-center mb-6">
          {/* Logo */}
          <div className="inline-block w-12 mb-6">
    
          </div>

          <h1 className={TITLE_CLASSES}>
            Welcome, {username}!
          </h1>

          <div className="space-y-4 text-gray-400">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckIcon />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-white mb-4">
              Check your email
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
                "We've sent a verification link to your email address. Please click the link to verify your account and complete the setup process."
            </p>

            <div className="mt-8 p-4 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md">
              <div className="flex items-center justify-center gap-3">
                <div className="text-sm text-gray-400">
                  <p className="font-medium text-gray-300 mb-1">Didn't receive the email?</p>
                  <p>Check your spam folder or contact support if you need assistance.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full h-12 px-5 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md text-white font-semibold text-sm transition-all duration-200 hover:from-white/10 hover:to-white/[0.04] hover:border-white/10"
            >
              Back to home
            </Link>
          </div>
        </div>
    </>
  );
};

export default function Onboarding() {
  const [username, setUsername] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Memoize the form submit handler
  const handleSubmit = useCallback(async(e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (!trimmedUsername) return;

    try {
      const response = await axios.post("/api/user/update-username", {
        username: trimmedUsername,
      });

      if (response.status === 200) {
        setIsSubmitted(true);
        console.log("Username updated successfully:", response.data);
      }
      
      try {
        // Send verification email without additional data
        const response = await axios.post('/api/send-verification-email');
        if (response.status === 200) {
          toast.success("Verification email sent")
          console.log('Verification email sent successfully');
        } 

        setTimeout(() => {
          signOut({ callbackUrl: "/dashboard" });
        }, 3000);
        
      } catch (error) {
        console.error('Error sending verification email:', error);
        toast.error('Failed to send verification email. Please try again.');
      }

    } catch (error: any) {
      console.error("Failed to update username:", error?.response?.data || error.message);
    }
  }, [username]);

  // Memoize the input change handler
  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, []);

  // Memoize the trimmed username check
  const isUsernameValid = useMemo(() => username.trim().length > 0, [username]);

  if (isSubmitted) {
    return <SuccessScreen username={username} />;
  }

  return (
    <>
        <div className="text-center mb-6">
          {/* Logo placeholder */}
          <div className="inline-block w-12 mb-6" />

          <h1 className={TITLE_CLASSES}>
            Complete your setup
          </h1>

          <span className="text-gray-400 text-sm">
            Choose your username to get started
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            id="username"
            name="username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={handleUsernameChange}
            required
          />

          <AuthButton type="submit" disabled={!isUsernameValid}>
            Continue
          </AuthButton>
        </form>

        <p className="text-xs text-gray-400 text-center mt-8">
          <span>By continuing, you agree to our </span>
          <a href="#" className="underline hover:text-gray-300 transition-colors">
            Terms
          </a>
          <span> and </span>
          <a href="#" className="underline hover:text-gray-300 transition-colors">
            Privacy Policy
          </a>
          <span>.</span>
        </p>
    </>
  );
}