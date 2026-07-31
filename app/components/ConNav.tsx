"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide public navbar on Admin dashboard pages and login page
  const isHidePage = pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (isHidePage) {
    return null; 
  }

  return <Navbar />;
}