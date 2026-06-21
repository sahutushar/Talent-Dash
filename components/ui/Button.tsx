import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";
  const variants = {
    primary: "bg-[#FF5A5F] text-white hover:bg-[#e84f54] focus:ring-[#FF5A5F]",
    secondary: "bg-[#222222] text-white hover:bg-[#333333] focus:ring-[#222222]",
    ghost: "text-[#484848] hover:bg-[#F2F2F2] focus:ring-[#EBEBEB]",
    outline: "border border-[#EBEBEB] text-[#484848] hover:bg-[#F7F7F7] focus:ring-[#EBEBEB]",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
