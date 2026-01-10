import 'server-only'

import { type I18n, type Messages, setupI18n } from '@lingui/core'
import { APP_LANGUAGES, AppLanguage } from './settings'

// Helper to load catalogs
async function loadCatalog(locale: AppLanguage): Promise<{
  [k: string]: Messages
}> {
  const { messages } = await import(`./locales/${locale}/messages.po`)
  return {
    [locale]: messages,
  }
}

// Pre-load all catalogs
const locales = APP_LANGUAGES.map((l) => l.code2)
// This top-level await is valid in ES modules / Next.js server components
const catalogs = await Promise.all(locales.map(loadCatalog))

// Transform array of catalogs into a single object
export const allMessages = catalogs.reduce((acc, oneCatalog) => {
  return { ...acc, ...oneCatalog }
}, {})

type AllI18nInstances = { [K in AppLanguage]: I18n }

export const allI18nInstances: AllI18nInstances = locales.reduce((acc, locale) => {
  const messages = allMessages[locale] ?? {}
  const i18n = setupI18n({
    locale,
    messages: { [locale]: messages },
  })
  return { ...acc, [locale]: i18n }
}, {} as AllI18nInstances)

export const getI18nInstance = (locale: string): I18n => {
  if (!allI18nInstances[locale as AppLanguage]) {
    console.warn(`No i18n instance found for locale "${locale}"`)
    return allI18nInstances[AppLanguage.en]
  }
  return allI18nInstances[locale as AppLanguage]
}
