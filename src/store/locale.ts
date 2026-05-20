"use client";
import { create } from "zustand";
import { dict, type Locale, type Dict } from "@/lib/i18n";

interface State {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
}

export const useLocale = create<State>((set) => ({
  locale: "en",
  t: dict.en,
  setLocale: (l) => set({ locale: l, t: dict[l] }),
}));
