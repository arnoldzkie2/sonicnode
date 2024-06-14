import type { Metadata } from "next";
import "./globals.css";
import TrpcProvider from "./_trpc/TrpcProvider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import SessionProviders from "@/components/ui/session-provider";

export const metadata: Metadata = {
  title: "Sonic Node",
  icons: '/logo.svg',
  description: "The best minecraft server hosting in asia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProviders>
        <TrpcProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
            <body>{children}</body>
          </ThemeProvider>
        </TrpcProvider>
      </SessionProviders>
    </html>
  );
}
