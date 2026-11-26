"use client";

import { createContext, useContext, useState } from "react";

/* Minimal site-wide language switch.
   Scope is deliberately small: it drives the copy of this page only, and it is
   written as a context so the same provider can wrap more pages later without
   touching the consumers.
   The choice is kept in localStorage so a visitor who reads in Spanish is not
   flipped back to English on every navigation. */
const LanguageContext = createContext({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children, initial = "en" }) {
  const [lang, setLangState] = useState(initial);

  const setLang = (next) => {
    setLangState(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("sigil-lang", next);
        document.documentElement.setAttribute("lang", next);
      } catch {
        // localStorage can be blocked; the switch still works for this view.
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/* Two-state pill. Reads as a control, not as decoration: the inactive language
   is dimmed, the active one is filled. */
export function LanguageToggle({ className = "" }) {
  const { lang, setLang } = useLanguage();
  return (
    <div className={`${className} lang-toggle`} role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLang("es")}
        aria-pressed={lang === "es"}
        data-active={lang === "es"}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        data-active={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}
