import { Book } from 'lucide-react';
const VisionAndValues = () => {
  const values = [{
    title: "کیفیت",
    description: "تعهد به ارائه محصولات با بالاترین استانداردهای کیفی"
  }, {
    title: "نوآوری",
    description: "پیشگام در ارائه راهکارهای نوین در صنعت برق"
  }, {
    title: "مسئولیت‌پذیری",
    description: "پایبندی به تعهدات و مسئولیت‌های اجتماعی"
  }, {
    title: "مشتری‌مداری",
    description: "اولویت‌دهی به رضایت و موفقیت مشتریان"
  }];
  return <section className="bg-gray-50 py-[10px]">
      <div className="section-container">
        <div className="flex items-center gap-3 mb-12">
          <Book className="text-primary w-8 h-8" />
          <h2 className="text-3xl font-bold">چشم‌انداز و ارزش‌ها</h2>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold mb-4">چشم‌انداز ما</h3>
          <p className="text-gray-600 leading-relaxed">
            تبدیل شدن به یکی از برترین شرکت‌های تولیدکننده تجهیزات الکتریکی در سطح خاورمیانه
            و ارائه راهکارهای نوآورانه برای صنعت برق و انرژی
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => <div key={index} className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default VisionAndValues;