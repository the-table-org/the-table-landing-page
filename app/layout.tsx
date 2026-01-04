import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Table App | Curated Dinner Experiences & Meaningful Connections in London",
  description: "Join The Table App to connect with curious minds through curated dinner experiences at London's best restaurants. Where every dinner is an introduction and connection deserves a seat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${crimsonPro.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
