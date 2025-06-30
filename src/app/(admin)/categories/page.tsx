"use client";

import { useState, useEffect } from "react";
import { AuthCheck } from "@/components/auth/AuthCheck";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Category {
  id: number;
  name: string;
  _count?: {
    products: number;
  };
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/protected/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("خطا در دریافت دسته‌بندی‌ها");
    } finally {
      setIsLoading(false);
      console.log(categories);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategoryName.trim()) {
      toast.error("نام دسته‌بندی را وارد کنید");
      return;
    }

    setIsCreating(true);
    try {
      const response = await axios.post("/api/protected/categories", {
        name: newCategoryName,
      });
      toast.success("دسته‌بندی با موفقیت ایجاد شد");
      setNewCategoryName("");
      // Refresh categories
      fetchCategories();
    } catch (error: any) {
      console.error("Error creating category:", error);
      const errorMessage =
        error.response?.data?.error || "خطا در ایجاد دسته‌بندی";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editCategoryName.trim() || !editCategoryId) {
      toast.error("نام دسته‌بندی را وارد کنید");
      return;
    }

    try {
      await axios.patch(`/api/protected/categories/${editCategoryId}`, {
        name: editCategoryName,
      });
      toast.success("دسته‌بندی با موفقیت ویرایش شد");
      setEditCategoryId(null);
      setEditCategoryName("");
      // Refresh categories
      fetchCategories();
    } catch (error: any) {
      console.error("Error updating category:", error);
      const errorMessage =
        error.response?.data?.error || "خطا در ویرایش دسته‌بندی";
      toast.error(errorMessage);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const category = categories.find((c) => c.id === id);

    if (category?._count && category._count.products > 0) {
      toast.error(
        `این دسته‌بندی دارای ${category._count.products} محصول است و نمی‌توان آن را حذف کرد`
      );
      return;
    }

    if (window.confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) {
      try {
        await axios.delete(`/api/protected/categories/${id}`);
        toast.success("دسته‌بندی با موفقیت حذف شد");
        // Remove the category from the list
        setCategories(categories.filter((category) => category.id !== id));
      } catch (error: any) {
        console.error("Error deleting category:", error);
        const errorMessage =
          error.response?.data?.error || "خطا در حذف دسته‌بندی";
        toast.error(errorMessage);
      }
    }
  };

  const startEditing = (category: Category) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  const cancelEditing = () => {
    setEditCategoryId(null);
    setEditCategoryName("");
  };

  return (
    <AuthCheck allowedRoles={["SUPERADMIN", "PRODUCTMANAGER"]}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
        </div>

        {/* Create New Category Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-blue-900">
              افزودن دسته‌بندی جدید
            </h2>
          </div>

          <form onSubmit={handleCreateCategory} className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="نام دسته‌بندی"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${
                    isCreating ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isCreating ? "در حال ثبت..." : "افزودن"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Categories List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <PulseLoader color="#36d7b7" size={20} loading={isLoading} />
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">هیچ دسته‌بندی یافت نشد.</p>
            <p className="mt-2">
              برای افزودن دسته‌بندی جدید، از فرم بالا استفاده کنید.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      نام دسته‌بندی
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      تعداد محصولات
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      تاریخ ایجاد
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
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editCategoryId === category.id ? (
                          <form
                            onSubmit={handleEditCategory}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="text"
                              value={editCategoryName}
                              onChange={(e) =>
                                setEditCategoryName(e.target.value)
                              }
                              className="p-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                            >
                              ذخیره
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
                            >
                              لغو
                            </button>
                          </form>
                        ) : (
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {category._count ? category._count.products : 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(category.createdAt).toLocaleDateString(
                            "fa-IR"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => startEditing(category)}
                          disabled={editCategoryId !== null}
                          className="text-blue-600 hover:text-blue-900 ml-3 disabled:text-gray-300 disabled:cursor-not-allowed"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={
                            category._count && category._count.products > 0
                          }
                          className={`${
                            category._count && category._count.products > 0
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-red-600 hover:text-red-900"
                          }`}
                          title={
                            category._count && category._count.products > 0
                              ? "دسته‌بندی‌هایی که دارای محصول هستند را نمی‌توان حذف کرد"
                              : "حذف دسته‌بندی"
                          }
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AuthCheck>
  );
}
