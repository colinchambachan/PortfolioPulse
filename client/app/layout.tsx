import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PortfolioPulse | Make Informed Trades",
  description: "Generate daily market insights based on your stock portfolio",
  image: "/logo_nobg.png",
  url: "https://portfoliopulse.vercel.app",
  type: "website",
  keywords: [
    "stocks",
    "trading",
    "investing",
    "portfolio",
    "market insights",
    "automation",
    "OCR",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
