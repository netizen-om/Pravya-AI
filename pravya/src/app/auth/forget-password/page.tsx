"use client";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthInput } from "@/components/ui/auth-input";
import { AuthButton } from "@/components/ui/auth-button";
import { z } from "zod";
import { toast } from "sonner";
// import { passwordSchema } from "@/utlis/zod";
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

const TITLE_CLASSES =
  "text-2xl font-semibold text-white mb-6 font-['ABCFavorit',ui-sans-serif,system-ui,sans-serif,'Apple_Color_Emoji','Segoe_UI_Emoji','Segoe_UI_Symbol','Noto_Color_Emoji'] tracking-tight";

function ForgotPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      console.log("Password : ", password);
      console.log("Confirm Password : ", confirmPassword);
      try {
        resetPasswordSchema.parse({ password, confirmPassword });
      } catch (err) {
        if (err instanceof z.ZodError) {
          const validationError = err.errors[0].message;
          console.log(err);

          setError(validationError);
          toast.error(validationError);
          return;
        }
      }

      if (!token) {
        setError("Password reset token is missing.");
        return;
      }

      setIsLoading(true);

      try {
        const response = await axios.post("/api/forget-password", {
          newPassword: password,
          token,
        });

        if (response.status === 200) {
          toast.success("Password updated successfully!");
          router.push("/auth/sign-in");
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "An unexpected error occurred.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [password, token, router]
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );

  const handleConfirmPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value); // always gives the input value
    },
    []
  );

  return (
    <>
      <div className="text-center mb-6">
        <div className="inline-block w-12 mb-6" />
        <h1 className={TITLE_CLASSES}>Set a New Password</h1>
        <span className="text-gray-400 text-sm">
          Choose your new password to get started
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-red-500 text-sm text-center -mb-2">{error}</p>
        )}

        <AuthInput
          id="password"
          name="New password"
          type="password"
          placeholder=" "
          value={password}
          onChange={handlePasswordChange}
          required
        />

        <AuthInput
          id="ConfirmPassword"
          name="Confirm password"
          type="password"
          placeholder=" "
          value={confirmPassword}
          // onChange={handleConfirmPasswordChange}
          onChange={(e: any) => setConfirmPassword(e.target.value)}
          required
        />

        <AuthButton type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
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
