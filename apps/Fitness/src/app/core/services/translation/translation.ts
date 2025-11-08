import {
  DOCUMENT,
  inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  signal,
  effect,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { StorageKeys } from '../../constants/storage.config';
import { TranslationManagerService } from './translation-manager.service';
import {
  Language,
  Direction,
  SUPPORTED_LANGUAGES,
  ALL_LANGUAGES,
  DEFAULT_LANGUAGE,
  getDirectionForLanguage,
  isRtlLanguage,
} from '../../constants/translation.constants';
import { PlatFormService } from '../platform/platform';

@Injectable({ providedIn: 'root' })
export class Translation {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly platformService = inject(PlatFormService);
  private readonly translationManager = inject(TranslationManagerService);
  private readonly router = inject(Router);

  private readonly STORAGE_KEY = StorageKeys.LANGUAGE || 'lang';
  private renderer!: Renderer2;
  private isInitializing = false;

  lang = signal<string>(DEFAULT_LANGUAGE);

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    this.translate.addLangs([...SUPPORTED_LANGUAGES]);
    this.translate.setDefaultLang(DEFAULT_LANGUAGE);

    if (this.platformService.isBrowser()) {
      const savedLang =
        localStorage.getItem(this.STORAGE_KEY) || DEFAULT_LANGUAGE;
      this.lang.set(savedLang);
    }

    this.setupLangEffect();
  }

  setLanguage(lang: string): void {
    if (this.lang() === lang) return;

    // Set language first
    this.lang.set(lang);

    // Update URL without page refresh (after signal update)
    if (this.platformService.isBrowser()) {
      // Use setTimeout to ensure signal update is processed
      setTimeout(() => {
        this.updateUrlWithLanguage(lang);
      }, 0);
    }
  }

  async initialize(preferredLang?: string): Promise<void> {
    this.isInitializing = true;
    try {
      const lang =
        preferredLang ||
        this.getLangFromUrl() ||
        this.getStoredLang() ||
        DEFAULT_LANGUAGE;

      this.lang.set(lang);

      // Don't navigate during initialization - let router handle it
      // The router will redirect to the default language route automatically

      if (this.platformService.isBrowser()) {
        localStorage.setItem(this.STORAGE_KEY, lang);
        const direction = getDirectionForLanguage(lang);
        const html = this.document.documentElement;
        this.renderer.setAttribute(html, 'lang', lang);
        this.renderer.setAttribute(html, 'dir', direction);
        if (direction === Direction.RIGHT_TO_LEFT) {
          this.renderer.addClass(this.document.body, 'rtl');
        } else {
          this.renderer.removeClass(this.document.body, 'rtl');
        }
      }

      await new Promise<void>((resolve) => {
        this.translationManager.loadCoreTranslations(lang).subscribe(() => {
          const routePath = this.getBaseRoutePath();
          if (routePath) {
            this.translationManager
              .preloadRouteTranslations(routePath, lang)
              .subscribe(() => {
                this.translate.use(lang);
                resolve();
              });
          } else {
            this.translate.use(lang);
            resolve();
          }
        });
      });
    } finally {
      this.isInitializing = false;
    }
  }

  private setupLangEffect(): void {
    let previousLang: string | null = null;
    let isInitialLoad = true;

    effect(() => {
      const currentLang = this.lang();

      if (isInitialLoad) {
        isInitialLoad = false;
        previousLang = currentLang;
        if (this.isInitializing) return;
        if (!this.platformService.isBrowser()) return;

        localStorage.setItem(this.STORAGE_KEY, currentLang);
        const html = this.document.documentElement;
        const direction = getDirectionForLanguage(currentLang);
        this.renderer.setAttribute(html, 'lang', currentLang);
        this.renderer.setAttribute(html, 'dir', direction);
        if (direction === Direction.RIGHT_TO_LEFT) {
          this.renderer.addClass(this.document.body, 'rtl');
        } else {
          this.renderer.removeClass(this.document.body, 'rtl');
        }
        return;
      }

      const finalizeUse = () => {
        this.translate.use(currentLang);
      };

      if (previousLang !== null && previousLang !== currentLang) {
        // Update URL with new language
        if (this.platformService.isBrowser()) {
          this.updateUrlWithLanguage(currentLang);
        }

        // Load new language translations first, then clear old cache
        this.translationManager.loadCoreTranslations(currentLang).subscribe({
          next: () => {
            const routePath = this.getBaseRoutePath();
            if (routePath) {
              this.translationManager
                .preloadRouteTranslations(routePath, currentLang)
                .subscribe({
                  next: () => {
                    // Clear old language cache after new one is loaded
                    if (previousLang) {
                      this.translationManager.clearCache(previousLang);
                    }
                    finalizeUse();
                  },
                  error: (err) => {
                    console.error('Error loading route translations:', err);
                    if (previousLang) {
                      this.translationManager.clearCache(previousLang);
                    }
                    finalizeUse();
                  },
                });
            } else {
              if (previousLang) {
                this.translationManager.clearCache(previousLang);
              }
              finalizeUse();
            }
          },
          error: (err) => {
            console.error('Error loading core translations:', err);
            if (previousLang) {
              this.translationManager.clearCache(previousLang);
            }
            finalizeUse();
          },
        });
      }

      previousLang = currentLang;

      if (!this.platformService.isBrowser()) return;

      localStorage.setItem(this.STORAGE_KEY, currentLang);

      const html = this.document.documentElement;
      const direction = getDirectionForLanguage(currentLang);

      this.renderer.setAttribute(html, 'lang', currentLang);
      this.renderer.setAttribute(html, 'dir', direction);

      if (direction === Direction.RIGHT_TO_LEFT) {
        this.renderer.addClass(this.document.body, 'rtl');
      } else {
        this.renderer.removeClass(this.document.body, 'rtl');
      }
    });
  }

  private getBaseRoutePath(): string | null {
    if (!this.platformService.isBrowser()) return null;
    const url = this.getUrlPath();
    const parts = url.split('/').filter(Boolean);
    if (parts.length === 0) return null;

    // First part might be language (uppercase), skip it
    const maybeLang = parts[0]?.toLowerCase();
    const baseIdx = ALL_LANGUAGES.includes(maybeLang as Language) ? 1 : 0;
    const base = parts[baseIdx];
    if (!base) return null;
    return `/${base}`;
  }

  private getStoredLang(): string | null {
    if (!this.platformService.isBrowser()) return null;
    return localStorage.getItem(this.STORAGE_KEY);
  }

  private getLangFromUrl(): string | null {
    if (!this.platformService.isBrowser()) return null;
    const url = this.getUrlPath();
    const parts = url.split('/').filter(Boolean);
    if (parts.length === 0) return null;

    // Language is in uppercase in URL (EN, AR, etc.)
    const maybeLang = parts[0]?.toLowerCase();
    return ALL_LANGUAGES.includes(maybeLang as Language) ? maybeLang : null;
  }

  /**
   * Get URL path (router.url doesn't include hash with hash location)
   * With withHashLocation(), router.url returns path without hash
   */
  private getUrlPath(): string {
    if (!this.platformService.isBrowser()) return '';
    // router.url returns path without hash when using withHashLocation()
    // e.g., router.url = "/main/home" but browser shows "#/main/home"
    return this.router.url || '';
  }

  /**
   * Update URL with new language without page refresh
   */
  private updateUrlWithLanguage(newLang: string): void {
    if (!this.platformService.isBrowser()) return;

    // Fix any URL that has path before hash (shouldn't happen but just in case)
    const currentBrowserUrl = window.location.href;
    if (
      currentBrowserUrl.includes('#') &&
      currentBrowserUrl.indexOf('#') > window.location.origin.length + 1
    ) {
      // URL has path before hash - fix it by extracting hash part
      const hashIndex = currentBrowserUrl.indexOf('#');
      const hashPart = currentBrowserUrl.substring(hashIndex);
      window.history.replaceState(null, '', hashPart);
    }

    const currentUrl = this.getUrlPath();
    const parts = currentUrl.split('/').filter(Boolean);

    // Check if first part is a language code
    const firstPart = parts[0]?.toLowerCase();
    const hasLangInUrl = ALL_LANGUAGES.includes(firstPart as Language);

    // Build new URL path (withHashLocation() will add # automatically)
    let newUrl: string;
    if (hasLangInUrl && parts.length > 1) {
      // Replace language in URL, keep rest of path
      parts[0] = newLang.toUpperCase();
      newUrl = '/' + parts.join('/');
    } else if (hasLangInUrl && parts.length === 1) {
      // Only language in URL, just replace it
      newUrl = `/${newLang.toUpperCase()}`;
    } else if (parts.length > 0) {
      // No language in URL, add it at the beginning
      newUrl = `/${newLang.toUpperCase()}/${parts.join('/')}`;
    } else {
      // Empty path, just add language
      newUrl = `/${newLang.toUpperCase()}`;
    }

    // Navigate - withHashLocation() automatically handles hash prefix
    // Use replaceUrl: true to replace current history entry
    this.router.navigateByUrl(newUrl, { replaceUrl: true }).catch((err) => {
      console.error('Error updating URL with language:', err);
    });
  }

  isRtl(lang?: string): boolean {
    const l = lang || this.lang();
    return isRtlLanguage(l);
  }

  getCurrentLang(): string {
    return this.lang();
  }

  currentDir(): Direction {
    return getDirectionForLanguage(this.lang());
  }
}
