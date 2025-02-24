"use client";
import { BsGear } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className="w-full flex items-center justify-between px-4 sm:px-8 py-3 border-b border-gray-100/30 bg-white relative z-50"
      data-aos="fade-down"
    >
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo_nobg.png"
            alt="Portfolio Pulse Dashboard"
            width={60}
            height={32}
            className="rounded-full"
          />
          <span className="text-lg font-bold text-gray-900 sm:hidden">
            PortfolioPulse
          </span>
        </Link>
        <Link
          href="/"
          className="text-xl ms-[-0.5rem] font-bold text-gray-900 rounded-lg hidden sm:block"
        >
          PortfolioPulse
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="flex items-center space-x-6 hidden sm:flex">
        <button className="flex items-center text-gray-600 hover:text-purple-600 transition">
          <Link href="/"> Home </Link>
        </button>
        <button className="flex items-center text-gray-600 hover:text-purple-600 transition">
          <Link href="/contact"> Contact </Link>
        </button>
        <button className="flex items-center text-gray-600 hover:text-purple-600 transition">
          <Link href="/pro">
            <span className="font-bold">Pro </span>
          </Link>
        </button>
        <button className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all">
          <Link href="/start">Get Started</Link>
        </button>
        <button className="flex items-center text-gray-600 hover:text-purple-600 transition">
          <Link href="/configure">
            <BsGear className="text-2xl" />
          </Link>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          <div className="relative w-6 h-5">
            <span
              className={`absolute block h-0.5 w-6 bg-gray-600 transform transition-all duration-300 ease-in-out ${
                isOpen ? "rotate-45 top-2" : "top-0"
              }`}
            />
            <span
              className={`absolute block h-0.5 w-6 bg-gray-600 top-2 transition-all duration-200 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute block h-0.5 w-6 bg-gray-600 transform transition-all duration-300 ease-in-out ${
                isOpen ? "-rotate-45 top-2" : "top-4"
              }`}
            />
          </div>
        </button>

        {/* Mobile Menu */}
        <div
          className={`absolute right-0 mt-4 w-screen max-w-[250px] transform transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[-10px] pointer-events-none"
          }`}
        >
          <ul className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
            <li>
              <Link
                href="/"
                className={`flex items-center px-4 py-3 hover:bg-purple-50 transition-colors ${
                  pathname === "/"
                    ? "text-purple-600 bg-purple-50/50"
                    : "text-gray-700"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`flex items-center px-4 py-3 hover:bg-purple-50 transition-colors ${
                  pathname === "/contact"
                    ? "text-purple-600 bg-purple-50/50"
                    : "text-gray-700"
                }`}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/pro"
                className={`flex items-center px-4 py-3 hover:bg-purple-50 transition-colors ${
                  pathname === "/pro"
                    ? "text-purple-600 bg-purple-50/50"
                    : "text-gray-700"
                }`}
              >
                Pro
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link
                href="/start"
                className="flex items-center justify-center bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Get Started
              </Link>
            </li>
            <li>
              <Link
                href="/configure"
                className={`flex items-center px-4 py-3 hover:bg-purple-50 transition-colors ${
                  pathname === "/configure"
                    ? "text-purple-600 bg-purple-50/50"
                    : "text-gray-700"
                }`}
              >
                {/* <BsGear className="mr-2" /> */}
                Configure
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
