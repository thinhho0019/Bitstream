// components/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/navBar";
import SessionProviderWrapper from "@/app/sessionProviderWrapper";
import BottomNavigation from "@/components/bottomNav";
import { Toaster } from 'sonner'
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "";

  return (
    <>
      {lastSegment !== "login" && lastSegment != "register" && <NavBar />}
      <SessionProviderWrapper>{children}</SessionProviderWrapper>
      {lastSegment !== "login" && lastSegment != "register" && <BottomNavigation />}
      <Toaster position="bottom-center" richColors />
    </>
  );
}
