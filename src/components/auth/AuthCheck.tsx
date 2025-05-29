"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthCheckProps {
  children: ReactNode;
  fallback?: ReactNode;
  allowedRoles?: string[];
}

export function AuthCheck({ 
  children, 
  fallback,
  allowedRoles 
}: AuthCheckProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push("/login");
    }
    
    // If authenticated but role not allowed, redirect to home
    if (status === "authenticated" && 
        allowedRoles && 
        session?.user?.role && 
        !allowedRoles.includes(session.user.role)) {
      router.push("/");
    }
  }, [status, router, session, allowedRoles]);
  
  // Show fallback while loading
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">در حال بارگذاری...</h2>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // If unauthenticated and fallback provided, show fallback
  if (status === "unauthenticated" && fallback) {
    return <>{fallback}</>;
  }
  
  // If authenticated but role not allowed and fallback provided, show fallback
  if (status === "authenticated" && 
      allowedRoles && 
      session?.user?.role && 
      !allowedRoles.includes(session.user.role) && 
      fallback) {
    return <>{fallback}</>;
  }
  
  // If authenticated and role allowed (or no role check), show children
  if (status === "authenticated" && 
      (!allowedRoles || 
       (session?.user?.role && allowedRoles.includes(session.user.role)))) {
    return <>{children}</>;
  }
  
  // Default: show nothing while checking or redirecting
  return null;
} 