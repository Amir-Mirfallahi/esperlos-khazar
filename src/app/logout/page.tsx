"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function LogoutPage() {
  const router = useRouter();

  signOut({ redirect: false });
  useEffect(() => {
    router.push("/login");
  }, [router]);
}
