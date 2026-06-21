import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/features/Navbar";
import { Footer } from "@/components/features/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "TalentDash — Career Intelligence Platform for India", template: "%s | TalentDash" },
  description: "Real salary data, company reviews, interview experiences for India's tech professionals. Compare offers, explore compensation by level and location.",
  metadataBase: new URL("https://talentdash.com"),
  openGraph: {
    siteName: "TalentDash",
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#F7F7F7] text-[#484848] font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
