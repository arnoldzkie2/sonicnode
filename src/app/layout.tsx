import type { Metadata } from "next";
import "./globals.css";
import TrpcProvider from "./_trpc/TrpcProvider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import SessionProviders from "@/components/ui/session-provider";
import { Toaster } from "@/components/ui/sonner"
import Adsense from "@/components/Adsense";

export const metadata: Metadata = {
  title: "SonicNode - Minecraft Server Hosting",
  icons: '/logo.png',
  description: "A reliable Minecraft server hosting in Philippines, offering a 3-day free trial so you can experience our exceptional performance firsthand",
  openGraph: {
    title: "SonicNode - Minecraft Server Hosting",
    description: "A reliable Minecraft server hosting in Philippines, offering a 3-day free trial so you can experience our exceptional performance firsthand.",
    type: "website",
    locale: "en_US",
    url: "https://sonicnode.xyz/",
    images: "https://sonicnode.xyz/logo.png",
    siteName: "SonicNode"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Adsense
          pubID={process.env.ADSENSE_ID as string}
        />
      </head>
      <SessionProviders>
        <TrpcProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
            <body>
              {children}
              <Toaster />
            </body>
          </ThemeProvider>
        </TrpcProvider>
      </SessionProviders>
    </html>
  );
}
