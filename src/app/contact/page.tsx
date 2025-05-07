"use client";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <>
      <Header />
      <main className="min-h-screen py-16">
        <div className="section-container">
          <h1 className="text-3xl font-bold mb-12 text-center">تماس با ما</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h2 className="text-xl font-semibold mb-6">ارسال پیام</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">نام و نام خانوادگی</Label>
                    <Input id="name" type="text" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <Input id="email" type="email" dir="ltr" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">موضوع</Label>
                  <Input id="subject" type="text" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">پیام شما</Label>
                  <Textarea id="message" rows={5} required />
                </div>

                <Button type="submit" className="w-full">
                  ارسال پیام
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">اطلاعات تماس</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 text-primary" size={20} />
                    <p>
                      مازندران، ساری، بلوار طالقانی، ساختمان اسپرلوس، طبقه ۵،
                      واحد ۳
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-primary" size={20} />
                    <p dir="ltr">۰۱۱-۳۳۱۱۲۲۳۳</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-primary" size={20} />
                    <p>info@khazar-sperlus.com</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 text-primary" size={20} />
                    <div>
                      <p>شنبه تا چهارشنبه: ۸ الی ۱۷</p>
                      <p>پنجشنبه: ۸ الی ۱۲</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map (using a placeholder image for now) */}
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                {/* Add Google Maps iframe here */}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  نقشه گوگل
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
