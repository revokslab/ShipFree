'use client'

import { i18n } from '@lingui/core'
import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppLanguage, DEFAULT_LANGUAGE } from './settings'

interface LanguagePreferencesState {
  appLanguage: AppLanguage
  setAppLanguage: (language: AppLanguage) => void
}

export const useLanguagePrefs = create<LanguagePreferencesState>()(
  persist(
    (set) => ({
      appLanguage: DEFAULT_LANGUAGE,
      setAppLanguage: (language) => set({ appLanguage: language }),
    }),
    {
      name: 'language-preferences',
      version: 1,
    }
  )
)

export async function dynamicActivate(locale: AppLanguage) {
  let mod: any

  switch (locale) {
    case AppLanguage.en: {
      mod = await import(`./locales/en/messages`)
      break
    }
    case AppLanguage.fr: {
      mod = await import(`./locales/fr/messages`)
      break
    }
    case AppLanguage.es: {
      mod = await import(`./locales/es/messages`)
      break
    }
    default: {
      mod = await import(`./locales/en/messages`)
      break
    }
  }

  i18n.load(locale, mod.messages)
  i18n.activate(locale)
}

export function useLocaleLanguage() {
  const { appLanguage } = useLanguagePrefs()

  useEffect(() => {
    document.documentElement.lang = appLanguage
    dynamicActivate(appLanguage)
  }, [appLanguage])

  return appLanguage
}
