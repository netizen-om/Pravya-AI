"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { getSession, signIn, signOut, useSession } from "next-auth/react";

export default function VerifyEmailPage() {

  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Missing verification token.");
        return;
      }

      try {
        const response = await axios.post("/api/verify-email", { token });

        if (response.status === 200) {
          setStatus("success");
          setMessage("Email verified successfully! Redirecting to dashboard...");
          await signOut({ redirect: true, callbackUrl : "/auth/sign-in" });
        } else {
          setStatus("error");
          setMessage(`Verification failed: ${response.data.error || "Unknown error."}`);
        }
      } catch (error: any) {
        const errMsg =
          error.response?.data?.error || error.message || "Verification failed";
        setStatus("error");
        setMessage(` Verification failed: ${errMsg}`);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4 text-white">Email Verification</h1>
        <p
          className={`text-lg ${
            status === "success"
              ? "text-green-400"
              : status === "error"
              ? "text-red-400"
              : "text-gray-400"
          }`}
        >
          {message}
        </p>
      </div>
    </>
  );
}
