import React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTMCE Entertainment | It's a Gawthorpe Ting!",
  description: "The digital HQ of GTMCE Entertainment. Stream underground music, explore studio production services, browse exclusive packages, and shop our custom releases.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-black text-white selection:bg-red-600/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
