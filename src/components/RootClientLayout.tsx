"use client";

import { usePathname } from "next/navigation";
import BottomBar from "@/components/BottomBar";

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideBottomBar = (pathname === "/login" || pathname === "/logout");

  return (
    <>
      {children}
      {!hideBottomBar && <BottomBar />}
    </>
  );
}
