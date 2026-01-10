export enum AppLanguage {
  en = 'en',
  fr = 'fr',
  es = 'es',
}

export interface Language {
  code2: AppLanguage
  name: string
}

export const APP_LANGUAGES: Language[] = [
  { code2: AppLanguage.en, name: 'English' },
  { code2: AppLanguage.fr, name: 'Français' },
  { code2: AppLanguage.es, name: 'Español' },
]

export const DEFAULT_LANGUAGE = AppLanguage.en
