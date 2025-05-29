"use client";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import companyInformation from "@/data/company-information.json";
import { useEffect, useState } from "react";
import { Category } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";

const Footer = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCategories = async () => {
    setLoading(true);
    await axios
      .get("/api/categories?limit=5")
      .then((res) => {
        setCategories(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-6">پارس گستر اسپرلوس خزر</h3>
            <p className="mb-6 text-gray-300 leading-relaxed">
              {companyInformation.footer.siteDetail}
            </p>
            <div className="flex gap-4">{/* Social icons would go here */}</div>
          </div>

          {/* Quick Links */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-6">دسترسی سریع</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  خانه
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  درباره ما
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  محصولات
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-6">دسته‌بندی محصولات</h3>
            <ul className="space-y-3">
              {categories && !loading ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products?category=${category.id}`}
                      className="text-gray-300 hover:text-secondary transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <div className="flex justify-center items-center py-10">
                  <PulseLoader color="#36d7b7" size={20} loading={loading} />
                </div>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-6">اطلاعات تماس</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <MapPin
                  className="mt-1 flex-shrink-0 text-secondary"
                  size={18}
                />
                <span className="text-gray-300">
                  {companyInformation.contact.address}
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="flex-shrink-0 text-secondary" size={18} />
                <span className="text-gray-300 dir-ltr">
                  {companyInformation.contact.phone}
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="flex-shrink-0 text-secondary" size={18} />
                <span className="text-gray-300">
                  {companyInformation.contact.email}
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Clock
                  className="mt-1 flex-shrink-0 text-secondary"
                  size={18}
                />
                <div className="text-gray-300">
                  {companyInformation.contact.workingHour.map((hour, index) => (
                    <p key={index}>{hour}</p>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p>
            تمامی حقوق این وب‌سایت متعلق به شرکت پارس گستر اسپرلوس خزر می‌باشد.
            © ۱۴۰۴
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
