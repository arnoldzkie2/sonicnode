import type { Metadata } from "next";
import "./globals.css";
import TrpcProvider from "./_trpc/TrpcProvider";

export const metadata: Metadata = {
  title: "PexilNode",
  description: "Affordable Minecraft Server Hosting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <TrpcProvider>
      <body>{children}</body>
      </TrpcProvider>
    </html>
  );
}
