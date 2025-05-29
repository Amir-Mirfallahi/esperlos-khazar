"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AOSProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
      offset: 50,
    });
  }, []);

  return <>{children}</>;
};

export default AOSProvider;
