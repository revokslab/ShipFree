/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'fr', 'es'],
  pseudoLocale: 'pseudo',
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en',
  },
  catalogs: [
    {
      path: '<rootDir>/locale/locales/{locale}/messages',
      include: ['app', 'components'],
    },
  ],
  format: 'po',
}
