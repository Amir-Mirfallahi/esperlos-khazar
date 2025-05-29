"use client";

import React, { useState } from "react";
import { InfoFieldProps } from "../shared/InfoField";

/**
 * @deprecated Use InfoField from "../shared/InfoField" instead.
 * This component is kept for backward compatibility.
 */
export default function UserInfoField({
  label,
  value,
  field,
  isUpdating,
  onSave,
  isSelect = false,
  options = [],
  displayComponent,
  type = "text",
}: InfoFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const [hasChanged, setHasChanged] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newValue = e.target.value;
    setEditValue(newValue);
    setHasChanged(newValue !== String(value));

    // For selects, we apply the change immediately when an option is selected
    if (isSelect) {
      handleSelectChange(newValue);
    }
  };

  const handleSelectChange = async (newValue: string) => {
    if (newValue !== String(value)) {
      await onSave(field, newValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(String(value));
    }
  };

  const handleBlur = () => {
    if (!isSelect) {
      handleSave();
    }
  };

  const handleSave = async () => {
    if (editValue !== String(value)) {
      await onSave(field, editValue);
    }
    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditValue(String(value));
    setHasChanged(false);
  };

  if (isEditing) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative transition-all duration-300 ease-in-out">
          {isSelect ? (
            <select
              value={editValue}
              onChange={handleInputChange}
              autoFocus
              className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field === "email" ? "email" : "text"}
              value={editValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          )}
          {isUpdating === field && (
            <div className="absolute inset-y-0 right-2 flex items-center">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div onClick={startEditing} className="cursor-pointer">
        {displayComponent || (
          <p
            className={`text-lg p-2 hover:bg-gray-50 rounded transition-colors duration-200 ${
              field === "email" ? "text-blue-600" : ""
            }`}
          >
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
