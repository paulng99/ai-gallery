import type { Metadata } from "next";
import { Inter, Noto_Sans_HK, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansHK = Noto_Sans_HK({
  variable: "--font-noto-hk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "AI Gallery - School Photo Management",
  description: "Smart photo gallery with AI tagging and face recognition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoSansHK.variable} ${notoSansSC.variable} antialiased bg-[#F9F7F5] font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
