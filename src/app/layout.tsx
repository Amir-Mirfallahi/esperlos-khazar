import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AOSProvider from "@/components/common/AOSProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
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
                  fontFamily: `var(--font-geist-sans)`,
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
