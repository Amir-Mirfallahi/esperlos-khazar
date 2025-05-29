"use client";

import { useState } from "react";
import { AuthCheck } from "@/components/auth/AuthCheck";
import { useEffect } from "react";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import { User as UserType } from "@prisma/client";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/protected/users")
      .then((res) => {
        setUsers(res.data.users);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            افزودن کاربر جدید
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <PulseLoader color="#36d7b7" size={20} loading={isLoading} />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    نام
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ایمیل
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    نقش
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        user.role === "SUPERADMIN"
                          ? "bg-red-100 text-red-800"
                          : user.role === "PRODUCTMANAGER"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                      >
                        {user.role === "SUPERADMIN"
                          ? "مدیر ارشد"
                          : user.role === "PRODUCTMANAGER"
                          ? "مدیر محصول"
                          : "کاربر عادی"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/users/edit/${user.id}`}
                        className="text-blue-600 hover:text-blue-900 ml-3"
                      >
                        جزئیات
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AuthCheck>
  );
}
