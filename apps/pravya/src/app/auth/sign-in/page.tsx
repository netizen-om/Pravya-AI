"use client";

import GithubLogo from "@/components/GithubLogo";
import GoogleLogo from "@/components/icons/GoogleLogo";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { getErrorMessage } from "@/utlis/getErrorMessage";
import { AuthInput } from "@/components/ui/auth-input";
import { AuthButton } from "@/components/ui/auth-button";
import { SocialLoginButton } from "@/components/ui/social-login-button";
import { signinSchema } from "@/utlis/zod";

export default function SignIn({ className = "" }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
      email: "",
      password: "",
  });

  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  


  useEffect(() => {
    if (error) {
      const message = getErrorMessage(error);
      console.log("Error detected:", error, "Message:", message);
      setTimeout(() => {
        toast.error(message);
      }, 100);
    }
  }, [error]);


  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
      const value = event.target.value;
      setEmail(value);
      const result = signinSchema.safeParse({ email: value, password });
      setErrors(prev => ({
        ...prev,
        email: result.success ? "" : result.error.formErrors.fieldErrors.email?.[0] || ""
      }));
  }
  
  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
      const value = event.target.value;
      setPassword(value);
      const result = signinSchema.safeParse({ email, password: value });
      setErrors(prev => ({
        ...prev,
        password: result.success ? "" : result.error.formErrors.fieldErrors.password?.[0] || ""
      }));
  }

  function isFormValid() {
      return email && password && !errors.email && !errors.password;
  }
  
  async function handleGoogleSignIn() {
    try {
      await signIn('google', {
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch {
      toast.error("Failed to sign in with Google. Please try again.");
    }
  } 
  
  async function handleGitHubSignIn() {
    try {
      await signIn('github', {
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch {
      toast.error("Failed to sign in with GitHub. Please try again.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const result = signinSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || "",
      });
      
      // Show toast for validation errors
      const firstError = fieldErrors.email?.[0] || fieldErrors.password?.[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    try {
      await signIn("credentials", {
        redirect: true,
        email,
        password,
        callbackUrl: "/dashboard",
      });
    } catch {
      toast.error("Failed to sign in. Please check your credentials and try again.");
    }
  }

  return (
    <>
          <div className="mb-6 text-center">
            {/* Logo comes here */}

            <h1 className="mt-6 text-3xl font-semibold tracking-tighter leading-9 text-center text-white">
              Log in to Pravya
            </h1>
            <span className="inline text-sm leading-5 text-center border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-sm font-semibold leading-5 text-center ease-in-out cursor-pointer duration-[0.15s] transition-[color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to] text-white"
              >
                Sign up.
              </Link>
              .
            </span>
          </div>

          <div className="flex gap-4 gap-y-4 items-center mb-4">
            <SocialLoginButton onClick={handleGoogleSignIn} icon={<GoogleLogo />}>
              Login with Google
            </SocialLoginButton>

            <SocialLoginButton onClick={handleGitHubSignIn} icon={<GithubLogo />}>
              Login with GitHub
            </SocialLoginButton>
          </div>

          <div className="flex justify-center items-center my-6">
            <div
              aria-hidden="true"
              role="separator"
              className="w-full h-px bg-neutral-800"
            />
            <span className="mx-4 text-sm leading-5 border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400">
              or
            </span>
            <div
              aria-hidden="true"
              role="separator"
              className="w-full h-px bg-neutral-800"
            />
          </div>

          <form autoComplete="off" onSubmit={handleSubmit}>
            <AuthInput
              id="email"
              name="email"
              type="email"
              placeholder="alan.turing@example.com"
              value={email}
              onChange={handleEmailChange}
              required
              autoFocus
              error={errors.email}
            />

            <AuthInput
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={handlePasswordChange}
              required
              error={errors.password}
              isForgetPassword={true}
            />

            <AuthButton type="submit" disabled={!isFormValid()}>
              Log in
            </AuthButton> 
          </form>

          <p className="mt-8 text-xs leading-4 text-center border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400">
            By signing in, you agree to our{" "}
            <a
              target="_blank"
              href="/terms"
              className="text-xs leading-4 text-center underline cursor-pointer border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400"
            >
              Terms
            </a>
            ,{" "}
            <a
              target="_blank"
              href="/acceptable-use"
              className="text-xs leading-4 text-center underline cursor-pointer border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400"
            >
              Acceptable Use
            </a>
            , and{" "}
            <a
              target="_blank"
              href="/privacy"
              className="text-xs leading-4 text-center underline cursor-pointer border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400"
            >
              Privacy Policy
            </a>
            .
          </p>
    </>
  );
}
