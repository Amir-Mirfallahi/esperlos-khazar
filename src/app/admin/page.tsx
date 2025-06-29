"use client";

import { useSession } from "next-auth/react";
import { AuthCheck } from "@/components/auth/AuthCheck";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({
    userCount: 0,
    productCount: 0,
    categoryCount: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);

      const response = await fetch("/api/protected/counts");
      const data = await response.json();
      setCounts(data.counts);
      setIsLoading(false);
    };
    fetchCounts();
  }, []);

  return (
    <html lang="en">
      <body>
        <AuthCheck allowedRoles={["SUPERADMIN", "PRODUCTMANAGER"]}>
          <div>
            <h1 className="text-2xl font-bold mb-6">داشبورد مدیریت</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-lg font-semibold mb-4">خوش آمدید!</h2>
              <p className="mb-2">
                سلام <strong>{session?.user?.name}</strong>، به پنل مدیریت پارس
                گستر اسپرلوس خزر خوش آمدید.
              </p>
              <p>
                از طریق منوی سمت راست می‌توانید به بخش‌های مختلف پنل مدیریت
                دسترسی داشته باشید.
                {session?.user?.role === "PRODUCTMANAGER" && (
                  <span className="block mt-2 text-blue-600">
                    شما به عنوان مدیر محصول، می‌توانید محصولات و دسته‌بندی‌ها را
                    مدیریت کنید.
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {session?.user?.role === "SUPERADMIN" && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">کاربران</h3>
                  <div className="flex justify-between items-center">
                    {isLoading ? (
                      <PulseLoader
                        color="#36d7b7"
                        size={20}
                        loading={isLoading}
                      />
                    ) : (
                      <p className="text-3xl font-bold">{counts.userCount}</p>
                    )}
                    <div className="p-3 bg-blue-100 text-blue-500 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">محصولات</h3>
                <div className="flex justify-between items-center">
                  {isLoading ? (
                    <PulseLoader
                      color="#36d7b7"
                      size={20}
                      loading={isLoading}
                    />
                  ) : (
                    <p className="text-3xl font-bold">{counts.productCount}</p>
                  )}
                  <div className="p-3 bg-green-100 text-green-500 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">دسته‌بندی‌ها</h3>
                <div className="flex justify-between items-center">
                  {isLoading ? (
                    <PulseLoader
                      color="#36d7b7"
                      size={20}
                      loading={isLoading}
                    />
                  ) : (
                    <p className="text-3xl font-bold">{counts.categoryCount}</p>
                  )}
                  <div className="p-3 bg-purple-100 text-purple-500 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AuthCheck>
      </body>
    </html>
  );
}
