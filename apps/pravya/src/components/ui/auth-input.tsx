import Link from "next/link";
import React from "react";

interface AuthInputProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoFocus?: boolean;
  error?: string;
  isForgetPassword? : boolean
}

export function AuthInput({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  autoFocus = false,
  error,
  isForgetPassword = false
}: AuthInputProps) {

  return (
    <div className="flex flex-col gap-2 gap-y-2 mb-5">
      <label
        htmlFor={id}
        className="text-sm leading-5 cursor-default border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400"
      >
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        id={id}
        name={name}
        className="relative px-4 w-full h-12 text-sm leading-5 focus:outline-gray-950 text-white cursor-textbackdrop-blur-[25px] bg-origin-border rounded-2xl border-solid ease-in-out outline-white select-none backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] bg-black bg-opacity-0 border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] decoration-white duration-[0.2s] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px]"
        autoFocus={autoFocus}
        required={required}
        value={value}
        onChange={onChange}
      />

      { isForgetPassword && (
        <Link href={"/auth/forget-password/email"} className="text-white cursor-pointer">Forget Password?</Link>
      )}

      {error && (
        <div className="mt-1 text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
} 