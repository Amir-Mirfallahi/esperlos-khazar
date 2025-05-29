"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { changeUserPassword } from "@/utils/users";

interface PasswordChangeModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({
  userId,
  isOpen,
  onClose,
}: PasswordChangeModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("رمز عبور و تایید رمز عبور مطابقت ندارند");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("رمز عبور باید حداقل 6 کاراکتر باشد");
      return;
    }

    setIsUpdating(true);
    try {
      await changeUserPassword(userId, newPassword);
      toast.success("رمز عبور با موفقیت تغییر کرد");
      onClose();
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("خطا در تغییر رمز عبور");
    } finally {
      setIsUpdating(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          تغییر رمز عبور
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رمز عبور جدید
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تایید رمز عبور
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handlePasswordChange}
          disabled={isUpdating}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center"
        >
          {isUpdating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              در حال اعمال تغییرات...
            </>
          ) : (
            "تغییر رمز عبور"
          )}
        </button>
      </div>
    </div>
  );
}
