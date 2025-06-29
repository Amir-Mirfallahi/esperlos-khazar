import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AOSProvider from "@/components/common/AOSProvider";

export const metadata: Metadata = {
  title: "پارس گستر اسپرلوس خزر",
  description: "وب سایت شرکت پارس گستر اسپرلوس خزر",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AOSProvider>
          <Header />
          <Providers>{children}</Providers>
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: { direction: "rtl" },
            }}
          />
          <Footer />
        </AOSProvider>
      </body>
    </html>
  );
}
