import type { Metadata } from "next";
import "./globals.css";
import TrpcProvider from "./_trpc/TrpcProvider";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "PixelNode",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <body>{children}</body>
        </ThemeProvider>
      </TrpcProvider>
    </html>
  );
}
