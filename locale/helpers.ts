import type { Language } from './settings'

function getLocalizedLanguage(langCode: string, appLang: string): string | undefined {
  try {
    const allNames = new Intl.DisplayNames([appLang], {
      type: 'language',
      fallback: 'none',
      languageDisplay: 'standard',
    })
    const translatedName = allNames.of(langCode)

    if (translatedName) {
      return translatedName
    }
  } catch (e) {
    // ignore RangeError from Intl.DisplayNames APIs
    if (!(e instanceof RangeError)) {
      throw e
    }
  }
}

export function languageName(language: Language, appLang: string): string {
  // if Intl.DisplayNames is unavailable on the target, display the English name
  if (!Intl.DisplayNames) {
    return language.name
  }

  return getLocalizedLanguage(language.code2, appLang) || language.name
}

/**
 * Gets region name for a given country code and language.
 *
 * Falls back to English if unavailable/error, and if that fails, returns the country code.
 *
 * Intl.DisplayNames is widely available + has been polyfilled on native
 */
export function regionName(countryCode: string, appLang: string): string {
  const translatedName = getLocalizedRegionName(countryCode, appLang)

  if (translatedName) {
    return translatedName
  }

  // Fallback: get English name. Needed for i.e. Esperanto
  const englishName = getLocalizedRegionName(countryCode, 'en')
  if (englishName) {
    return englishName
  }

  // Final fallback: return country code
  return countryCode
}

function getLocalizedRegionName(countryCode: string, appLang: string): string | undefined {
  try {
    const allNames = new Intl.DisplayNames([appLang], {
      type: 'region',
      fallback: 'none',
    })

    return allNames.of(countryCode)
  } catch (err) {
    console.warn('Error getting localized region name:', err)
    return undefined
  }
}
