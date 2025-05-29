"use client";

import React, { useState } from "react";
import { User } from "@prisma/client";
import PasswordChangeModal from "./PasswordChangeModal";
import DetailsCard, { FieldConfig } from "../shared/DetailsCard";
import { useRouter } from "next/navigation";

interface UserDetailsCardProps {
  user: User;
  isLoading: boolean;
}

export default function UserDetailsCard({
  user,
  isLoading,
}: UserDetailsCardProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const roleOptions = [
    { value: "USER", label: "کاربر عادی" },
    { value: "PRODUCTMANAGER", label: "مدیر محصول" },
    { value: "SUPERADMIN", label: "مدیر ارشد" },
  ];

  const getRoleDisplayComponent = () => {
    const roleLabel =
      user?.role === "SUPERADMIN"
        ? "مدیر ارشد"
        : user?.role === "PRODUCTMANAGER"
        ? "مدیر محصول"
        : "کاربر عادی";

    const roleColorClass =
      user?.role === "SUPERADMIN"
        ? "bg-red-100 text-red-800"
        : user?.role === "PRODUCTMANAGER"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-green-100 text-green-800";

    return (
      <span
        className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full cursor-pointer ${roleColorClass}`}
      >
        {roleLabel}
      </span>
    );
  };

  const fields: FieldConfig[] = [
    {
      name: "firstName",
      label: "نام",
    },
    {
      name: "lastName",
      label: "نام خانوادگی",
    },
    {
      name: "email",
      label: "ایمیل",
      type: "email",
      colSpan: 2,
    },
    {
      name: "role",
      label: "نقش کاربری",
      type: "select",
      options: roleOptions,
      displayComponent: getRoleDisplayComponent(),
    },
    {
      name: "createdAt",
      label: "تاریخ عضویت",
      type: "date",
      editable: false,
    },
  ];

  const passwordChangeButton = (
    <button
      onClick={() => setShowPasswordModal(true)}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      تغییر رمز عبور
    </button>
  );

  return (
    <DetailsCard
      data={user}
      id={user.id}
      title="اطلاعات کاربر"
      apiEndpoint="/api/protected/users"
      isLoading={isLoading}
      fields={fields}
      customActions={passwordChangeButton}
      redirectAfterDelete="/admin/users"
      customModals={
        <PasswordChangeModal
          userId={user.id.toString()}
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      }
    />
  );
}
