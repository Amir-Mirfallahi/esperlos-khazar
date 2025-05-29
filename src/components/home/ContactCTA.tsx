import { Button } from "../ui/button";
import Link from "next/link";

const ContactCTA = () => {
  return (
    <section className="py-12 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="section-container relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                آماده پاسخگویی به نیازهای صنعتی شما هستیم
              </h2>
              <p className="text-white/80 mb-6">
                برای دریافت مشاوره رایگان و استعلام قیمت، همین حالا با کارشناسان
                ما در تماس باشید. تیم متخصص ما آماده ارائه راهکارهای متناسب با
                نیاز شما است.
              </p>
            </div>
            <div className="lg:col-span-2 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center">
              <Button
                to="/contact"
                variant="secondary"
                size="lg"
                className="w-full text-center"
              >
                تماس با ما
              </Button>
              <Button
                href="tel:01133112233"
                variant="outline"
                size="lg"
                className="w-full text-center border-white text-white hover:bg-white/20"
              >
                تماس مستقیم: ۰۱۱-۳۳۱۱۲۲۳۳
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
