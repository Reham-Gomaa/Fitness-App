import { InjectionToken, Provider } from '@angular/core';
import { ApiConfig } from '../interface/api-config.interface';

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');

/**
 * Provides API configuration for AuthApiKpService
 *
 * @param config - API configuration object
 * @returns Provider for API_CONFIG token
 *
 * @example
 * ```typescript
 * // In app.config.ts (Angular 15+)
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideAuthApiConfig({
 *       baseUrl: 'https://api.example.com',
 *       apiVersion: 'v1',
 *       endpoints: { ... }
 *     })
 *   ]
 * };
 *
 * // In app.module.ts (Angular 12-14)
 * providers: [
 *   provideAuthApiConfig({
 *     baseUrl: 'https://api.example.com',
 *     apiVersion: 'v1',
 *     endpoints: { ... }
 *   })
 * ]
 * ```
 */
export function provideAuthApiConfig(config: ApiConfig): Provider {
  return {
    provide: API_CONFIG,
    useValue: config,
  };
}
