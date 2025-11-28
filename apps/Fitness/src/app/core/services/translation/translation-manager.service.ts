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
    ROUTE_MODULE_MAP,
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

        if (cached) {
            return of(cached);
        }

        const existingLoading = this.loadingMap.get(cacheKey);
        if (existingLoading) {
            return existingLoading;
        }

        const url = `${this.getBaseUrl()}/${module}/${lang}.json`;
        const request = this.http.get<any>(url).pipe(
            catchError((error) => {
                console.warn(`Translation file not found: ${module}/${lang}.json`, error);
                return of({});
            }),
            tap((translations) => {
                if (!this.translationCache.has(lang)) {
                    this.translationCache.set(lang, new Map());
                }
                this.translationCache.get(lang)!.set(module, translations);

                const currentLoaded = new Set(this.loadedModules());
                currentLoaded.add(module);
                this.loadedModules.set(currentLoaded);

                this.loadingMap.delete(cacheKey);
            }),
            shareReplay(1)
        );

        this.loadingMap.set(cacheKey, request);
        return request;
    }

    loadCoreTranslations(lang: string): Observable<any> {
        const loadedSet = this.loadedModules();
        const allCoreLoaded = CORE_TRANSLATION_MODULES.every((module) => loadedSet.has(module));

        if (allCoreLoaded) {
            let cachedTranslations: any = {};
            CORE_TRANSLATION_MODULES.forEach((module) => {
                const cached = this.translationCache.get(lang)?.get(module);
                if (cached) {
                    cachedTranslations = this.deepMerge(cachedTranslations, cached);
                }
            });
            // IMPORTANT: Set cached translations so translate.use() can find them
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
        const loadedSet = this.loadedModules();
        const modulesToLoad = modules.filter((module) => !loadedSet.has(module));

        if (modulesToLoad.length === 0) {
            return of({});
        }

        const requests = modulesToLoad.map((module) => this.loadModule(module, lang));

        return forkJoin(requests).pipe(
            map((translations) => {
                let merged = {};
                translations.forEach((moduleTranslations) => {
                    merged = this.deepMerge(merged, moduleTranslations);
                });
                return merged;
            }),
            tap((merged) => {
                this.getTranslateService().setTranslation(lang, merged, true);
            })
        );
    }

    preloadRouteTranslations(routePath: string, lang: string): Observable<any> {
        const modules = ROUTE_MODULE_MAP[routePath] || [];
        if (modules.length === 0) {
            return of({});
        }
        return this.loadModules(modules, lang);
    }

    areModulesLoaded(modules: TranslationModule[]): boolean {
        const loadedSet = this.loadedModules();
        return modules.every((module) => loadedSet.has(module));
    }

    clearCache(lang?: string): void {
        if (lang) {
            this.translationCache.delete(lang);
        } else {
            this.translationCache.clear();
        }
        this.loadedModules.set(new Set());
        this.loadingMap.clear();
    }

    getLoadedModules(): Set<TranslationModule> {
        return this.loadedModules();
    }
}
