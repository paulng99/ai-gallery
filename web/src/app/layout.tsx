import type { Metadata } from "next";
import { Inter, Noto_Sans_HK, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { NavBar, FooterText } from "@/components/NavBar";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansHK.variable} ${notoSansSC.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="min-h-screen bg-background">
            <NavBar />
            <main className="flex-1 container max-w-screen-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
            <footer className="border-t bg-muted/50 mt-16">
              <div className="container max-w-screen-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <FooterText />
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}


