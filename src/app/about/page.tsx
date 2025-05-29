"use client";
import { useEffect } from "react";
import CompanyHistory from "@/components/about/CompanyHistory";
import OurTeam from "@/components/about/OurTeam";
import CertificatesAndAwards from "@/components/about/CertificatesAndAwards";
import VisionAndValues from "@/components/about/VisionAndValues";

const About = () => {
  useEffect(() => {
    document.title = "درباره ما | پارس گستر اسپرلوس خزر";
  }, []);
  return (
    <>
      <div className="py-12 bg-gradient-to-b from-gray-50 to-white pb-4">
        <div className="section-container">
          <h1
            className="text-4xl font-bold mb-8 text-center"
            data-aos="fade-up"
          >
            درباره ما
          </h1>
          <p
            className="text-gray-600 text-center max-w-3xl mx-auto mb-16"
            data-aos="fade-up"
            data-aos-delay="100"
          ></p>
        </div>
      </div>

      <div data-aos="fade-up" data-aos-delay="300">
        <CompanyHistory />
      </div>
      <div data-aos="fade-up" data-aos-delay="300">
        <OurTeam />
      </div>
      <div data-aos="fade-up" data-aos-delay="400">
        <CertificatesAndAwards />
      </div>
      <div data-aos="fade-up" data-aos-delay="500">
        <VisionAndValues />
      </div>
    </>
  );
};
export default About;
