type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading'

interface ShowToastOptions {
  title: string
  description?: string
  type?: ToastType
}

export function showToast({ title, description, type = 'info' }: ShowToastOptions) {
  console.log(`[${type.toUpperCase()}] ${title}${description ? `: ${description}` : ''}`)
}
