"use client";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CompanyInformation from "@/data/company-information.json";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <>
      <div className="section-container">
        <h1 className="text-3xl font-bold mb-12 text-center" data-aos="fade-up">
          تماس با ما
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div
            className="bg-white p-8 rounded-xl shadow-sm border"
            data-aos="fade-right"
          >
            <h2 className="text-xl font-semibold mb-6">ارسال پیام</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="space-y-2"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <Label htmlFor="name">نام و نام خانوادگی</Label>
                  <Input id="name" type="text" required />
                </div>
                <div
                  className="space-y-2"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <Label htmlFor="email">ایمیل</Label>
                  <Input id="email" type="email" dir="ltr" required />
                </div>
              </div>

              <div
                className="space-y-2"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <Label htmlFor="subject">موضوع</Label>
                <Input id="subject" type="text" required />
              </div>

              <div
                className="space-y-2"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <Label htmlFor="message">پیام شما</Label>
                <Textarea id="message" rows={5} required />
              </div>

              <Button
                type="submit"
                className="w-full"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                ارسال پیام
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8" data-aos="fade-left">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">اطلاعات تماس</h2>
              <div className="space-y-4">
                <div
                  className="flex items-start gap-3"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <MapPin className="mt-1 text-primary" size={20} />
                  <p>{CompanyInformation.contact.address}</p>
                </div>
                <div
                  className="flex items-center gap-3"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <Phone className="text-primary" size={20} />
                  <p dir="ltr">{CompanyInformation.contact.phone}</p>
                </div>
                <div
                  className="flex items-center gap-3"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <Mail className="text-primary" size={20} />
                  <p>{CompanyInformation.contact.email}</p>
                </div>
                <div
                  className="flex items-start gap-3"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <Clock className="mt-1 text-primary" size={20} />
                  <div>
                    {CompanyInformation.contact.workingHour.map(
                      (hour, index) => (
                        <p key={index}>{hour}</p>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div
              className="aspect-video bg-gray-100 rounded-xl overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                نقشه گوگل
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
