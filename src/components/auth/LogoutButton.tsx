"use client";

import { signOut } from "next-auth/react";
import { ButtonHTMLAttributes } from "react";

interface LogoutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  callbackUrl?: string;
  variant?: "primary" | "outline" | "destructive";
}

export function LogoutButton({
  callbackUrl = "/",
  variant = "destructive",
  children,
  className,
  ...props
}: LogoutButtonProps) {
  const baseStyles = "font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${className || ""}`;

  return (
    <button
      {...props}
      className={buttonStyles}
      onClick={() => signOut({ callbackUrl })}
    >
      {children || "خروج از حساب کاربری"}
    </button>
  );
} 