import type { Metadata } from "next";
// Removed Geist font imports
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AOSProvider from "@/components/common/AOSProvider";

// Removed duplicate Geist font imports and comments

export const metadata: Metadata = {
  title: "پارس گستر اسپرلوس خزر",
  description: "وب سایت شرکت پارس گستر اسپرلوس خزر",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AOSProvider>
          <div className="">
            <Header />
            <Providers>{children}</Providers>
            <Toaster
              position="bottom-center"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  // fontFamily removed, will inherit from body
                  direction: "rtl",
                },
              }}
            />
            <Footer />
          </div>
        </AOSProvider>
      </body>
    </html>
  );
}
