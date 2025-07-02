import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { RootLayoutProps } from "@/types/app";
import { SupabaseProvider } from "@/components/providers/SupabaseSessionProvider";
import { createClient } from "@/lib/supabase/server";
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

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SupabaseProvider initialSession={session}>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
