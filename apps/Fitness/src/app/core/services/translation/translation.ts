import {
    DOCUMENT,
    inject,
    Injectable,
    Renderer2,
    RendererFactory2,
    signal,
    effect,
    DestroyRef,
} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TranslateService} from "@ngx-translate/core";
import {Router, NavigationEnd} from "@angular/router";
import {firstValueFrom, filter} from "rxjs";
import {MessageService} from "primeng/api";

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

/**
 * Translation Service with Two-Way URL ↔ localStorage Sync
 *
 * Flow:
 * 1. Router is the source of truth
 * 2. URL change → updates localStorage and lang signal
 * 3. setLanguage() call → updates URL (which triggers #2)
 * 4. Page reload → reads from URL first, then localStorage as fallback
 *
 * No polling, no infinite loops, uses Angular signals and Router events.
 */
@Injectable({providedIn: "root"})
export class Translation {
    private readonly translate = inject(TranslateService);
    private readonly document = inject(DOCUMENT);
    private readonly rendererFactory = inject(RendererFactory2);
    private readonly platformService = inject(PlatFormService);
    private readonly translationManager = inject(TranslationManagerService);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly messageService = inject(MessageService);

    private readonly STORAGE_KEY = StorageKeys.LANGUAGE || "lang";
    private renderer!: Renderer2;
    private isInitializing = false;
    private isNavigating = false; // Prevent infinite loops

    /** Current language signal - reactive state */
    lang = signal<string>(DEFAULT_LANGUAGE);

    constructor() {
        this.renderer = this.rendererFactory.createRenderer(null, null);

        this.translate.addLangs([...SUPPORTED_LANGUAGES]);
        this.translate.setDefaultLang(DEFAULT_LANGUAGE);

        if (this.platformService.isBrowser()) {
            // Priority: URL > localStorage > default
            const urlLang = this.getLangFromUrl();
            const storedLang = localStorage.getItem(this.STORAGE_KEY);
            const initialLang = urlLang || storedLang || DEFAULT_LANGUAGE;

            this.lang.set(initialLang);
            this.translate.use(initialLang).subscribe();

            // Sync localStorage with URL lang if different
            if (urlLang && storedLang !== urlLang) {
                localStorage.setItem(this.STORAGE_KEY, urlLang);
            }

            // Setup router event listener for URL → localStorage sync
            this.setupRouterListener();
        } else {
            this.translate.use(DEFAULT_LANGUAGE).subscribe();
        }

        this.setupLangEffect();
    }

    /**
     * Listen to router navigation events to sync URL → localStorage
     */
    private setupRouterListener(): void {
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((event) => {
                if (this.isNavigating) return; // Skip if we triggered this navigation

                const urlLang = this.extractLangFromUrl(event.urlAfterRedirects || event.url);
                if (urlLang && ALL_LANGUAGES.includes(urlLang as Language)) {
                    const currentLang = this.lang();

                    if (urlLang !== currentLang) {
                        // URL changed externally (browser back/forward, manual URL change)
                        // Update localStorage and signal without triggering URL update
                        this.isNavigating = true;
                        localStorage.setItem(this.STORAGE_KEY, urlLang);
                        this.lang.set(urlLang);
                        this.isNavigating = false;
                    }
                }
            });
    }

    /**
     * Extract language from URL path
     */
    private extractLangFromUrl(url: string): string | null {
        const parts = url.split("/").filter(Boolean);
        const firstPart = parts[0]?.toLowerCase();

        if (firstPart && ALL_LANGUAGES.includes(firstPart as Language)) {
            return firstPart;
        }
        return null;
    }

    /**
     * Set language - updates URL which triggers localStorage sync
     */
    setLanguage(lang: string): void {
        if (this.lang() === lang) return;
        if (!ALL_LANGUAGES.includes(lang as Language)) return;

        this.lang.set(lang);
        // URL update will be handled by the effect
    }

    async initialize(preferredLang?: string): Promise<void> {
        this.isInitializing = true;
        try {
            const lang =
                preferredLang || this.getLangFromUrl() || this.getStoredLang() || DEFAULT_LANGUAGE;

            this.lang.set(lang);
            this.updateLanguageAttributes(lang);

            this.translate.use(lang).subscribe({
                next: () => {
                    /* Language set successfully */
                },
                error: () => {
                    /* Silently ignore - fallback will be used */
                },
            });

            this.loadTranslationsInBackground(lang).catch(() => {
                /* Silently fail */
            });
        } finally {
            this.isInitializing = false;
        }
    }

    private async loadTranslationsInBackground(lang: string): Promise<void> {
        try {
            await firstValueFrom(this.translationManager.loadCoreTranslations(lang));

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

            this.translate.use(lang).subscribe();
        } catch {
            // If loading fails, app still works with default/fallback translations
        }
    }

    /**
     * Update HTML attributes and localStorage for language
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

    private getUrlPath(): string {
        if (!this.platformService.isBrowser()) return "";
        const hash = window.location.hash;
        return hash ? hash.substring(1) : this.router.url || "";
    }

    private setupLangEffect(): void {
        let previousLang: string | null = null;
        let isInitialLoad = true;

        effect(() => {
            const currentLang = this.lang();

            if (this.isInitializing) return;

            if (isInitialLoad) {
                isInitialLoad = false;
                previousLang = currentLang;
                this.updateLanguageAttributes(currentLang);
                return;
            }

            if (previousLang !== null && previousLang !== currentLang) {
                // Update URL with new language (only if not already navigating)
                if (this.platformService.isBrowser() && !this.isNavigating) {
                    this.isNavigating = true;
                    this.updateUrlWithLanguage(currentLang);
                    // Reset flag after a short delay to allow navigation to complete
                    setTimeout(() => {
                        this.isNavigating = false;
                    }, 100);
                }

                this.translationManager.loadCoreTranslations(currentLang).subscribe({
                    next: () => {
                        const routePath = this.getBaseRoutePath();
                        const showToast = () => {
                            const langName = currentLang === "en" ? "English" : "العربية";
                            this.messageService.add({
                                severity: "success",
                                summary: this.translate.instant(
                                    "ACCOUNT.MESSAGES.LANGUAGE_CHANGED",
                                    {
                                        language: langName,
                                    }
                                ),
                                life: 2500,
                            });
                        };

                        if (routePath) {
                            this.translationManager
                                .preloadRouteTranslations(routePath, currentLang)
                                .subscribe({
                                    next: () => {
                                        if (previousLang) {
                                            this.translationManager.clearCache(previousLang);
                                        }
                                        this.translate.use(currentLang).subscribe({
                                            next: () => showToast(),
                                        });
                                    },
                                    error: () => {
                                        if (previousLang) {
                                            this.translationManager.clearCache(previousLang);
                                        }
                                        this.translate.use(currentLang).subscribe({
                                            next: () => showToast(),
                                        });
                                    },
                                });
                        } else {
                            if (previousLang) {
                                this.translationManager.clearCache(previousLang);
                            }
                            this.translate.use(currentLang).subscribe({
                                next: () => showToast(),
                            });
                        }
                    },
                    error: () => {
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

    private getUrlParts(): string[] {
        const url = this.getUrlPath();
        return url.split("/").filter(Boolean);
    }

    private getBaseRoutePath(): string | null {
        if (!this.platformService.isBrowser()) return null;

        const parts = this.getUrlParts();
        if (parts.length === 0) return null;

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

        const firstPart = parts[0]?.toLowerCase();
        if (firstPart && ALL_LANGUAGES.includes(firstPart as Language)) {
            return firstPart;
        }
        return null;
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

    private updateUrlWithLanguage(newLang: string): void {
        if (!this.platformService.isBrowser()) return;

        const parts = this.getUrlParts();
        const firstPart = parts[0]?.toLowerCase();
        const hasLangInUrl = ALL_LANGUAGES.includes(firstPart as Language);

        let newUrl: string;
        if (hasLangInUrl && parts.length > 1) {
            parts[0] = newLang.toLowerCase();
            newUrl = "/" + parts.join("/");
        } else if (hasLangInUrl && parts.length === 1) {
            newUrl = `/${newLang.toLowerCase()}`;
        } else if (parts.length > 0) {
            newUrl = `/${newLang.toLowerCase()}/${parts.join("/")}`;
        } else {
            newUrl = `/${newLang.toLowerCase()}`;
        }

        this.router
            .navigateByUrl(newUrl, {
                replaceUrl: true,
                skipLocationChange: false,
            })
            .catch((err) => {
                if (err?.name !== "AbortError" && err?.message !== "Transition was skipped") {
                    console.error("Error updating URL with language:", err);
                }
            });
    }
}
