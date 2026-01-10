export interface ThemeColors {
  primaryColor?: string
  primaryHoverColor?: string
  accentColor?: string
  accentHoverColor?: string
  backgroundColor?: string
}

export interface BrandConfig {
  name: string
  logoUrl?: string
  faviconUrl?: string
  customCssUrl?: string
  supportEmail?: string
  documentationUrl?: string
  termsUrl?: string
  privacyUrl?: string
  theme?: ThemeColors
}

/**
 * Default brand configuration values
 */
const defaultConfig: BrandConfig = {
  name: 'ShipFree',
  logoUrl: undefined,
  faviconUrl: '/favicon/favicon.ico',
  customCssUrl: undefined,
  supportEmail: 'hi@revoks.dev',
  documentationUrl: undefined,
  termsUrl: undefined,
  privacyUrl: undefined,
  theme: {
    primaryColor: '#701ffc',
    primaryHoverColor: '#802fff',
    accentColor: '#9d54ff',
    accentHoverColor: '#a66fff',
    backgroundColor: '#0c0c0c',
  },
}

const getThemeColors = (): ThemeColors => {
  return {
    primaryColor: defaultConfig.theme?.primaryColor,
    primaryHoverColor: defaultConfig.theme?.primaryHoverColor,
    accentColor: defaultConfig.theme?.accentColor,
    accentHoverColor: defaultConfig.theme?.accentHoverColor,
    backgroundColor: defaultConfig.theme?.backgroundColor,
  }
}

export const getBrandConfig = (): BrandConfig => {
  return {
    name: defaultConfig.name,
    logoUrl: defaultConfig.logoUrl,
    faviconUrl: defaultConfig.faviconUrl,
    customCssUrl: defaultConfig.customCssUrl,
    supportEmail: defaultConfig.supportEmail,
    documentationUrl: defaultConfig.documentationUrl,
    termsUrl: defaultConfig.termsUrl,
    privacyUrl: defaultConfig.privacyUrl,
    theme: getThemeColors(),
  }
}

/**
 * Hook to use brand configuration in React components
 */
export const useBrandConfig = () => {
  return getBrandConfig()
}
