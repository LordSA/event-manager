import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import ConditionalNavbar from "./components/ConNav";

const quera = localFont({
  src: "../fonts/quera.otf",
  variable: "--font-quera",
  display: "swap",
});

const gued = localFont({
  src: "../fonts/gued.otf",
  variable: "--font-gued",
  display: "swap",
});

const roundered = localFont({
  src: "../fonts/roundered.ttf",
  variable: "--font-roundered",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Whats @CEV | Multi-Community Event Manager",
  description: "Unified campus event discovery, slot booking, and community management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quera.variable} ${gued.variable}`}>
      <body className="bg-[#08090d] text-[#f8fafc] antialiased overflow-y-auto overflow-x-hidden selection:bg-[#6366f1] selection:text-white font-sans">
        <SmoothScroll />
        <ConditionalNavbar />
        {children}
      </body>
    </html>
  );
}
