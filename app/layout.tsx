import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

const griffithGothic = localFont({
  src: [
    {
      path: "../font/Griffith_Gothic_Black_Ultra.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../font/Griffith_Gothic_Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../font/GriffithGothic_Cond_Ultra.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../font/GriffithGothic_Cond_Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-griffith",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "The Table App | Curated Dinner Experiences & Meaningful Connections in London",
  description:
    "Join The Table App to connect with curious minds through curated dinner experiences at London's best restaurants. Where every dinner is an introduction and connection deserves a seat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${griffithGothic.variable} antialiased bg-card`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
