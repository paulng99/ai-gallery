"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type LocaleKey,
  localeToHtmlLang,
  copy,
  localeLabels,
} from "@/lib/i18n";

const STORAGE_KEY = "ai-gallery-locale";

type LocaleContextValue = {
  locale: LocaleKey;
  setLocale: (locale: LocaleKey) => void;
  labels: typeof copy.photos.hk;
  navLabels: typeof copy.nav.hk;
  footerLabels: typeof copy.footer.hk;
  localeLabels: Record<LocaleKey, string>;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getStoredLocale(): LocaleKey {
  if (typeof window === "undefined") return "hk";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "hk" || stored === "zh" || stored === "en") return stored;
  return "hk";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleKey>("hk");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getStoredLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((next: LocaleKey) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = localeToHtmlLang[next];
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = localeToHtmlLang[locale];
  }, [locale, mounted]);

  const value: LocaleContextValue = {
    locale,
    setLocale,
    labels: copy.photos[locale],
    navLabels: copy.nav[locale],
    footerLabels: copy.footer[locale],
    localeLabels,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
