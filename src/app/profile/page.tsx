"use client";

import { AuthCheck } from "@/components/auth/AuthCheck";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 px-4 py-8 text-white text-center">
            <h1 className="text-2xl font-bold">پروفایل کاربری</h1>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">اطلاعات شخصی</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">نام کامل</p>
                  <p className="font-medium">{session?.user?.name}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm">ایمیل</p>
                  <p className="font-medium">{session?.user?.email}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm">نقش کاربری</p>
                  <p className="font-medium">{session?.user?.role}</p>
                </div>
              </div>
            </div>
            
            <LogoutButton className="w-full" />
          </div>
        </div>
      </div>
    </AuthCheck>
  );
} 