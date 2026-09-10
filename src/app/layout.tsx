import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";

import QueryProvider from "@/providers/QueryProvider";

import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "devanagari"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GreenBridge",
    template: "%s | GreenBridge",
  },
  description: "Find vegetable sellers near you with GreenBridge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSans.variable}>
      <body>
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
