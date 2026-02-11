import type { Metadata } from "next";
import { Inter, Noto_Sans_HK, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Images, Search, Globe } from "lucide-react";

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
            <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter:blur(20px)]:bg-background/80">
              <div className="container flex h-16 max-w-screen-2xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                  <a href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
                    <Images className="h-8 w-8 text-primary" />
                    AI Gallery
                  </a>
                  <div className="hidden md:flex gap-2">
                    <a href="/photos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                      相簿
                    </a>
                    <a href="/students" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                      學生
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <form className="relative hidden md:block w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="搜尋相片..."
                      className="pl-10 w-full"
                    />
                  </form>
                  <Button variant="ghost" size="sm">
                    <Globe className="h-4 w-4" />
                  </Button>
                  <Button>登入</Button>
                </div>
              </div>
            </nav>
            <main className="flex-1 container max-w-screen-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
            <footer className="border-t bg-muted/50 mt-16">
              <div className="container max-w-screen-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-muted-foreground">
                  © 2026 學校活動相片管理系統. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}


