/**
 * Kaalika Environment & Public URL Configuration
 * Ensures 100% production-safe URL resolution with zero localhost dependencies.
 */

export const config = {
  /**
   * The public application base URL.
   * In production, defaults to NEXT_PUBLIC_APP_URL.
   * In browser context, falls back to window.location.origin.
   */
  getAppUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
    }
    if (typeof window !== 'undefined' && window.location.origin) {
      return window.location.origin;
    }
    return '';
  },

  /**
   * Constructs an absolute or relative endpoint for API requests.
   * In browser client code, relative URLs ('/api/...') are preferred for same-origin safety.
   */
  getApiUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    // If running in browser or relative fetch is supported, relative is safest
    if (typeof window !== 'undefined') {
      return cleanPath;
    }
    // Server-side fetch needs base URL
    const baseUrl = this.getAppUrl();
    return baseUrl ? `${baseUrl}${cleanPath}` : cleanPath;
  },

  isProduction: process.env.NODE_ENV === 'production',
  authSecret: process.env.AUTH_SECRET || 'kaalika_default_vault_secret_key_108',
};
