import React from "react";

interface SocialLoginButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function SocialLoginButton({ onClick, icon, children }: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group hover:bg-white/90 hover:text-black inline-flex relative gap-0 gap-y-0 gap-y-0 justify-center items-center px-5 w-full h-12 font-semibold text-center text-white bg-origin-border rounded-2xl border-solid ease-in-out cursor-pointer outline-white select-none backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] bg-black bg-opacity-0 border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] decoration-white duration-[0.2s] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px]"
    >
      {icon}
      <span className="text-sm group-hover:text-black font-semibold leading-5 text-center text-white border-white cursor-pointer outline-white select-none decoration-white">
        {children}
      </span>
    </button>
  );
} 