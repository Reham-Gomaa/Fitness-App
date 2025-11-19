import {inject} from "@angular/core";
import {CanActivateFn, ActivatedRouteSnapshot} from "@angular/router";
import {TranslationManagerService} from "../services/translation/translation-manager.service";
import {Translation} from "../services/translation/translation";
import {getModulesForRoute, TranslationModule} from "../constants/translation-modules";
import {SUPPORTED_LANGUAGES} from "../constants/translation.constants";
import {map} from "rxjs/operators";

/**
 * Translation Preload Guard
 *
 * Preloads translation modules for routes before navigation.
 * Handles nested routes and parent-child relationships.
 */
export const translationPreloadGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const translationManager = inject(TranslationManagerService);
    const translation = inject(Translation);

    const routePath = route.routeConfig?.path || "";
    const lang = translation.getCurrentLang();

    // Build full path by traversing up the route tree
    const buildFullPath = (snapshot: ActivatedRouteSnapshot): string => {
        const segments: string[] = [];
        let current: ActivatedRouteSnapshot | null = snapshot;

        while (current) {
            const path = current.routeConfig?.path;
            if (path && path !== "" && !segments.includes(path)) {
                segments.unshift(path);
            }
            current = current.parent;
        }

        // Remove language prefix if present (e.g., 'EN', 'AR')
        const languageCodes = SUPPORTED_LANGUAGES.map((l) => l.toUpperCase());
        const filtered = segments.filter((seg) => !languageCodes.includes(seg.toUpperCase()));

        return filtered.length > 0 ? `/${filtered.join("/")}` : "";
    };

    const fullPath = buildFullPath(route);

    // Use helper function to get modules for the route
    // This handles direct matches and parent path fallbacks
    let modules: TranslationModule[] = getModulesForRoute(fullPath);

    // If no modules found via full path, try with just the route path
    if (modules.length === 0 && routePath) {
        modules = getModulesForRoute(`/${routePath}`);
    }

    // If still no modules, check parent route
    if (modules.length === 0 && route.parent) {
        const parentPath = route.parent.routeConfig?.path || "";
        if (parentPath) {
            modules = getModulesForRoute(`/${parentPath}`);
        }
    }

    // If modules are already loaded, allow navigation immediately
    // Note: areModulesLoaded checks globally, not per language
    // We still need to check if translations exist for this language
    if (modules.length > 0) {
        // Check if modules are loaded (global check)
        const areLoaded = translationManager.areModulesLoaded(modules);
        if (areLoaded) {
            return true;
        }
    }

    // Load modules if needed
    if (modules.length > 0) {
        return translationManager.loadModules(modules, lang).pipe(map(() => true));
    }

    // No modules needed for this route, allow navigation
    return true;
};
