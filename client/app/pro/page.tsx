"use client";

import React from "react";
import Link from "next/link";
import { BsCheckCircleFill, BsStars, BsLightningChargeFill } from "react-icons/bs";

export default function Pro() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-[80px]" />
      </div>

      <section className="relative flex-1 flex items-center justify-center w-full max-w-7xl mx-auto px-4 md:px-8 py-24 pt-32">
        <div className="w-full">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <span className="inline-block text-purple-600 font-semibold text-sm tracking-wider uppercase mb-4">
              Pricing
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your investment journey
            </p>
          </div>

          {/* Pricing Cards */}
          <div 
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-fade-up"
            style={{ animationDelay: "150ms" }}
          >
            {/* Free Tier */}
            <div className="bg-white rounded-2xl p-8 border border-purple-200 shadow-[0_8px_40px_-12px_rgba(147,51,234,0.15)] flex flex-col transition-all duration-500 hover:shadow-[0_16px_50px_-12px_rgba(147,51,234,0.25)] hover:-translate-y-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
                <p className="text-gray-500 text-sm">Get started with the basics</p>
              </div>
              
              <div className="mb-8">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-lg text-gray-500 font-normal">/month</span>
              </div>
              
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-center gap-3">
                  <BsCheckCircleFill className="text-purple-500 text-lg flex-shrink-0" />
                  <span className="text-gray-700">Daily market insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <BsCheckCircleFill className="text-purple-500 text-lg flex-shrink-0" />
                  <span className="text-gray-700">3 symbols tracked</span>
                </div>
                <div className="flex items-center gap-3">
                  <BsCheckCircleFill className="text-purple-500 text-lg flex-shrink-0" />
                  <span className="text-gray-700">Email notifications</span>
                </div>
              </div>
              
              <Link href="/start" className="block">
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-4 rounded-xl transition-all duration-300">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="relative bg-gradient-to-br from-purple-600 via-purple-600 to-violet-700 rounded-2xl p-8 text-white shadow-xl shadow-purple-500/25 flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-1">
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
              
              {/* Popular badge */}
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                  <BsStars className="text-amber-300" />
                  Popular
                </span>
              </div>
              
              <div className="relative mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <BsLightningChargeFill className="text-amber-300" />
                  <h2 className="text-2xl font-bold">Pro</h2>
                </div>
                <p className="text-purple-200 text-sm">Unlock the full potential</p>
              </div>
              
              <div className="relative mb-8">
                <span className="text-5xl font-bold">$0.99</span>
                <span className="text-lg text-purple-200 font-normal">/month</span>
              </div>
              
              <div className="relative space-y-4 mb-8 flex-1">
                <div className="flex items-center gap-3">
                  <BsCheckCircleFill className="text-purple-200 text-lg flex-shrink-0" />
                  <span className="text-white/90">Everything in Free</span>
                </div>
                <div className="flex items-center gap-3">
                  <BsCheckCircleFill className="text-purple-200 text-lg flex-shrink-0" />
                  <span className="text-white/90">GenAI position recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <BsCheckCircleFill className="text-purple-200 text-lg flex-shrink-0" />
                  <span className="text-white/90">10 symbols tracked</span>
                </div>
                <div className="flex items-center gap-3">
                  <BsCheckCircleFill className="text-purple-200 text-lg flex-shrink-0" />
                  <span className="text-white/90">Priority support</span>
                </div>
              </div>
              
              <a
                href="mailto:info.portfoliopulse@gmail.com"
                className="relative block"
              >
                <button className="w-full bg-white hover:bg-purple-50 text-purple-700 font-semibold px-6 py-4 rounded-xl transition-all duration-300 hover:shadow-lg">
                  <span className="block text-sm">Coming Soon</span>
                  <span className="block text-xs text-purple-500 mt-0.5">
                    Email us to get early access
                  </span>
                </button>
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div 
            className="text-center mt-12 animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <p className="text-gray-500 text-sm">
              No credit card required to start. Upgrade anytime.
            </p>
          </div>
        </div>
      </section>

      <footer className="relative w-full text-center py-6 border-t border-purple-100 bg-white">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} PortfolioPulse. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
