import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

import "./globals.css";

import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "GreenBridge",
  description: "From Farms to Families",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider>
          <QueryProvider>
            <AuthProvider>
              <Navbar />

              {children}
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}