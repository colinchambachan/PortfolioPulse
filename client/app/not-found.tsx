"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function NotFound() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section
        className="flex-1 w-full max-w-7xl mx-auto flex flex-col items-center justify-center px-4 md:px-8"
        data-aos="fade-up"
      >
        <div className="text-center mb-8">
          <Image
            src="/logo_nobg.png"
            alt="Portfolio Pulse Logo"
            width={150}
            height={150}
            className="mx-auto mb-8"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Oops! It seems like this page has gone off to explore the market.
          </p>
          <button className="bg-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:bg-purple-700 transition-all text-lg font-medium">
            <Link href="/"> Return Home </Link>
          </button>
        </div>
      </section>

      <footer className="w-full text-center py-4 border-t border-gray-100 bg-white">
        <p className="text-gray-600">
          © 2025 Portfolio Pulse, All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
