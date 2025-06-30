"use client";
import { AuthCheck } from "@/components/auth/AuthCheck";
import React, { useEffect, useState } from "react";
import { User } from "@prisma/client";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import UserDetailsCard from "@/components/admin/users/UserDetailsCard";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const { id } = React.use(params);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`/api/protected/users/${id}`)
      .then((res: any) => {
        setUser(res.data.user);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("خطا در دریافت اطلاعات کاربر");
        router.push("/admin/users");
      });
  }, [id, router]);

  return (
    <AuthCheck
      allowedRoles={["SUPERADMIN"]}
      fallback={
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              دسترسی غیرمجاز
            </h2>
            <p>شما دسترسی مشاهده و مدیریت کاربران را ندارید.</p>
          </div>
        </div>
      }
    >
      <div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-10">
              <PulseLoader color="#36d7b7" size={20} loading={isLoading} />
            </div>
          ) : user ? (
            <UserDetailsCard user={user} isLoading={false} />
          ) : (
            <div className="p-6 text-center text-red-500">
              کاربر مورد نظر یافت نشد
            </div>
          )}
        </div>
      </div>
    </AuthCheck>
  );
}
