"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { z } from "zod";
import GoogleLogo from "@/components/icons/GoogleLogo";
import GithubLogo from "@/components/GithubLogo";
import axios from "axios";
import { getErrorMessage } from "@/utlis/getErrorMessage";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthInput } from "@/components/ui/auth-input";
import { AuthButton } from "@/components/ui/auth-button";
import { SocialLoginButton } from "@/components/ui/social-login-button";
import { signupSchema } from "@/utlis/zod";

interface SignupFormProps {
  className?: string;
}


export default function Signup({ className = "" }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Handle URL error parameters
  useEffect(() => {
    if (error) {
      const message = getErrorMessage(error);
      setTimeout(() => {
        toast.error(message);
      }, 100);
    }
  }, [error]);

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setEmail(value);
    const result = signupSchema.safeParse({ email: value, password });
    setErrors(prev => ({
      ...prev,
      email: result.success ? "" : result.error.formErrors.fieldErrors.email?.[0] || ""
    }));
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setPassword(value);
    const result = signupSchema.safeParse({ email, password: value });
    setErrors(prev => ({
      ...prev,
      password: result.success ? "" : result.error.formErrors.fieldErrors.password?.[0] || ""
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = signupSchema.safeParse({ email, password });
    setErrors({
      email: result.success ? "" : result.error.formErrors.fieldErrors.email?.[0] || "",
      password: result.success ? "" : result.error.formErrors.fieldErrors.password?.[0] || "",
    });
    
    if (!result.success) {
      // Show toast for validation errors
      const firstError = result.error.formErrors.fieldErrors.email?.[0] || result.error.formErrors.fieldErrors.password?.[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }
    
    setIsLoading(true);
    try {
      
      const res = await axios.post("/api/signup", {
        email,
        password,
        name : "check123",
        redirect: true,
        callbackUrl: "/dashboard"
      })
      console.log("is 200 : " , res.status === 200)

      if (res.status === 200) {
        toast.success("Account created successfully! Signing you in...");
        await signIn("credentials", {
          redirect: true,
          email,
          password,
          callbackUrl : "/dashboard"
        });
      }
    } catch (error) {
      console.error("Error SIGNUP : ", error);
      
      // Handle different types of errors
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string }, status?: number } };
        if (axiosError.response?.data?.error) {
          const errorMessage = getErrorMessage(axiosError.response.data.error);
          toast.error(errorMessage);
        } else if (axiosError.response?.status === 409) {
          toast.error("Email already in use. Please try a different email.");
        } else if (axiosError.response?.status === 400) {
          toast.error("Invalid data provided. Please check your information.");
        } else {
          toast.error("Failed to create account. Please try again.");
        }
      } else {
        toast.error("Failed to create account. Please try again.");
      }
      
    } finally {
      setIsLoading(false);
    }
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

  return (
    <>
          <div className="mb-6 text-center">
            {/* Resend Logo  */}
            {/* <svg
              className="inline-block w-10"
              fill="none"
              viewBox="0 0 78 78"
              width="40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="1"
                width="76"
                height="76"
                rx="21"
                stroke="#FDFDFD"
                strokeOpacity="0.1"
                strokeWidth="2"
              />
              <path
                d="M43.0184 21C49.9908 21 54.1374 25.1467 54.1374 30.6513C54.1374 36.1558 49.9908 40.3025 43.0184 40.3025H39.4953L57 57H44.6329L31.3118 44.3394C30.3578 43.4587 29.9174 42.4312 29.9174 41.5506C29.9174 40.3029 30.7984 39.202 32.4864 38.7249L39.3485 36.8897C41.954 36.1925 43.7522 34.1741 43.7522 31.5319C43.7522 28.3027 41.1098 26.4312 37.8438 26.4312H21V21H43.0184Z"
                fill="url(#paint0_linear_1382_599)"
              />
              <path
                d="M54.1375 30.6513C54.1374 25.1467 49.9908 21 43.0184 21V20.55C46.5934 20.55 49.4879 21.6142 51.4941 23.4275C53.4405 25.1867 54.5189 27.6229 54.5844 30.3832L54.5875 30.6513C54.5875 33.5218 53.5032 36.0591 51.4941 37.875C49.5505 39.6317 46.7734 40.6853 43.3515 40.7495L43.0184 40.7525H40.619L58.1237 57.45H44.4532L44.3231 57.3261L31.0064 44.6694C29.978 43.7199 29.4675 42.579 29.4674 41.5506C29.4674 40.0491 30.5379 38.8082 32.3643 38.292L32.37 38.2903L39.2321 36.4551C41.6742 35.8016 43.3023 33.9377 43.3023 31.5319C43.3023 30.0523 42.7022 28.9051 41.7383 28.1191C40.7652 27.3258 39.3949 26.8812 37.8438 26.8812H20.55V20.55H43.0184V21H21V26.4312H37.8438C41.1098 26.4312 43.7522 28.3027 43.7523 31.5319C43.7523 34.1741 41.954 36.1925 39.3485 36.8897L32.4865 38.7249C30.7984 39.202 29.9174 40.3029 29.9174 41.5506C29.9175 42.4312 30.3578 43.4587 31.3118 44.3393L44.633 57H57.0001L39.4953 40.3025H43.0184C49.9909 40.3025 54.1375 36.1558 54.1375 30.6513Z"
                fill="url(#paint1_linear_1382_599)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1382_599"
                  x1="39"
                  y1="21"
                  x2="58.1887"
                  y2="56.4242"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FDFDFD" />
                  <stop offset="1" stopColor="#ADADAD" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_1382_599"
                  x1="39.3369"
                  y1="20.55"
                  x2="58.8097"
                  y2="57.1549"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FDFDFD" />
                  <stop offset="1" stopColor="#ADADAD" />
                </linearGradient>
              </defs>
            </svg> */}

            <h1 className="mt-6 text-3xl font-semibold tracking-tighter leading-9 text-center text-white">
              Create a Pravya Account
            </h1>
            <span className="inline text-sm leading-5 text-center border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400">
              Already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="text-sm font-semibold leading-5 text-center ease-in-out cursor-pointer duration-[0.15s] transition-[color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to] text-white"
              >
                Log in
              </Link>
              .
            </span>
          </div>

          <div className="flex gap-4 gap-4 gap-y-4 gap-y-4 items-center mb-4">
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
            />

            <AuthButton type="submit" disabled={!isFormValid() || isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </AuthButton> 
          </form>

          <p className="mt-8 text-xs leading-4 text-center border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400">
            By signing up, you agree to our{" "}
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