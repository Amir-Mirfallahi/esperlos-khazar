"use client";

import { useState, useEffect } from "react";
import { AuthCheck } from "@/components/auth/AuthCheck";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    categoryId: "",
    description: "",
    isFeatured: false,
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/protected/categories");
        const categories = response.data;
        setCategories(categories);
        // Set default category if available
        if (categories.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoryId: String(categories[0].id),
          }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("خطا در دریافت دسته‌بندی‌ها");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSlugGeneration = () => {
    if (formData.name && !formData.slug) {
      // Very simple slug generator - for production, use a more robust solution
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      setFormData({
        ...formData,
        slug,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.slug ||
        !formData.price ||
        !formData.categoryId
      ) {
        toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post("/api/protected/products", formData);
      toast.success("محصول با موفقیت ایجاد شد");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Error creating product:", error);
      const errorMessage = error.response?.data?.error || "خطا در ایجاد محصول";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCheck allowedRoles={["SUPERADMIN", "PRODUCTMANAGER"]}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">افزودن محصول جدید</h1>
          <Link href="/admin/products">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
              بازگشت به لیست محصولات
            </button>
          </Link>
        </div>

        {loadingCategories ? (
          <div className="flex justify-center items-center py-10">
            <PulseLoader
              color="#36d7b7"
              size={20}
              loading={loadingCategories}
            />
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-yellow-600">
              دسته‌بندی یافت نشد
            </h2>
            <p className="mt-2">
              برای ایجاد محصول، ابتدا باید حداقل یک دسته‌بندی ایجاد کنید.
            </p>
            <div className="mt-4">
              <Link href="/admin/categories">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  مدیریت دسته‌بندی‌ها
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-xl font-semibold text-blue-900">
                اطلاعات محصول
              </h2>
              <p className="text-sm text-gray-500">
                فیلدهای ضروری با ستاره (*) مشخص شده‌اند
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نام محصول *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleSlugGeneration}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسلاگ (نامک) *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                    title="فقط حروف انگلیسی کوچک، اعداد و خط تیره مجاز است"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    مثال: gaming-laptop (فقط حروف انگلیسی کوچک، اعداد و خط تیره
                    مجاز است)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    قیمت (تومان) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    دسته‌بندی *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    توضیحات
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  ></textarea>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label className="mr-2 text-sm font-medium text-gray-700">
                      نمایش به عنوان محصول ویژه
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4 space-x-reverse">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      در حال ثبت...
                    </span>
                  ) : (
                    "ثبت محصول"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AuthCheck>
  );
}
