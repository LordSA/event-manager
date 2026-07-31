import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import ConditionalNavbar from "./components/ConNav";

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
    <html lang="en">
      <body className="bg-[#08090d] text-[#f8fafc] antialiased overflow-y-auto overflow-x-hidden selection:bg-[#6366f1] selection:text-white">
        <SmoothScroll />
        <ConditionalNavbar />
        {children}
      </body>
    </html>
  );
}
