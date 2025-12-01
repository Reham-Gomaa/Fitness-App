import {
    DOCUMENT,
    inject,
    Injectable,
    Renderer2,
    RendererFactory2,
    signal,
    effect,
} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {firstValueFrom} from "rxjs";

import {StorageKeys} from "../../constants/storage.config";
import {TranslationManagerService} from "./translation-manager.service";
import {
    Language,
    Direction,
    SUPPORTED_LANGUAGES,
    ALL_LANGUAGES,
    DEFAULT_LANGUAGE,
    getDirectionForLanguage,
    isRtlLanguage,
} from "../../constants/translation.constants";
import {PlatFormService} from "@fitness-app/services";

@Injectable({providedIn: "root"})
export class Translation {
    private readonly translate = inject(TranslateService);
    private readonly document = inject(DOCUMENT);
    private readonly rendererFactory = inject(RendererFactory2);
    private readonly platformService = inject(PlatFormService);
    private readonly translationManager = inject(TranslationManagerService);
    private readonly router = inject(Router);

    private readonly STORAGE_KEY = StorageKeys.LANGUAGE || "lang";
    private renderer!: Renderer2;
    private isInitializing = false;

    lang = signal<string>(DEFAULT_LANGUAGE);

    constructor() {
        this.renderer = this.rendererFactory.createRenderer(null, null);

        this.translate.addLangs([...SUPPORTED_LANGUAGES]);
        this.translate.setDefaultLang(DEFAULT_LANGUAGE);

        if (this.platformService.isBrowser()) {
            const savedLang = localStorage.getItem(this.STORAGE_KEY) || DEFAULT_LANGUAGE;
            this.lang.set(savedLang);
            // Set language immediately to prevent lag - translations will load in background
            this.translate.use(savedLang).subscribe();
        } else {
            // Server-side: use default language
            this.translate.use(DEFAULT_LANGUAGE).subscribe();
        }

        this.setupLangEffect();
    }

    setLanguage(lang: string): void {
        if (this.lang() === lang) return;
        this.lang.set(lang);
        // URL update will be handled by the effect
    }

    async initialize(preferredLang?: string): Promise<void> {
        this.isInitializing = true;
        try {
            const lang =
                preferredLang || this.getLangFromUrl() || this.getStoredLang() || DEFAULT_LANGUAGE;

            // Set language signal immediately (non-blocking)
            this.lang.set(lang);

            // Update HTML attributes immediately (non-blocking)
            this.updateLanguageAttributes(lang);

            // Use language immediately without waiting - this allows app to render instantly
            // translate.use() will use default/fallback translations if not loaded yet
            // We don't await this - it's fire-and-forget to prevent blocking
            this.translate.use(lang).subscribe({
                next: () => {
                    // Language set successfully
                },
                error: () => {
                    // Ignore errors - app will use fallback
                },
            });

            // Load translations in background (completely non-blocking)
            // This doesn't block app initialization, translations will update when ready
            // Fire and forget - don't await to prevent blocking
            this.loadTranslationsInBackground(lang).catch(() => {
                // Silently fail - app should still work with default translations
            });
        } finally {
            // Mark initialization as complete immediately (non-blocking)
            // This allows the app to render while translations load in background
            this.isInitializing = false;
        }
    }

    /**
     * Load translations in background without blocking app initialization
     * This allows the app to render immediately while translations load
     */
    private async loadTranslationsInBackground(lang: string): Promise<void> {
        try {
            // Load core translations
            await firstValueFrom(this.translationManager.loadCoreTranslations(lang));

            // Load route translations if needed
            const routePath = this.getBaseRoutePath();
            if (routePath) {
                try {
                    await firstValueFrom(
                        this.translationManager.preloadRouteTranslations(routePath, lang)
                    );
                } catch {
                    // Route translations are optional
                }
            }

            // Update language again to ensure all translations are applied
            // This will trigger a re-render with full translations
            this.translate.use(lang).subscribe();
        } catch {
            // If loading fails, app still works with default/fallback translations
        }
    }

    /**
     * Update HTML attributes and localStorage for language
     * Extracted to avoid duplication
     */
    private updateLanguageAttributes(lang: string): void {
        if (!this.platformService.isBrowser()) return;

        localStorage.setItem(this.STORAGE_KEY, lang);
        const html = this.document.documentElement;
        const direction = getDirectionForLanguage(lang);

        this.renderer.setAttribute(html, "lang", lang);
        this.renderer.setAttribute(html, "dir", direction);

        if (direction === Direction.RIGHT_TO_LEFT) {
            this.renderer.addClass(this.document.body, "rtl");
        } else {
            this.renderer.removeClass(this.document.body, "rtl");
        }
    }

    /**
     * Get URL path from hash or router
     * Extracted to avoid duplication
     */
    private getUrlPath(): string {
        if (!this.platformService.isBrowser()) return "";
        // With hash routing, check window.location.hash for the actual URL
        const hash = window.location.hash;
        return hash ? hash.substring(1) : this.router.url || "";
    }

    private setupLangEffect(): void {
        let previousLang: string | null = null;
        let isInitialLoad = true;

        effect(() => {
            const currentLang = this.lang();

            // Skip during initialization
            if (this.isInitializing) return;

            // Handle initial load
            if (isInitialLoad) {
                isInitialLoad = false;
                previousLang = currentLang;
                this.updateLanguageAttributes(currentLang);
                return;
            }

            // Handle language change
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
                                        this.translate.use(currentLang).subscribe();
                                    },
                                    error: () => {
                                        // Even if route translations fail, use core translations
                                        if (previousLang) {
                                            this.translationManager.clearCache(previousLang);
                                        }
                                        this.translate.use(currentLang).subscribe();
                                    },
                                });
                        } else {
                            if (previousLang) {
                                this.translationManager.clearCache(previousLang);
                            }
                            this.translate.use(currentLang).subscribe();
                        }
                    },
                    error: () => {
                        // Fallback: use language even if translations fail
                        if (previousLang) {
                            this.translationManager.clearCache(previousLang);
                        }
                        this.translate.use(currentLang).subscribe();
                    },
                });
            }

            previousLang = currentLang;
            this.updateLanguageAttributes(currentLang);
        });
    }

    /**
     * Parse URL parts from current URL
     * Cached to avoid repeated parsing
     */
    private getUrlParts(): string[] {
        const url = this.getUrlPath();
        return url.split("/").filter(Boolean);
    }

    private getBaseRoutePath(): string | null {
        if (!this.platformService.isBrowser()) return null;

        const parts = this.getUrlParts();
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

        const parts = this.getUrlParts();
        if (parts.length === 0) return null;
        return parts[0] || null;
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

    /**
     * Update URL with new language without page refresh
     * Works with hash location strategy
     */
    private updateUrlWithLanguage(newLang: string): void {
        if (!this.platformService.isBrowser()) return;

        const parts = this.getUrlParts();
        const firstPart = parts[0]?.toLowerCase();
        const hasLangInUrl = ALL_LANGUAGES.includes(firstPart as Language);

        // Build new URL path
        let newUrl: string;
        if (hasLangInUrl && parts.length > 1) {
            // Replace language in URL, keep rest of path
            parts[0] = newLang.toLowerCase();
            newUrl = "/" + parts.join("/");
        } else if (hasLangInUrl && parts.length === 1) {
            // Only language in URL, just replace it
            newUrl = `/${newLang.toLowerCase()}`;
        } else if (parts.length > 0) {
            // No language in URL, add it at the beginning
            newUrl = `/${newLang.toLowerCase()}/${parts.join("/")}`;
        } else {
            // Empty path, just add language
            newUrl = `/${newLang.toLowerCase()}`;
        }

        // Navigate with hash location strategy
        this.router
            .navigateByUrl(newUrl, {
                replaceUrl: true,
                skipLocationChange: false,
            })
            .catch((err) => {
                // Silently ignore AbortError from view transitions
                if (err?.name !== "AbortError" && err?.message !== "Transition was skipped") {
                    console.error("Error updating URL with language:", err);
                }
            });
    }
}
