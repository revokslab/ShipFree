/**
 * Payment Hooks
 *
 * Client-side hooks for interacting with the payment system.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { SubscriptionData, CheckoutResult, PortalResult } from './types'
import type { PlanName } from '@/config/payments'

export function useSubscription() {
  const {
    data: subscription,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const res = await fetch('/api/payments/subscription')
      if (!res.ok) throw new Error('Failed to fetch subscription')
      const data = await res.json()
      return data.subscription as SubscriptionData | null
    },
  })

  return { subscription, isLoading, error: error as Error | null, refresh: refetch }
}

interface CheckoutOptions {
  plan: PlanName
  successUrl?: string
  cancelUrl?: string
}

export function useCheckout() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (options: CheckoutOptions) => {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to initiate checkout')
      }
      const data: CheckoutResult = await res.json()
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      if (data.url) {
        window.location.href = data.url
      }
    },
  })

  return {
    checkout: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  }
}

export function usePortal() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (returnUrl?: string) => {
      const res = await fetch('/api/payments/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnUrl }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to open portal')
      }
      const data: PortalResult = await res.json()
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      if (data.url) {
        window.location.href = data.url
      }
    },
  })

  return {
    openPortal: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  }
}
