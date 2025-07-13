"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

// Define the shape of our translation object
type Translation = Record<string, string>

// Define the shape of the context value
interface LanguageContextType {
  lang: string
  setLanguage: (newLang: string) => void
  t: (key: string, replacements?: Record<string, string | number>) => string
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// --- static JSON imports (Next.js handles these automatically) ---
import en from "./locales/en.json"
import bn from "./locales/bn.json"
import hi from "./locales/hi.json"
import es from "./locales/es.json"
import mr from "./locales/mr.json"
import gu from "./locales/gu.json"
import pa from "./locales/pa.json"

const languages: Record<string, Translation> = {
  en,
  bn,
  hi,
  es,
  mr,
  gu,
  pa,
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<string>("en")
  const [translations, setTranslations] = useState<Translation>({})

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLang = localStorage.getItem("selectedLanguage") ?? "en"
    if (languages[savedLang]) {
      setLang(savedLang)
      setTranslations(languages[savedLang])
    } else {
      setLang("en")
      setTranslations(languages.en)
      localStorage.setItem("selectedLanguage", "en")
    }
  }, [])

  const setLanguage = (newLang: string) => {
    if (languages[newLang]) {
      setLang(newLang)
      setTranslations(languages[newLang])
      localStorage.setItem("selectedLanguage", newLang)
    } else {
      console.warn(`Language ${newLang} not supported. Falling back to English.`)
      setLang("en")
      setTranslations(languages.en)
      localStorage.setItem("selectedLanguage", "en")
    }
  }

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    let translatedString = translations[key] || key // Fallback to key if not found

    if (replacements) {
      for (const [placeholder, value] of Object.entries(replacements)) {
        translatedString = translatedString.replace(new RegExp(`\\{\\{${placeholder}\\}\\}`, "g"), String(value))
      }
    }
    return translatedString
  }

  return <LanguageContext.Provider value={{ lang, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useTranslation = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider")
  }
  return context
}

// Export supported languages for the selector
export const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "hi", name: "हिंदी (Hindi)" },
  { code: "es", name: "Español (Spanish)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "gu", name: "ગુજરાતી (Gujarati)" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
]
