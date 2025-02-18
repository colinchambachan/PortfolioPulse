"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import Image from "next/image";

export default function Landing() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero section - Full viewport height minus navbar */}
      <section
        className="min-h-[calc(100vh-4rem)] w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 md:px-8"
        data-aos="fade-up"
      >
        {/* Left side - Text content */}
        <div className="flex flex-col items-start text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Daily Market Insights Right to Your Inbox
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            PortfolioPulse delivers top stories based on your stock portfolio,
            straight to your inbox every morning.
          </p>
          <button className="bg-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:bg-purple-700 transition-all text-lg font-medium">
            <Link href="start"> Get Started </Link>
          </button>
        </div>

        {/* Right side - Image */}
        <div className="relative" data-aos="fade-left">
          <div className="relative">
            <Image
              width={4000}
              height={400}
              src="/dashboard_preview.png"
              alt="Portfolio Pulse Dashboard"
              className="w-full h-auto rounded-lg shadow-[0_12px_50px_rgb(0,0,0,0.25)]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Second section */}
      <section
        className="min-h-[50vh] w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 md:px-8 mt-16"
        data-aos="fade-up"
      >
        {/* Left side - Image */}
        <div className="relative" data-aos="fade-left" data-aos-delay="200">
          <div className="relative">
            <img
              src="/landing1.png"
              alt="Portfolio Pulse Dashboard"
              className="w-full h-auto rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-lg"></div>
          </div>
        </div>

        {/* Right side - Text content */}
        <div className="flex flex-col items-start text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
            Skip the hassle, make informed decisions
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            With PortfolioPulse, keep track of how your investments are
            developing, with a simple read each morning
          </p>
        </div>
      </section>

      {/* Third section */}
      <section
        className="min-h-[50vh] w-full max-w-7xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 md:px-8 mt-16"
        data-aos="fade-up"
      >
        {/* Left side - Text content */}
        <div className="flex flex-col items-start text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
            Jump in and out of the action, as you please
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Redirect yourself to original sources of trends, or get a quick
            landscape of the market
          </p>
        </div>

        {/* Right side - Image */}
        <div className="relative" data-aos="fade-left" data-aos-delay="200">
          <div className="relative">
            <img
              src="/landing2.jpg"
              alt="Portfolio Pulse Dashboard"
              className="w-full h-auto rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-lg"></div>
          </div>
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
