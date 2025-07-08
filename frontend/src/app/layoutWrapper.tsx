// components/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/navBar";
import SessionProviderWrapper from "@/app/sessionProviderWrapper";
import BottomNavigation from "@/components/bottomNav";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "";

  return (
    <>
      {lastSegment !== "login" && <NavBar />}
      <SessionProviderWrapper>{children}</SessionProviderWrapper>
      <BottomNavigation />
    </>
  );
}
