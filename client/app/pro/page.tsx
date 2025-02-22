"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { BsCheckLg } from "react-icons/bs";

export default function Pro() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Select the perfect plan for your investment journey
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 flex flex-col "
            data-aos="fade-right"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Free</h2>
            <p className="text-4xl font-bold text-gray-900 mb-6">
              $0
              <span className="text-lg text-gray-600 font-normal">/month</span>
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <BsCheckLg className="text-green-500 text-xl" />
                <span className="text-gray-700">Daily market insights</span>
              </div>
              <div className="flex items-center space-x-3">
                <BsCheckLg className="text-green-500 text-xl" />
                <span className="text-gray-700">3 symbols tracked</span>
              </div>
              <div className="flex items-center space-x-3">
                <BsCheckLg className="text-green-500 text-xl" />
                <span className="text-gray-700">Email notifications</span>
              </div>
            </div>
            <div className="justify-end">
              <Link href="/start">
                <button className="w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all font-medium mt-auto">
                  Get Started
                </button>
              </Link>
            </div>
          </div>

          {/* Pro Tier */}
          <div
            className="bg-purple-600 rounded-xl shadow-lg p-8 text-white relative overflow-hidden"
            data-aos="fade-left"
          >
            {/* <div className="absolute top-4 right-4 bg-purple-500 px-3 py-1 rounded-full text-sm">
              Popular
            </div> */}
            <h2 className="text-2xl font-bold mb-4">Pro</h2>
            <p className="text-4xl font-bold mb-6">
              $0.99<span className="text-lg font-normal">/month</span>
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <BsCheckLg className="text-white text-xl" />
                <span>Everything in Free</span>
              </div>
              <div className="flex items-center space-x-3">
                <BsCheckLg className="text-white text-xl" />
                <span>GenAI position recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <BsCheckLg className="text-white text-xl" />
                <span>10 Symbols tracked</span>
              </div>
              {/* <div className="flex items-center space-x-3">
                <BsCheckLg className="text-white text-xl" />
                <span>Priority support</span>
              </div> */}
            </div>
            <a
              href="mailto:info.portfoliopulse@gmail.com"
              className="text-purple-600 hover:underline"
            >
              <button className="w-full bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all font-medium">
                Coming soon (If interested, email us at
                info.portfoliopulse@gmail.com )
              </button>
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12" data-aos="fade-up">
          {/* <p className="text-gray-600">
            All plans include a 14-day free trial. No credit card required.
          </p> */}
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
