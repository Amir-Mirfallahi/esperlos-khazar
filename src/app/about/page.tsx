"use client";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CompanyHistory from "@/components/about/CompanyHistory";
import OurTeam from "@/components/about/OurTeam";
import CertificatesAndAwards from "@/components/about/CertificatesAndAwards";
import VisionAndValues from "@/components/about/VisionAndValues";
const About = () => {
  useEffect(() => {
    document.title = "درباره ما | پارس گستر اسپرلوس خزر";
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="py-12 bg-gradient-to-b from-gray-50 to-white pb-10">
          <div className="section-container">
            <h1 className="text-4xl font-bold mb-8 text-center">درباره ما</h1>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-16">
              پارس گستر اسپرلوس خزر، با بیش از ۲۰ سال تجربه در صنایع الکتریکی و
              انرژی، ارائه‌دهنده راهکارهای نوین و با کیفیت در زمینه تجهیزات
              الکتریکی و انتقال قدرت است.
            </p>
          </div>
        </div>

        <CompanyHistory />
        <OurTeam />
        <CertificatesAndAwards />
        <VisionAndValues />
      </main>
      <Footer />
    </div>
  );
};
export default About;
