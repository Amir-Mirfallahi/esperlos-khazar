import { Award, Clock, Users, Check } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  "data-aos"?: string;
  "data-aos-delay"?: string | number;
}

const Feature = ({ icon, title, description, ...props }: FeatureProps) => (
  <div
    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
    {...props}
  >
    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-primary">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const WhyUs = () => {
  const features = [
    {
      icon: <Award size={28} />,
      title: "کیفیت برتر",
      description:
        "محصولات ما با بالاترین استانداردهای کیفی و با استفاده از مواد اولیه مرغوب تولید می‌شوند.",
    },
    {
      icon: <Clock size={28} />,
      title: "پشتیبانی ۲۴/۷",
      description:
        "تیم متخصص ما در هر زمان آماده ارائه خدمات پشتیبانی و مشاوره فنی به مشتریان هستند.",
    },
    {
      icon: <Users size={28} />,
      title: "تیم متخصص",
      description:
        "بهره‌گیری از مهندسین مجرب و متخصص با سال‌ها تجربه در صنعت برق و انرژی.",
    },
    {
      icon: <Check size={28} />,
      title: "ضمانت اصالت",
      description:
        "تمامی محصولات با گارانتی اصالت و کیفیت و خدمات پس از فروش ارائه می‌شوند.",
    },
  ];

  return (
    <section className="bg-muted py-16">
      <div className="section-container">
        <div className="text-center mb-12">
          <span className="text-primary font-medium">مزایای همکاری با ما</span>
          <h2 className="text-3xl font-bold mt-2 mb-4">
            چرا پارس گستر اسپرلوس خزر؟
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            با بیش از دو دهه تجربه در ارائه راهکارهای صنعتی، ما اطمینان و کیفیت
            را برای مشتریانمان به ارمغان می‌آوریم.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              data-aos="fade-up"
              data-aos-delay={index * 300}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
