import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { RootLayoutProps } from "@/types/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Takas Go - Her Şey Takaslanabilir",
  description:
    "Eşyadan hizmete, yetenekten zamana… yepyeni bir takas dünyasına hoş geldin! Sürdürülebilir takas platformu.",
  keywords: ["takas", "ikinci el", "sürdürülebilirlik", "paylaşım", "ekonomi"],
  openGraph: {
    title: "Takas Go - Her Şey Takaslanabilir",
    description:
      "Eşyadan hizmete, yetenekten zamana… yepyeni bir takas dünyasına hoş geldin!",
    images: ["/images/hero.png"],
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
