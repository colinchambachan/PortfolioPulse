"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import Image from "next/image";
import {
  BsArrowRight,
  BsLightningCharge,
  BsClockHistory,
  BsShieldLock,
} from "react-icons/bs";

export default function Landing() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      offset: 50,
    });
    AOS.refresh();

    return () => {
      AOS.refresh();
    };
  }, []);

  return (
    <div className="flex flex-col bg-gradient-to-b from-white to-purple-50/30">
      {/* Hero section */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Background gradient blob - optimized for mobile */}
        <div className="absolute top-[-10%] right-[-20%] w-[100vw] sm:w-[600px] h-[50vh] sm:h-[600px] bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[100vw] sm:w-[600px] h-[50vh] sm:h-[600px] bg-purple-100/30 rounded-full blur-3xl" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-0 flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[calc(100vh-5rem)]">
          {/* Left side - Text content */}
          <div
            className="flex flex-col items-center md:items-start text-center md:text-left z-10 mt-8 sm:mt-0"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div
              className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <BsLightningCharge className="text-purple-600" />
              <span className="whitespace-nowrap">
                Automated Market Intelligence
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Your Portfolio,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
                Smarter
              </span>{" "}
              <br className="hidden sm:block" />
              Every Morning
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-xl"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              PortfolioPulse delivers data-driven market insights based on your
              investments, straight to your inbox before market open.
            </p>
            <div
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <Link href="start" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto group bg-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:bg-purple-700 transition-all text-lg font-medium inline-flex items-center justify-center gap-2">
                  Get Started Free
                  <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <p className="text-sm text-gray-500">No credit card required</p>
            </div>
          </div>

          {/* Right side - Image */}
          <div
            className="relative z-10 w-full max-w-[350px] sm:max-w-[400px] md:max-w-[450px] mx-auto mt-8 md:mt-0"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="relative bg-white p-2 rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
              <Image
                width={600}
                height={60}
                src="/dashboard_preview4.png"
                alt="Portfolio Pulse Dashboard"
                className="w-full h-auto rounded-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PortfolioPulse?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Stay ahead of market movements with our intelligent portfolio
              monitoring system
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BsClockHistory className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Daily Updates
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Get personalized pulses delivered to your inbox every morning
                before market open
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BsShieldLock className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Portfolio Privacy
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Documents are never stored - just the holdings and quantities
                you approve
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BsLightningCharge className="text-2xl text-purple-600" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  AI-Powered Analysis
                </h3>
                <span className="bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Pro
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Leverage GenAI to analyze market trends and news relevant to
                your holdings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mb-6 sm:mb-8">
            <Image
              src="/wealthsimple.png"
              alt="Wealthsimple"
              width={1200}
              height={40}
              className="h-6 sm:h-8 w-auto opacity-50 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/rbc.png"
              alt="RBC"
              width={120}
              height={40}
              className="h-24 sm:h-32 w-auto opacity-50 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/cibc.png"
              alt="CIBC"
              width={120}
              height={40}
              className="h-6 sm:h-8 w-auto opacity-50 hover:opacity-100 transition-opacity"
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Compatible with major Financial Institutions
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Ready to Supercharge Your Portfolio?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            Join investors who trust PortfolioPulse for their daily market
            insights
          </p>
          <Link href="start">
            <button className="w-full sm:w-auto group bg-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg hover:bg-purple-700 transition-all text-lg font-medium inline-flex items-center justify-center gap-2">
              Get Started Free
              <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      <footer className="w-full py-8 bg-white">
        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-600">
          <p className="text-sm">
            &copy; 2025 PortfolioPulse. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
