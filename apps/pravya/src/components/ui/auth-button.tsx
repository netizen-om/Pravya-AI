import React from "react";

interface AuthButtonProps {
  type: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AuthButton({
  type,
  onClick,
  disabled = false,
  children,
  className = ""
}: AuthButtonProps) {
  const baseClasses = "group inline-flex hover:bg-white/90 hover:text-black relative gap-0 gap-y-0 justify-center items-center px-5 w-full h-12 text-sm font-semibold leading-5 text-center bg-origin-border rounded-2xl border-solid ease-in-out select-none backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] bg-black bg-opacity-0 border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] duration-[0.2s] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px]";
  
  const disabledClasses = disabled ? "opacity-30 cursor-not-allowed" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabledClasses} ${className}`}
    >
      <span className="group-hover:text-black">{children}</span>
    </button>
  );
} 