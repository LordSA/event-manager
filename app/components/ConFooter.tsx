// Created by Shibili Aman TK | GitHub: https://github.com/LordSA
"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  const isHidePage = pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (isHidePage) {
    return null; 
  }

  return <Footer />;
}
