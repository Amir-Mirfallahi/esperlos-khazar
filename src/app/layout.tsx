import type { Metadata } from "next";
import { GeistSans } from "@vercel/geist-font/sans";
import { GeistMono } from "@vercel/geist-font/mono";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AOSProvider from "@/components/common/AOSProvider";

// Correctly import and use GeistSans and GeistMono
// GeistSans itself provides the necessary CSS variable setup when imported.
// If you need both sans and mono:
import { GeistSans } from "@vercel/geist-font/sans";
import { GeistMono } from "@vercel/geist-font/mono";


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
    <html lang="fa" dir="rtl" className={`${GeistSans.variable} ${GeistMono.variable}`}>
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
