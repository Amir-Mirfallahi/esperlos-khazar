import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-6">پارس گستر اسپرلوس خزر</h3>
            <p className="mb-6 text-gray-300 leading-relaxed">
              ارائه دهنده راهکارهای صنعتی و تجاری نوین با بیش از ۲۰ سال تجربه در
              صنایع الکتریکی و انرژی
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
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  سؤالات متداول
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-6">دسته‌بندی محصولات</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products/category-1"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  ترانسفورماتورها
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category-2"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  تابلو برق
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category-3"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  تجهیزات حفاظتی
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category-4"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  تجهیزات اندازه‌گیری
                </Link>
              </li>
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
                  مازندران، ساری، بلوار طالقانی، ساختمان اسپرلوس، طبقه ۵، واحد ۳
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="flex-shrink-0 text-secondary" size={18} />
                <span className="text-gray-300 dir-ltr">۰۱۱-۳۳۱۱۲۲۳۳</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="flex-shrink-0 text-secondary" size={18} />
                <span className="text-gray-300">info@khazar-sperlus.com</span>
              </li>
              <li className="flex gap-3 items-start">
                <Clock
                  className="mt-1 flex-shrink-0 text-secondary"
                  size={18}
                />
                <span className="text-gray-300">
                  شنبه تا چهارشنبه: ۸ الی ۱۷
                  <br />
                  پنجشنبه: ۸ الی ۱۲
                </span>
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
