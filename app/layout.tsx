import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AuthSync from "@/components/providers/AuthSync";
import RootChrome from "@/components/layout/RootChrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://toppersthriftske.com"),
  title: {
    default: "ToppersthriftsKE | Premium Caps & Hats in Kenya",
    template: "%s | ToppersthriftsKE",
  },
  description:
    "Shop the latest trending caps, snapbacks, and baseball hats in Kenya. Deadpool, Star Wars, Batman, MLB, NBA and more. Fast delivery to Nairobi and beyond.",
  keywords: ["caps Kenya", "hats Nairobi", "snapbacks", "streetwear Kenya", "ToppersthriftsKE"],
  authors: [{ name: "ToppersthriftsKE" }],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans bg-white text-brand-black dark:bg-gray-950 dark:text-white antialiased transition-colors">
        <ThemeProvider>
          <AuthSync>
            <RootChrome>{children}</RootChrome>
          </AuthSync>
        </ThemeProvider>
      </body>
    </html>
  );
}