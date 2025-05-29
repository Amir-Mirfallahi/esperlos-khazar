"use client";

import { AuthCheck } from "@/components/auth/AuthCheck";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when path changes (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Define navigation items based on user role
  const navigationItems = [
    {
      name: "داشبورد",
      href: "/admin",
      roles: ["SUPERADMIN", "PRODUCTMANAGER"],
    },
    { name: "کاربران", href: "/admin/users", roles: ["SUPERADMIN"] },
    {
      name: "محصولات",
      href: "/admin/products",
      roles: ["SUPERADMIN", "PRODUCTMANAGER"],
    },
    {
      name: "دسته‌بندی‌ها",
      href: "/admin/categories",
      roles: ["SUPERADMIN", "PRODUCTMANAGER"],
    },
  ];

  return (
    <AuthCheck
      allowedRoles={["SUPERADMIN", "PRODUCTMANAGER"]}
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              دسترسی غیرمجاز
            </h2>
            <p className="mb-4">شما مجوز دسترسی به این بخش را ندارید.</p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      }
    >
      <div className="flex h-screen bg-gray-100 relative">
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <div
          className={`
          fixed md:static w-64 bg-white shadow-md h-full z-30
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
        >
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">پنل مدیریت</h2>
            <p className="text-sm text-gray-500 mt-1">
              {userRole === "SUPERADMIN" ? "مدیر ارشد" : "مدیر محصول"}
            </p>
            <Link href="/logout" className="text-red-500 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 inline-block ml-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              خروج
            </Link>
          </div>
          <nav className="mt-4">
            <ul>
              {navigationItems
                .filter((item) => !userRole || item.roles.includes(userRole))
                .map((item) => (
                  <li key={item.href} className="mb-1">
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 ${
                        pathname === item.href
                          ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full md:w-auto">
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            {/* Hamburger menu button for mobile */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <h1 className="text-xl font-semibold">پنل مدیریت</h1>
            <Link
              href="/"
              className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
            >
              بازگشت به سایت
            </Link>
          </header>
          <main className="p-6 overflow-auto flex-1">{children}</main>
        </div>
      </div>
    </AuthCheck>
  );
}
