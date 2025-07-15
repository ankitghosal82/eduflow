"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

// Import all locale files
import en from "./locales/en.json"
import es from "./locales/es.json"
import bn from "./locales/bn.json"
import hi from "./locales/hi.json"
import gu from "./locales/gu.json"
import mr from "./locales/mr.json"
import pa from "./locales/pa.json"

type Locale = typeof en | typeof es | typeof bn | typeof hi | typeof gu | typeof mr | typeof pa

const locales: Record<string, Locale> = {
  en,
  es,
  bn,
  hi,
  gu,
  mr,
  pa,
}

export const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "bn", name: "বাংলা" },
  { code: "hi", name: "हिन्दी" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "mr", name: "मराठी" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
]

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>("en")
  const [translations, setTranslations] = useState<Locale>(locales.en)

  useEffect(() => {
    // Attempt to load language from localStorage
    const storedLang = localStorage.getItem("selectedLanguage")
    if (storedLang && locales[storedLang]) {
      setLanguageState(storedLang)
      setTranslations(locales[storedLang])
    } else {
      // Fallback to browser language or default to English
      const browserLang = navigator.language.split("-")[0]
      if (locales[browserLang]) {
        setLanguageState(browserLang)
        setTranslations(locales[browserLang])
        localStorage.setItem("selectedLanguage", browserLang)
      } else {
        setLanguageState("en")
        setTranslations(locales.en)
        localStorage.setItem("selectedLanguage", "en")
      }
    }
  }, [])

  const setLanguage = useCallback((lang: string) => {
    if (locales[lang]) {
      setLanguageState(lang)
      setTranslations(locales[lang])
      localStorage.setItem("selectedLanguage", lang)
    } else {
      console.warn(`Language "${lang}" not supported. Falling back to English.`)
      setLanguageState("en")
      setTranslations(locales.en)
      localStorage.setItem("selectedLanguage", "en")
    }
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let translatedText = (translations as any)[key] || key

      if (params) {
        for (const [paramKey, paramValue] of Object.entries(params)) {
          translatedText = translatedText.replace(new RegExp(`{{${paramKey}}}`, "g"), String(paramValue))
        }
      }
      return translatedText
    },
    [translations],
  )

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider")
  }
  return context
}
