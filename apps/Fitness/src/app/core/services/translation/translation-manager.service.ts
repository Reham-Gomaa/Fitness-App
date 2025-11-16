import {Injectable, inject, signal, Injector} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Observable, forkJoin, of} from "rxjs";
import {map, catchError, shareReplay, tap} from "rxjs/operators";
import {isPlatformBrowser} from "@angular/common";
import {PLATFORM_ID} from "@angular/core";
import {
    CORE_TRANSLATION_MODULES,
    TranslationModule,
    getModulesForRoute,
} from "../../constants/translation-modules";

@Injectable({providedIn: "root"})
export class TranslationManagerService {
    private readonly http = inject(HttpClient);
    private readonly injector = inject(Injector);
    private readonly platformId = inject(PLATFORM_ID);

    private translateService: TranslateService | null = null;
    private readonly translationCache = new Map<string, Map<TranslationModule, any>>();
    private readonly loadingMap = new Map<string, Observable<any>>();
    private readonly loadedModules = signal<Set<TranslationModule>>(new Set());

    private getTranslateService(): TranslateService {
        if (!this.translateService) {
            this.translateService = this.injector.get(TranslateService);
        }
        return this.translateService;
    }

    private getBaseUrl(): string {
        // Translation files are in public/i18n, which are served from root
        if (isPlatformBrowser(this.platformId)) {
            return `${window.location.origin}/i18n`;
        }
        return `/i18n`;
    }

    private deepMerge(target: any, source: any): any {
        const output = {...target};
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach((key) => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, {[key]: source[key]});
                    } else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, {[key]: source[key]});
                }
            });
        }
        return output;
    }

    private isObject(item: any): boolean {
        return item && typeof item === "object" && !Array.isArray(item);
    }

    private loadModule(module: TranslationModule, lang: string): Observable<any> {
        const cacheKey = `${lang}:${module}`;
        const cached = this.translationCache.get(lang)?.get(module);

        // Return cached immediately (synchronous)
        if (cached) {
            return of(cached);
        }

        // Return existing loading request to avoid duplicate HTTP calls
        const existingLoading = this.loadingMap.get(cacheKey);
        if (existingLoading) {
            return existingLoading;
        }

        const url = `${this.getBaseUrl()}/${module}/${lang}.json`;
        const request = this.http.get<any>(url).pipe(
            catchError((error) => {
                // Only log warning in development, not in production
                if (!error.status || error.status !== 404) {
                    console.warn(`Translation file not found: ${module}/${lang}.json`, error);
                }
                return of({});
            }),
            tap((translations) => {
                // Cache translations immediately when loaded
                if (!this.translationCache.has(lang)) {
                    this.translationCache.set(lang, new Map());
                }
                this.translationCache.get(lang)!.set(module, translations);

                // Update loaded modules signal
                const currentLoaded = new Set(this.loadedModules());
                currentLoaded.add(module);
                this.loadedModules.set(currentLoaded);

                // Remove from loading map
                this.loadingMap.delete(cacheKey);
            }),
            shareReplay(1) // Share the request to avoid duplicate HTTP calls
        );

        this.loadingMap.set(cacheKey, request);
        return request;
    }

    loadCoreTranslations(lang: string): Observable<any> {
        // Check if all core modules are cached for this specific language
        const langCache = this.translationCache.get(lang);
        const allCoreLoaded =
            langCache && CORE_TRANSLATION_MODULES.every((module) => langCache.has(module));

        if (allCoreLoaded) {
            let cachedTranslations: any = {};
            CORE_TRANSLATION_MODULES.forEach((module) => {
                const cached = langCache!.get(module);
                if (cached) {
                    cachedTranslations = this.deepMerge(cachedTranslations, cached);
                }
            });
            // CRITICAL: Ensure cached translations are set in TranslateService
            // This prevents showing keys on refresh when translations are cached
            this.getTranslateService().setTranslation(lang, cachedTranslations, false);
            return of(cachedTranslations);
        }

        const requests = CORE_TRANSLATION_MODULES.map((module) => this.loadModule(module, lang));

        return forkJoin(requests).pipe(
            map((translations) => {
                let merged = {};
                translations.forEach((moduleTranslations) => {
                    merged = this.deepMerge(merged, moduleTranslations);
                });
                return merged;
            }),
            tap((merged) => {
                this.getTranslateService().setTranslation(lang, merged, false);
            })
        );
    }

    loadModules(modules: TranslationModule[], lang: string): Observable<any> {
        if (modules.length === 0) {
            return of({});
        }

        // Check which modules need to be loaded for this specific language
        const langCache = this.translationCache.get(lang);
        const modulesToLoad = modules.filter((module) => !langCache?.has(module));

        if (modulesToLoad.length === 0) {
            // All modules already cached for this language, merge and return
            let cachedTranslations: any = {};
            modules.forEach((module) => {
                const cached = langCache!.get(module);
                if (cached) {
                    cachedTranslations = this.deepMerge(cachedTranslations, cached);
                }
            });
            // Ensure translations are set in TranslateService
            this.getTranslateService().setTranslation(lang, cachedTranslations, true);
            return of(cachedTranslations);
        }

        const requests = modulesToLoad.map((module) => this.loadModule(module, lang));

        return forkJoin(requests).pipe(
            map((translations) => {
                let merged = {};
                translations.forEach((moduleTranslations) => {
                    merged = this.deepMerge(merged, moduleTranslations);
                });
                // Merge with already cached modules
                modules.forEach((module) => {
                    const cached = langCache?.get(module);
                    if (cached) {
                        merged = this.deepMerge(merged, cached);
                    }
                });
                return merged;
            }),
            tap((merged) => {
                this.getTranslateService().setTranslation(lang, merged, true);
            })
        );
    }

    preloadRouteTranslations(routePath: string, lang: string): Observable<any> {
        // Use helper function to get modules for the route
        const modules = getModulesForRoute(routePath);
        if (modules.length === 0) {
            return of({});
        }
        return this.loadModules(modules, lang);
    }

    /**
     * Check if modules are loaded (global check across all languages)
     * For per-language check, use the cache directly
     */
    areModulesLoaded(modules: TranslationModule[]): boolean {
        if (modules.length === 0) return true;
        const loadedSet = this.loadedModules();
        return modules.every((module) => loadedSet.has(module));
    }

    /**
     * Check if modules are loaded for a specific language
     */
    areModulesLoadedForLanguage(modules: TranslationModule[], lang: string): boolean {
        if (modules.length === 0) return true;
        const langCache = this.translationCache.get(lang);
        if (!langCache) return false;
        return modules.every((module) => langCache.has(module));
    }

    clearCache(lang?: string): void {
        if (lang) {
            // Clear cache for specific language only
            this.translationCache.delete(lang);
            // Clear loading states for this language
            const keysToDelete: string[] = [];
            this.loadingMap.forEach((_, key) => {
                if (key.startsWith(`${lang}:`)) {
                    keysToDelete.push(key);
                }
            });
            keysToDelete.forEach((key) => this.loadingMap.delete(key));
        } else {
            // Clear all caches
            this.translationCache.clear();
            this.loadingMap.clear();
            this.loadedModules.set(new Set());
        }
    }

    getLoadedModules(): Set<TranslationModule> {
        return this.loadedModules();
    }
}
