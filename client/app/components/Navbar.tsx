"use client";
import { BsGear } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3 bg-white/80 backdrop-blur-xl border-b border-purple-100/50 shadow-sm shadow-purple-500/5"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Image
              src="/logo_nobg.png"
              alt="Portfolio Pulse"
              width={44}
              height={44}
              className="relative rounded-full"
            />
          </div>
          <span className="font-display text-xl font-bold text-gray-900">
            PortfolioPulse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-1">
          <NavLink href="/contact" active={isActive("/contact")}>
            Contact
          </NavLink>
          <NavLink href="/pro" active={isActive("/pro")}>
            <span className="font-bold">Pro</span>
          </NavLink>

          <div className="w-px h-6 bg-purple-200 mx-3" />

          {isLoaded && isSignedIn ? (
            <>
              <Link href="/configure">
                <button className="p-2.5 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300">
                  <BsGear className="text-xl" />
                </button>
              </Link>
              <Link href="/start" className="ml-2 mr-3">
                <button className="relative overflow-hidden bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-[0_4px_20px_rgba(147,51,234,0.35)] active:scale-[0.98]">
                  Dashboard
                </button>
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="relative overflow-hidden bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-[0_4px_20px_rgba(147,51,234,0.35)] active:scale-[0.98]">
                  Get Started
                </button>
              </SignUpButton>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden p-2 rounded-lg hover:bg-purple-50 transition-colors"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          <div className="relative w-6 h-5">
            <span
              className={`absolute block h-0.5 w-6 bg-gray-700 transform transition-all duration-300 ease-out ${
                isOpen ? "rotate-45 top-2" : "top-0"
              }`}
            />
            <span
              className={`absolute block h-0.5 w-6 bg-gray-700 top-2 transition-all duration-200 ${
                isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
              }`}
            />
            <span
              className={`absolute block h-0.5 w-6 bg-gray-700 transform transition-all duration-300 ease-out ${
                isOpen ? "-rotate-45 top-2" : "top-4"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden absolute top-full left-0 w-full transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="mx-4 mt-2 bg-white rounded-2xl overflow-hidden shadow-xl shadow-purple-500/10 border border-purple-100">
          <div className="p-2">
            <MobileNavLink
              href="/contact"
              active={isActive("/contact")}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </MobileNavLink>
            <MobileNavLink
              href="/pro"
              active={isActive("/pro")}
              onClick={() => setIsOpen(false)}
            >
              <span className="font-bold">Pro</span>
            </MobileNavLink>

            {isLoaded && isSignedIn ? (
              <>
                <MobileNavLink
                  href="/configure"
                  active={isActive("/configure")}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <BsGear className="text-gray-400" />
                    Settings
                  </span>
                </MobileNavLink>

                <div className="px-2 pt-2 pb-2">
                  <Link
                    href="/start"
                    className="block"
                    onClick={() => setIsOpen(false)}
                  >
                    <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300">
                      Dashboard
                    </button>
                  </Link>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                      },
                    }}
                  />
                  <span className="text-sm text-gray-600">Account</span>
                </div>
              </>
            ) : (
              <>
                <div className="px-2 pt-2 pb-2 space-y-2">
                  <SignInButton mode="modal">
                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300">
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          active
            ? "text-purple-700 bg-purple-100"
            : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
        }`}
      >
        {children}
      </button>
    </Link>
  );
}

function MobileNavLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <div
        className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
          active
            ? "text-purple-700 bg-purple-100"
            : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
        }`}
      >
        {children}
      </div>
    </Link>
  );
}
