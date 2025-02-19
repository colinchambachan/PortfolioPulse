"use client";
import { BsGear } from "react-icons/bs";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className="w-full flex items-center justify-between px-8 border-b border-gray-100/30 fixed top-0 z-10 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/70"
      data-aos="fade-down"
    >
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo_nobg.png"
            alt="Portfolio Pulse Dashboard"
            width={75}
            height={40}
            className="rounded-full"
          />
        </Link>
        <Link
          href="/"
          className="text-xl ms-[-1rem] font-bold text-gray-900 rounded-lg hidden sm:block"
        >
          PortfolioPulse
        </Link>
      </div>

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

      <div className="sm:hidden dropdown dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content bg-white text-gray-900 rounded-box z-[1] w-52 shadow-2xl"
        >
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <Link href="/start">Get Started</Link>
          </li>
          <li>
            <Link href="/configure">Configure</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
