import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Providers from "./providers";
import { Toaster } from "./components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const sora = Sora({ 
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PortfolioPulse",
  description: "Your Portfolio, Smarter Every Morning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${sora.variable} ${spaceGrotesk.variable} font-sans antialiased bg-white`}>
        <Providers>
          <Navbar />
          {children}
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
