"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import type { LocaleKey } from "@/lib/i18n";
import clsx from "clsx";

export function LocaleSwitcher() {
  const { locale, setLocale, navLabels, localeLabels } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        aria-label={navLabels.language}
        className="h-8 gap-1.5 px-3 has-[>svg]:px-2.5"
      >
        <Globe className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-popover text-popover-foreground rounded-lg border shadow-md overflow-hidden py-1 z-50">
          {(["hk", "zh", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l as LocaleKey);
                setOpen(false);
              }}
              className={clsx(
                "w-full text-left px-3 py-2 text-sm transition-colors",
                locale === l
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {localeLabels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
