"use client";
import { useState } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="bg-primary text-white text-sm py-2 hidden md:block">
        <div className="section-container flex justify-between items-center py-[4px]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span dir="ltr">۰۱۱-۳۳۱۱۲۲۳۳</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>info@khazar-sperlus.com</span>
            </div>
          </div>
          <div className="flex gap-4">{/* Social links would go here */}</div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="section-container py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-2xl text-primary flex gap-2 items-center"
          >
            <img src="/logo.png" alt="logo" className="w-16 h-16" />
            پارس گستر
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="font-medium hover:text-primary transition-colors"
            >
              خانه
            </Link>
            <Link
              href="/about"
              className="font-medium hover:text-primary transition-colors"
            >
              درباره ما
            </Link>
            <Link
              href="/products"
              className="font-medium hover:text-primary transition-colors"
            >
              محصولات
            </Link>
            <Link
              href="/contact"
              className="font-medium hover:text-primary transition-colors"
            >
              تماس با ما
            </Link>
          </nav>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:block">
            <Button variant="accent">درخواست مشاوره</Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="section-container py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="py-2 hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              خانه
            </Link>
            <Link
              href="/about"
              className="py-2 hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              درباره ما
            </Link>
            <Link
              href="/products"
              className="py-2 hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              محصولات
            </Link>
            <Link
              href="/contact"
              className="py-2 hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              تماس با ما
            </Link>
            <Button variant="accent" className="mt-4">
              درخواست مشاوره
            </Button>

            {/* Mobile contact info */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-sm space-y-4">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span dir="ltr">۰۱۱-۳۳۱۱۲۲۳۳</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@khazar-sperlus.com</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
