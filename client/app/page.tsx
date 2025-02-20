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
  BsGraphUp,
} from "react-icons/bs";

export default function Landing() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="flex flex-col bg-gradient-to-b from-white to-purple-50/30">
      {/* Hero section */}
      <section className="relative overflow-hidden">
        {/* Background gradient blob */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-3xl" />

        <div
          className="relative min-h-[calc(100vh-4rem)] w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 md:px-8"
          data-aos="fade-up"
        >
          {/* Left side - Text content */}
          <div className="flex flex-col items-start text-left z-10">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BsLightningCharge className="text-purple-600" />
              Automated Market Intelligence
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Portfolio,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
                Smarter
              </span>{" "}
              Every Morning
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
              PortfolioPulse delivers data-driven market insights based on your
              investments, straight to your inbox before market open.
            </p>
            <div className="flex items-center gap-4">
              <Link href="start">
                <button className="group bg-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:bg-purple-700 transition-all text-lg font-medium inline-flex items-center gap-2">
                  Get Started Free
                  <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <p className="text-sm text-gray-500">No credit card required</p>
            </div>
          </div>

          {/* Right side - Image */}
          <div
            className="relative z-10 w-full max-w-[400px] md:max-w-[450px] mx-auto"
            data-aos="fade-left"
          >
            <div className="relative bg-white p-2 rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
              <Image
                width={600}
                height={60}
                src="/dashboard_preview3.png"
                alt="Portfolio Pulse Dashboard"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PortfolioPulse?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay ahead of market movements with our intelligent portfolio
              monitoring system
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BsClockHistory className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Daily Updates
              </h3>
              <p className="text-gray-600">
                Get personalized insights delivered to your inbox every morning
                before market open
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BsGraphUp className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Informed Growth
              </h3>
              <p className="text-gray-600">
                Never lose the pulse of your holdings and see your investments
                grow
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BsLightningCharge className="text-2xl text-purple-600" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  AI-Powered Analysis
                </h3>
                <span className="bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Pro
                </span>
              </div>
              <p className="text-gray-600">
                Leverage GenAI to analyze market trends and news relevant to
                your holdings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div
            className="flex flex-wrap items-center justify-center gap-12 mb-8"
            data-aos="fade-up"
          >
            <Image
              src="/wealthsimple.png"
              alt="Wealthsimple"
              width={120}
              height={40}
              className="h-8 w-auto opacity-50 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/rbc.png"
              alt="RBC"
              width={120}
              height={40}
              className="h-32 w-auto opacity-50 hover:opacity-100 transition-opacity"
            />

            <Image
              src="/cibc.png"
              alt="CIBC"
              width={120}
              height={40}
              className="h-8 w-auto opacity-50 hover:opacity-100 transition-opacity"
            />
          </div>
          <p className="text-sm text-gray-500">
            Compatible with major Financial Institutions
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            data-aos="fade-up"
          >
            Ready to Supercharge Your Portfolio?
          </h2>
          <p
            className="text-lg text-gray-600 mb-8"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Join investors who trust PortfolioPulse for their daily market
            insights
          </p>
          <Link href="start">
            <button
              className="group bg-purple-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-purple-700 transition-all text-lg font-medium inline-flex items-center gap-2"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Get Started Free
              <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      {/* <footer className="w-full py-8 border-t border-gray-100 bg-white"> */}
      <footer className="w-full py-8  bg-white">
        {/* <div className="max-w-7xl mx-auto px-4 md:px-8"> */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/start"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pro"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:info.portfoliopulse@gmail.com"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    Email Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div> */}
        {/* </div> */}
        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-600">
          <p>&copy; 2025 PortfolioPulse. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
