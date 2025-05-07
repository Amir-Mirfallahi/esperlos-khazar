import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section
      className="relative bg-gray-900 text-white py-20 lg:py-32 overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/hero-background.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-transparent opacity-60"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[60%] left-[80%] w-64 h-64 bg-primary/30 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">
            <span className="text-secondary">پارس گستر اسپرلوس خزر</span>
            <br />
            <span className="mt-2 block">پیشرو در صنعت برق و امنیت</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-8 animate-slide-in-bottom">
            ارائه دهنده راهکارهای نوین و با کیفیت در زمینه
            <span className="text-secondary"> تجهیزات الکتریکی، </span>
            <span className="text-secondary">انتقال قدرت </span>و
            <span className="text-secondary"> سیستم‌های کنترل هوشمند </span>
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-slide-in-bottom"
            style={{ animationDelay: "0.2s" }}
          >
            <Button to="/products" size="lg" variant="secondary">
              مشاهده محصولات
            </Button>
            <Button
              to="/contact"
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/20"
            >
              تماس با ما
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
