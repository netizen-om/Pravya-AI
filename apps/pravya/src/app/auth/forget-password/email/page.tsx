"use client";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthInput } from "@/components/ui/auth-input";
import { AuthButton } from "@/components/ui/auth-button";
import { toast } from "sonner";

const TITLE_CLASSES = "text-2xl font-semibold text-white mb-6 font-['ABCFavorit',ui-sans-serif,system-ui,sans-serif,'Apple_Color_Emoji','Segoe_UI_Emoji','Segoe_UI_Symbol','Noto_Color_Emoji'] tracking-tight";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      setIsLoading(true);

      try {
        const response = await axios.post("/api/send-forget-password-email", {
          email
        });

        if (response.status === 200) {
          toast.success("Forget-password email sent");
          router.push("/auth/sign-in");
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || "An unexpected error occurred.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [email, router]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    []
  );

  return (
    <>
      <div className="text-center mb-6">
        <div className="inline-block w-12 mb-6" />
        <h1 className={TITLE_CLASSES}>Forget Password</h1>
        <span className="text-gray-400 text-sm">
          Please enter your email to recieve forget password mail
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-sm text-center -mb-2">{error}</p>}
        
        <AuthInput
          id="email"
          name="email"
          type="email"
          placeholder=" "
          value={email}
          onChange={handleEmailChange}
          required
        />

        <AuthButton type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Confirm"}
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

export default ForgotPassword;