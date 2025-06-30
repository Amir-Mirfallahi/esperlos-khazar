"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { AuthCheck } from "@/components/auth/AuthCheck";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { useRouter, useParams } from "next/navigation"; // Added useParams
import Link from "next/link";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
}

// Interface for existing images (assuming structure from backend)
interface ExistingImage {
  id: string;
  imageUrl: string;
  s3key: string;
}

// Interface for Product data received from API
interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  isFeatured: boolean;
  categoryId: number;
  images: ExistingImage[];
  // Add other fields if necessary, matching your API response
}

export default function UpdateProductPage() {
  // Renamed component
  const router = useRouter();
  const params = useParams(); // Get router params
  const productId = params.id as string; // Extract product ID

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true); // For loading product data
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]); // For existing images
  const [removedImageKeys, setRemovedImageKeys] = useState<string[]>([]); // Keys of images to remove

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
      setLoadingCategories(true);
      try {
        const response = await axios.get("/api/protected/categories");
        const categoriesData = response.data;
        setCategories(categoriesData);
        // Don't set default categoryId here, wait for product data
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("خطا در دریافت دسته‌بندی‌ها");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch existing product data
  useEffect(() => {
    if (productId && categories.length > 0) {
      // Ensure categories are loaded before trying to match categoryId
      const fetchProductData = async () => {
        setIsLoadingData(true);
        try {
          const response = await axios.get<ProductData>(
            `/api/protected/products/${productId}`
          );
          const product = response.data;

          setFormData({
            name: product.name,
            slug: product.slug,
            price: String(product.price), // Form input expects string
            categoryId: String(product.categoryId),
            description: product.description || "",
            isFeatured: product.isFeatured,
          });

          if (product.images && product.images.length > 0) {
            setExistingImages(product.images);
          } else {
            setExistingImages([]);
          }
        } catch (error) {
          console.error("Error fetching product data:", error);
          toast.error("خطا در دریافت اطلاعات محصول");
          // Optionally redirect if product not found, e.g., router.push('/admin/products');
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchProductData();
    } else if (productId && !loadingCategories && categories.length === 0) {
      // If categories failed to load or there are none, we might not be able to proceed.
      // This case is handled by the main render logic showing "No categories found"
      setIsLoadingData(false); // Stop loading indicator for product data
    }
  }, [productId, categories, loadingCategories]); // Add categories and loadingCategories as dependencies

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

  // Handle file selection for new images
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const totalImages =
        existingImages.length + selectedFiles.length + filesArray.length;
      const allowedNewUploads =
        5 - (existingImages.length + selectedFiles.length);

      if (filesArray.length > allowedNewUploads) {
        toast.error(
          `شما فقط می‌توانید ${allowedNewUploads} تصویر دیگر اضافه کنید.`
        );
        // Optionally, slice the array to only take allowed number of files
        // filesArray = filesArray.slice(0, allowedNewUploads);
        return;
      }

      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  // Remove a newly selected image (preview)
  const handleRemoveNewImage = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => {
      const newPreviews = prevPreviews.filter((_, i) => i !== index);
      URL.revokeObjectURL(prevPreviews[index]);
      return newPreviews;
    });
  };

  // Handle removal of an existing image
  const handleRemoveExistingImage = (s3KeyToRemove: string) => {
    setExistingImages((prevImages) =>
      prevImages.filter((img) => img.s3key !== s3KeyToRemove)
    );
    setRemovedImageKeys((prevKeys) => {
      if (!prevKeys.includes(s3KeyToRemove)) {
        return [...prevKeys, s3KeyToRemove];
      }
      return prevKeys;
    });

    // No need to revoke Object URL as these are not from createObjectURL
  };

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleSlugGeneration = () => {
    // Slug generation might need adjustment if name changes
    if (formData.name) {
      // Simpler check for update page
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\\w\\s-]/g, "")
        .replace(/\\s+/g, "-")
        .replace(/--+/g, "-");
      setFormData((prev) => ({
        // Use functional update for safety
        ...prev,
        slug,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

    const submissionFormData = new FormData();
    submissionFormData.append("name", formData.name);
    submissionFormData.append("slug", formData.slug);
    submissionFormData.append("price", formData.price);
    submissionFormData.append("categoryId", formData.categoryId);
    submissionFormData.append("description", formData.description);
    submissionFormData.append("isFeatured", String(formData.isFeatured));

    // Append new images
    selectedFiles.forEach((file) => {
      submissionFormData.append("images", file); // Backend should expect "images" for new files
    });

    // Append removed image keys as a JSON string
    if (removedImageKeys.length > 0) {
      submissionFormData.append(
        "removedS3Keys",
        JSON.stringify(removedImageKeys)
      );
    }

    try {
      await axios.patch(
        // Changed to PATCH
        `/api/protected/products/${productId}`, // Use productId in URL
        submissionFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("محصول با موفقیت ویرایش شد");
      router.push("/admin/products"); // Redirect to products list on success
    } catch (error: any) {
      console.error("Error updating product:", error);
      // It's good practice to log the full error for debugging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "خطا در ویرایش محصول"; // Updated message
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxTotalImages = 5;
  const currentTotalImages = existingImages.length + selectedFiles.length;
  const canUploadMore = currentTotalImages < maxTotalImages;

  // Main return content - similar to NewProductPage but with adjustments
  return (
    <AuthCheck allowedRoles={["SUPERADMIN", "PRODUCTMANAGER"]}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">ویرایش محصول</h1>{" "}
          {/* Updated heading */}
          <Link href="/admin/products">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
              بازگشت به لیست محصولات
            </button>
          </Link>
        </div>

        {isLoadingData ||
        (loadingCategories &&
          categories.length === 0 &&
          !formData.categoryId) ? ( // Combined loading state
          <div className="flex justify-center items-center py-10">
            <PulseLoader
              color="#36d7b7"
              size={20}
              loading={isLoadingData || loadingCategories}
            />
          </div>
        ) : !loadingCategories && categories.length === 0 ? ( // No categories available (edge case for update too)
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-yellow-600">
              دسته‌بندی یافت نشد
            </h2>
            <p className="mt-2">
              برای ویرایش یا ایجاد محصول، ابتدا باید حداقل یک دسته‌بندی موجود
              باشد.
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form fields are mostly the same, will be pre-filled by fetched data */}
                <div className="md:col-span-1">
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

                <div className="md:col-span-1">
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

                <div className="md:col-span-1">
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

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    دسته‌بندی *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId} // This will be set from fetched data
                    onChange={handleChange}
                    required
                    disabled={loadingCategories}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {loadingCategories ? (
                      <option>در حال بارگذاری دسته‌بندی‌ها...</option>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category.id} value={String(category.id)}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <option value="">هیچ دسته‌بندی یافت نشد</option>
                    )}
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2">
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

                {/* Display existing images - This section will be added/modified in next steps */}
                {existingImages.length > 0 && (
                  <div className="col-span-1 md:col-span-2 mt-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">
                      تصاویر فعلی محصول:
                    </h3>
                    {existingImages.length === 0 && !isLoadingData && (
                      <p className="text-sm text-gray-500">
                        این محصول در حال حاضر تصویری ندارد.
                      </p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {existingImages.map((image) => (
                        <div
                          key={image.id || image.s3key}
                          className="relative group"
                        >
                          <Image
                            height={0}
                            width={0}
                            src={image.imageUrl}
                            alt={`Product image ${image.id}`}
                            className="h-20 w-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveExistingImage(image.s3key)
                            }
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-opacity opacity-0 group-hover:opacity-100"
                            title="حذف این تصویر"
                          >
                            <FiXCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section for uploading new images */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {existingImages.length > 0
                      ? "افزودن تصاویر جدید"
                      : "بارگذاری تصاویر محصول"}{" "}
                    (حداکثر مجموعاً {maxTotalImages} تصویر)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${
                            !canUploadMore
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <span>بارگذاری فایل‌ها</span>
                          <input
                            id="file-upload"
                            name="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="sr-only"
                            disabled={!canUploadMore}
                          />
                        </label>
                        <p className="pl-1">یا بکشید و رها کنید</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF تا 10MB
                      </p>
                    </div>
                  </div>
                  {!canUploadMore && (
                    <p className="mt-2 text-sm text-yellow-600">
                      به حداکثر تعداد تصاویر (۵ تصویر) رسیده‌اید. برای افزودن
                      تصویر جدید، ابتدا یک تصویر موجود را حذف کنید.
                    </p>
                  )}
                </div>

                {/* Preview of newly selected images */}
                {imagePreviews.length > 0 && (
                  <div className="col-span-1 md:col-span-2 mt-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">
                      پیش‌نمایش تصاویر جدید انتخاب شده:
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((previewUrl, index) => (
                        <div key={index} className="relative group">
                          <Image
                            height={0}
                            width={0}
                            src={previewUrl}
                            alt={`New Image ${index + 1}`}
                            className="h-20 w-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)} // Adjusted handler
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FiXCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                  disabled={isSubmitting || isLoadingData} // Also disable if loading data
                  className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${
                    isSubmitting || isLoadingData
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      در حال ذخیره...
                    </span>
                  ) : (
                    "ذخیره تغییرات" // Updated button text
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
