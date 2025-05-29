import { History } from "lucide-react";
import { timeline } from "@/data/company-information.json";

const CompanyHistory = () => {
  return (
    <section className="bg-white py-0">
      <div className="section-container py-2">
        <div className="flex items-center gap-3 mb-12">
          <History className="text-primary w-8 h-8" />
          <h2 className="text-3xl font-bold">تاریخچه شرکت</h2>
        </div>

        <div className="space-y-8">
          {timeline.map((item, index) => (
            <div
              key={index}
              className="flex gap-6"
              data-aos="fade-up"
              data-aos-duration={index * 300}
            >
              <div className="w-24 flex-shrink-0">
                <span className="text-xl font-bold text-primary">
                  {item.year}
                </span>
              </div>
              <div className="flex-grow border-r border-gray-200 pr-6 pb-8">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default CompanyHistory;
