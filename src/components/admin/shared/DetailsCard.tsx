"use client";

import React, { useState, useCallback, ReactNode } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import InfoField, { InfoFieldProps } from "./InfoField";
import { PulseLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface DetailsCardProps {
  data: Record<string, any>;
  id: string | number;
  title: string;
  subtitle?: string;
  apiEndpoint: string;
  isLoading?: boolean;
  fields: FieldConfig[];
  onRefresh?: () => void;
  customActions?: ReactNode;
  showDeleteButton?: boolean;
  redirectAfterDelete?: string;
  customModals?: ReactNode;
}

export interface FieldConfig {
  name: string;
  label: string;
  type?: InfoFieldProps["type"] | "select";
  options?: { value: string; label: string }[];
  displayComponent?: ReactNode;
  editable?: boolean;
  colSpan?: number;
}

export default function DetailsCard({
  data: initialData,
  id,
  title,
  subtitle = "برای ویرایش روی هر قسمت که می‌خواهید ویرایش کنید، کلیک کنید.",
  apiEndpoint,
  isLoading = false,
  fields,
  onRefresh,
  customActions,
  showDeleteButton = true,
  redirectAfterDelete,
  customModals,
}: DetailsCardProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [data, setData] = useState(initialData);
  const router = useRouter();

  const saveChanges = useCallback(
    async (field: string, value: string) => {
      setIsUpdating(field);
      try {
        await axios.patch(`${apiEndpoint}/${id}`, {
          [field]: value,
        });
        toast.success("اطلاعات با موفقیت به‌روزرسانی شد");
        if (onRefresh) {
          onRefresh();
        } else {
          setData((prevData) => ({
            ...prevData,
            [field]: value,
          }));
        }
      } catch (error) {
        console.error("Error updating data:", error);
        toast.error("خطا در به‌روزرسانی اطلاعات");
      } finally {
        setIsUpdating(null);
      }
    },
    [id, apiEndpoint, onRefresh]
  );

  const handleDeleteItem = async () => {
    if (window.confirm("آیا از حذف این مورد اطمینان دارید؟")) {
      try {
        await axios.delete(`${apiEndpoint}/${id}`);
        toast.success("مورد با موفقیت حذف شد");
        if (redirectAfterDelete) {
          router.push(redirectAfterDelete);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("خطا در حذف مورد");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <PulseLoader color="#36d7b7" size={20} loading={isLoading} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
        <h2 className="text-xl font-semibold text-blue-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      {customModals}

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {fields.map((field) => {
            // Skip rendering if data doesn't have this field
            if (data[field.name] === undefined && field.type !== "date") {
              return null;
            }

            // Handle date fields specially
            const isDateField = field.type === "date" && data[field.name];
            const dateValue = isDateField
              ? new Date(data[field.name]).toLocaleDateString("fa-IR")
              : data[field.name];

            return (
              <div
                key={field.name}
                className={field.colSpan === 2 ? "col-span-2" : ""}
              >
                {field.editable !== false ? (
                  <InfoField
                    label={field.label}
                    value={dateValue || ""}
                    field={field.name}
                    isUpdating={isUpdating}
                    onSave={saveChanges}
                    isSelect={field.type === "select"}
                    options={field.options || []}
                    displayComponent={field.displayComponent}
                    type={field.type || "text"}
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    {field.displayComponent || (
                      <p className="text-lg">{dateValue}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end space-x-4 space-x-reverse">
          {customActions}
          {showDeleteButton && (
            <button
              onClick={handleDeleteItem}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              حذف
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
