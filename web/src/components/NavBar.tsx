"use client";

import Link from "next/link";
import { Images, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useLocale } from "@/contexts/LocaleContext";

export function NavBar() {
  const { navLabels, footerLabels } = useLocale();

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter:blur(20px)]:bg-background/80">
        <div className="container flex h-16 max-w-screen-2xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
              <Images className="h-8 w-8 text-primary" />
              AI Gallery
            </Link>
            <div className="hidden md:flex gap-2">
              <Link
                href="/photos"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {navLabels.albums}
              </Link>
              <Link
                href="/students"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {navLabels.students}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <form className="relative hidden md:block w-64" action="/photos" method="get">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                placeholder={navLabels.searchPlaceholder}
                className="pl-10 w-full"
              />
            </form>
            <LocaleSwitcher />
            <Button>{navLabels.login}</Button>
          </div>
        </div>
      </nav>
      {/* Footer is rendered in layout; we export footerLabels via context so layout can use a client footer or we keep footer in NavBar for simplicity - actually footer is in layout. So we need a client Footer or layout to pass footer text. Easiest: a small ClientFooter that just reads useLocale().footerLabels.copyright and renders the footer. Let me add that. */}
    </>
  );
}

/** Client-only footer text so it reacts to locale */
export function FooterText() {
  const { footerLabels } = useLocale();
  return (
    <p className="text-center text-sm text-muted-foreground">
      {footerLabels.copyright}
    </p>
  );
}
