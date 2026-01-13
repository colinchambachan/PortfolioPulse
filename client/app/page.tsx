"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BsArrowRight,
  BsLightningChargeFill,
  BsClockHistory,
  BsShieldLockFill,
  BsStars,
  BsGraphUpArrow,
  BsCheckCircleFill,
} from "react-icons/bs";

export default function Landing() {
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-up");
          entry.target.classList.remove("opacity-0", "translate-y-8");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-purple-200/40 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[100px] animate-pulse-glow delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-100/20 rounded-full blur-[150px]" />
      </div>

      {/* Subtle grid pattern */}
      <div className="fixed inset-0 dot-pattern pointer-events-none opacity-60" />

      {/* Hero section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20">
        {/* Floating decorative elements */}
        <div className="absolute top-32 left-[10%] w-3 h-3 bg-purple-400 rounded-full animate-float opacity-60" />
        <div className="absolute top-48 right-[15%] w-4 h-4 bg-purple-300/50 rounded-full animate-float delay-300" />
        <div className="absolute bottom-40 left-[20%] w-2 h-2 bg-purple-500/40 rounded-full animate-float delay-500" />
        <div className="absolute top-1/3 right-[8%] w-5 h-5 border-2 border-purple-300/30 rounded-full animate-float delay-200" />
        <div className="absolute bottom-1/3 right-[25%] w-3 h-3 bg-violet-400/30 rounded-full animate-float delay-400" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2.5 bg-purple-100 border border-purple-200/50 px-5 py-2.5 rounded-full mb-8 animate-fade-up shadow-sm"
              style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
              </span>
              <span className="text-sm font-medium text-purple-700">
                Automated Market Intelligence
              </span>
            </div>

            {/* Main headline */}
            <h1
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-fade-up"
              style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
            >
              <span className="text-gray-900">Your Portfolio,</span>
              <br />
              <span className="gradient-text">Smarter</span>
              <span className="text-gray-900"> Every</span>
              <br className="sm:hidden" />
              <span className="text-gray-900"> Morning</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed animate-fade-up"
              style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
            >
              PortfolioPulse delivers data-driven market insights based on your
              investments, straight to your inbox before market open.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center gap-4 mb-8 animate-fade-up"
              style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
            >
              <Link href="/start" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto group bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-4 px-8 rounded-xl text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:from-purple-500 hover:to-purple-400 hover:shadow-[0_8px_30px_rgba(147,51,234,0.35)] active:scale-[0.98]">
                  Get Started Free
                  <BsArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
              <Link href="/pro" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white border-2 border-purple-200 text-purple-700 font-semibold py-4 px-8 rounded-xl text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:border-purple-400 hover:bg-purple-50 hover:shadow-[0_4px_20px_rgba(147,51,234,0.15)]">
                  Explore Pro
                </button>
              </Link>
            </div>

            <p
              className="text-sm text-gray-500 flex items-center gap-2 animate-fade-up"
              style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
            >
              <BsCheckCircleFill className="text-purple-500" />
              No credit card required
            </p>
          </div>

          {/* Hero Image */}
          <div
            className="relative mt-12 md:mt-16 animate-fade-up"
            style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
          >
            <div className="relative mx-auto max-w-3xl">
              {/* Glow behind image */}
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-400/20 via-purple-300/15 to-violet-400/20 rounded-2xl blur-2xl" />

              {/* Main container with gradient border */}
              <div className="image-glow relative bg-white p-1.5 rounded-xl shadow-[0_16px_48px_-12px_rgba(147,51,234,0.25)]">
                <Image
                  width={900}
                  height={506}
                  src="/dashboard_preview4.png"
                  alt="Portfolio Pulse Dashboard"
                  className="w-full h-auto rounded-lg"
                  priority
                />
              </div>

              {/* Floating stat cards - repositioned for smaller image */}
              <div className="hidden md:block absolute -left-12 top-1/4 glass-card px-3 py-2.5 rounded-lg animate-float shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/25">
                    <BsGraphUpArrow className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Daily Report
                    </p>
                    <p className="text-xs font-bold text-gray-900">+12.4%</p>
                  </div>
                </div>
              </div>

              <div className="hidden md:block absolute -right-12 bottom-1/4 glass-card px-3 py-2.5 rounded-lg animate-float delay-300 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/25">
                    <BsLightningChargeFill className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium">
                      AI Insights
                    </p>
                    <p className="text-xs font-bold text-gray-900">Ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="relative py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section header */}
          <div className="text-center mb-16 sm:mb-20">
            <span className="animate-on-scroll opacity-0 translate-y-8 inline-block text-purple-600 font-semibold text-sm tracking-wider uppercase mb-4">
              Features
            </span>
            <h2 className="animate-on-scroll opacity-0 translate-y-8 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose PortfolioPulse?
            </h2>
            <p className="animate-on-scroll opacity-0 translate-y-8 text-lg text-gray-600 max-w-2xl mx-auto">
              Stay ahead of market movements with our intelligent portfolio
              monitoring system
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="animate-on-scroll opacity-0 translate-y-8 feature-card group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-purple-500/20">
                <BsClockHistory className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Daily Updates
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Get personalized pulses delivered to your inbox every morning
                before market open. Never miss a beat.
              </p>
              <div className="pt-6 border-t border-purple-100">
                <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                  <BsCheckCircleFill />
                  <span>Delivered at 6:00 AM EST</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div
              className="animate-on-scroll opacity-0 translate-y-8 feature-card group"
              style={{ animationDelay: "100ms" }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blue-500/20">
                <BsShieldLockFill className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Portfolio Privacy
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Documents are never stored - just the holdings and quantities
                you approve. Your data stays yours.
              </p>
              <div className="pt-6 border-t border-purple-100">
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <BsCheckCircleFill />
                  <span>End-to-end encrypted</span>
                </div>
              </div>
            </div>

            {/* Feature 3 - Pro */}
            <div
              className="animate-on-scroll opacity-0 translate-y-8 feature-card group relative overflow-hidden md:col-span-2 lg:col-span-1"
              style={{ animationDelay: "200ms" }}
            >
              {/* Pro badge glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-amber-500/20">
                    <BsLightningChargeFill className="text-2xl text-white" />
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold tracking-wide shadow-lg shadow-amber-500/25">
                    PRO
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  AI-Powered Analysis
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Leverage GenAI to analyze market trends and news relevant to
                  your holdings with unprecedented depth.
                </p>
              </div>
              <div className="pt-6 border-t border-purple-100">
                <div className="flex items-center gap-2 text-sm text-amber-600 font-medium">
                  <BsStars />
                  <span>Powered by advanced AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof section */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-b from-white to-purple-50/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="animate-on-scroll opacity-0 translate-y-8 bg-white rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-purple-500/5 border border-purple-100/50">
            <p className="text-gray-500 text-sm uppercase tracking-wider font-medium mb-8">
              Compatible with major Financial Institutions
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
              <Image
                src="/wealthsimple.png"
                alt="Wealthsimple"
                width={180}
                height={40}
                className="h-8 sm:h-10 w-auto brand-rotate brand-rotate-1 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              />
              <Image
                src="/rbc.png"
                alt="RBC"
                width={120}
                height={80}
                className="h-20 sm:h-24 w-auto brand-rotate brand-rotate-2 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              />
              <Image
                src="/cibc.png"
                alt="CIBC"
                width={120}
                height={40}
                className="h-8 sm:h-10 w-auto brand-rotate brand-rotate-3 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-violet-800" />
        <div className="absolute inset-0 dot-pattern opacity-10" />

        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-[100px]" />

        <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="animate-on-scroll opacity-0 translate-y-8">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to Supercharge
              <br />
              <span className="text-purple-200">Your Portfolio?</span>
            </h2>
            <p className="text-lg sm:text-xl text-purple-200/80 mb-10 max-w-2xl mx-auto">
              Join investors who trust PortfolioPulse for their daily market
              insights. Start free, upgrade anytime.
            </p>
            <Link href="/start">
              <button className="group bg-white text-purple-700 font-bold text-lg px-10 py-5 rounded-xl inline-flex items-center gap-3 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98]">
                Get Started Free
                <BsArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full py-12 bg-white border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo_nobg.png"
                alt="PortfolioPulse"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-display font-bold text-gray-900">
                PortfolioPulse
              </span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} PortfolioPulse. All Rights
              Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
