'use client'

import { I18nProvider as DefaultI18nProvider } from '@lingui/react'
import { useState, type ReactNode } from 'react'
import { type Messages, setupI18n } from '@lingui/core'

export function I18nProvider({
  children,
  initialLocale,
  initialMessages,
}: {
  children: ReactNode
  initialLocale: string
  initialMessages: Messages
}) {
  const [i18nInstance] = useState(() => {
    return setupI18n({
      locale: initialLocale,
      messages: { [initialLocale]: initialMessages },
    })
  })
  return <DefaultI18nProvider i18n={i18nInstance}>{children}</DefaultI18nProvider>
}
