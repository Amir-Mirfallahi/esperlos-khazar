import { History } from 'lucide-react';
const CompanyHistory = () => {
  const timeline = [{
    year: "۱۳۸۲",
    title: "تأسیس شرکت",
    description: "شروع فعالیت رسمی در زمینه تجهیزات الکتریکی"
  }, {
    year: "۱۳۸۵",
    title: "توسعه خط تولید",
    description: "راه‌اندازی خط تولید ترانسفورماتورهای توزیع"
  }, {
    year: "۱۳۹۰",
    title: "گسترش فعالیت",
    description: "ورود به بازار تابلوهای برق صنعتی و کنترل"
  }, {
    year: "۱۳۹۵",
    title: "دریافت گواهینامه‌های بین‌المللی",
    description: "کسب استانداردهای ISO 9001 و ISO 14001"
  }, {
    year: "۱۴۰۲",
    title: "توسعه صادرات",
    description: "آغاز صادرات محصولات به کشورهای همسایه"
  }];
  return <section className="bg-white py-0">
      <div className="section-container py-[30px]">
        <div className="flex items-center gap-3 mb-12">
          <History className="text-primary w-8 h-8" />
          <h2 className="text-3xl font-bold">تاریخچه شرکت</h2>
        </div>
        
        <div className="space-y-8">
          {timeline.map((item, index) => <div key={index} className="flex gap-6">
              <div className="w-24 flex-shrink-0">
                <span className="text-xl font-bold text-primary">{item.year}</span>
              </div>
              <div className="flex-grow border-r border-gray-200 pr-6 pb-8">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default CompanyHistory;