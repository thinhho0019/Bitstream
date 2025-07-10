
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./layoutWrapper";
 
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans`}
      >
        <LayoutWrapper> {children}</LayoutWrapper>
      </body>
    </html>
  );
}
