/**
 * Custom Email Provider
 *
 * Allows users to inject their own email provider implementation at runtime.
 * This is useful for:
 * - Using providers not included in the starter kit
 * - Testing with mock providers
 * - Custom integrations
 *
 * Usage:
 * ```ts
 * import { setCustomEmailProvider } from "@/lib/messaging/email";
 *
 * setCustomEmailProvider({
 *   name: "custom",
 *   async send(data) {
 *     // Your implementation
 *     return { success: true, message: "Email sent" };
 *   },
 *   async sendBatch(emails) {
 *     // Optional batch implementation
 *     return { success: true, message: "Batch sent", results: [] };
 *   }
 * });
 * ```
 *
 * To remove this provider if not needed:
 * 1. Delete this file
 * 2. Update the registry to not include custom provider
 */

import type { EmailProvider } from '../types'

let customProvider: EmailProvider | null = null

/**
 * Set a custom email provider at runtime.
 * This allows you to inject any provider implementation.
 */
export function setCustomEmailProvider(provider: EmailProvider): void {
  customProvider = provider
}

/**
 * Get the currently registered custom provider.
 */
export function getCustomProvider(): EmailProvider | null {
  return customProvider
}

/**
 * Clear the custom email provider.
 */
export function clearCustomProvider(): void {
  customProvider = null
}

/**
 * Create the custom email provider.
 * Returns null if no custom provider has been set.
 */
export function createCustomProvider(): EmailProvider | null {
  return customProvider
}
