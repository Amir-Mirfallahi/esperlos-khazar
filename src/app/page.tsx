"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyUs from "@/components/home/WhyUs";
import ContactCTA from "@/components/home/ContactCTA";
import { useEffect } from "react";

const Index = () => {
  // Set page title and meta information for SEO
  useEffect(() => {
    document.title = "پارس گستر اسپرلوس خزر | صنایع الکتریکی و انرژی";
    // You could add meta tags here with a custom hook
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div className="py-8 bg-white">
          <div className="section-container">
            <div className="text-center">
              <span className="text-primary font-medium">به وب‌سایت رسمی</span>
              <h2 className="text-3xl font-bold mt-1 mb-4">
                شرکت پارس گستر اسپرلوس خزر خوش آمدید
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                ما با بیش از ۲۰ سال تجربه در زمینه تولید و تأمین تجهیزات صنعت
                برق، ارائه‌دهنده راهکارهای نوین و با کیفیت در زمینه تجهیزات
                الکتریکی، انتقال قدرت و سیستم‌های کنترل هوشمند هستیم.
              </p>
            </div>
          </div>
        </div>
        <FeaturedProducts />
        <WhyUs />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
