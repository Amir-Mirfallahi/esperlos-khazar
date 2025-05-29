"use client";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyUs from "@/components/home/WhyUs";
import ContactCTA from "@/components/home/ContactCTA";

const Index = () => {
  return (
    <>
      <Hero />
      <div className="py-8 bg-white">
        <div className="section-container">
          <div className="text-center" data-aos="fade-up">
            <span className="text-primary font-medium">به وب‌سایت رسمی</span>
            <h2 className="text-3xl font-bold mt-1 mb-4">
              شرکت پارس گستر اسپرلوس خزر خوش آمدید
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ما با بیش از ۲۰ سال تجربه در زمینه تولید و تأمین تجهیزات صنعت برق،
              ارائه‌دهنده راهکارهای نوین و با کیفیت در زمینه تجهیزات الکتریکی،
              انتقال قدرت و سیستم‌های کنترل هوشمند هستیم.
            </p>
          </div>
        </div>
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <FeaturedProducts />
      </div>
      <div data-aos="fade-up" data-aos-delay="200">
        <WhyUs />
      </div>
      <div data-aos="fade-up" data-aos-delay="300">
        <ContactCTA />
      </div>
    </>
  );
};

export default Index;
