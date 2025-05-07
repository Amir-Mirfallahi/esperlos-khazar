import { Award } from 'lucide-react';
const CertificatesAndAwards = () => {
  const certificates = [{
    title: "ISO 9001:2015",
    description: "سیستم مدیریت کیفیت"
  }, {
    title: "ISO 14001:2015",
    description: "سیستم مدیریت محیط زیست"
  }, {
    title: "ISO 45001:2018",
    description: "سیستم مدیریت ایمنی و بهداشت شغلی"
  }, {
    title: "CE Mark",
    description: "استاندارد اروپا"
  }];
  return <section className="py-16 bg-white">
      <div className="section-container py-[10px]">
        <div className="flex items-center gap-3 mb-12">
          <Award className="text-primary w-8 h-8" />
          <h2 className="text-3xl font-bold">گواهینامه‌ها و افتخارات</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificates.map((cert, index) => <div key={index} className="border border-gray-200 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <h3 className="text-xl font-semibold mb-2">{cert.title}</h3>
              <p className="text-gray-600">{cert.description}</p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default CertificatesAndAwards;