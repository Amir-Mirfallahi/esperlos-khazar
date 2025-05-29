"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const registerSchema = z.object({
  firstName: z.string().min(2, {
    message: "نام باید حداقل 2 کاراکتر باشد",
  }),
  lastName: z.string().min(2, {
    message: "نام خانوادگی باید حداقل 2 کاراکتر باشد",
  }),
  email: z.string().email({
    message: "ایمیل نامعتبر است",
  }),
  password: z.string().min(6, {
    message: "رمز عبور باید حداقل 6 کاراکتر باشد",
  }),
  confirmPassword: z.string().min(6, {
    message: "تکرار رمز عبور باید حداقل 6 کاراکتر باشد",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "رمز عبور و تکرار آن یکسان نیستند",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: responseData } = await axios.post("/api/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      // Redirect to login page after successful registration
      router.push("/login");
    } catch (error) {
      setError("خطایی رخ داد. لطفا دوباره تلاش کنید");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4" dir="rtl">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">ثبت نام</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
              نام
            </label>
            <input
              id="firstName"
              type="text"
              {...register("firstName")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="نام خود را وارد کنید"
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="text-red-500 mt-1 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
              نام خانوادگی
            </label>
            <input
              id="lastName"
              type="text"
              {...register("lastName")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="نام خانوادگی خود را وارد کنید"
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className="text-red-500 mt-1 text-sm">{errors.lastName.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ایمیل خود را وارد کنید"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="رمز عبور خود را وارد کنید"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              تکرار رمز عبور
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="رمز عبور خود را مجددا وارد کنید"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 mt-1 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "در حال ثبت نام..." : "ثبت نام"}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            حساب کاربری دارید؟{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 