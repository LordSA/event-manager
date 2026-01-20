"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const isChatPage = pathname.startsWith("/events/") && pathname.split("/").length > 2;

  if (isChatPage) {
    return null; 
  }

  return <Navbar />;
}