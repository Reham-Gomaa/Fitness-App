// import {inject} from "@angular/core";
// import {CanActivateFn, ActivatedRouteSnapshot} from "@angular/router";
// import {TranslationManagerService} from "../services/translation/translation-manager.service";
// import {Translation} from "../services/translation/translation";
// import {getModulesForRoute, TranslationModule} from "../constants/translation-modules";
// import {SUPPORTED_LANGUAGES} from "../constants/translation.constants";
// import {map} from "rxjs/operators";

// /**
//  * Translation Preload Guard
//  *
//  * Preloads translation modules for routes before navigation.
//  * Handles nested routes and parent-child relationships.
//  */
// export const translationPreloadGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
//     const translationManager = inject(TranslationManagerService);
//     const translation = inject(Translation);

//     const routePath = route.routeConfig?.path || "";
//     const lang = translation.getCurrentLang();

//     // Build full path by traversing up the route tree
//     const buildFullPath = (snapshot: ActivatedRouteSnapshot): string => {
//         const segments: string[] = [];
//         let current: ActivatedRouteSnapshot | null = snapshot;

//         while (current) {
//             const path = current.routeConfig?.path;
//             if (path && path !== "" && !segments.includes(path)) {
//                 segments.unshift(path);
//             }
//             current = current.parent;
//         }

//         const languageCodes = SUPPORTED_LANGUAGES.map((l) => l.toUpperCase());
//         const filtered = segments.filter((seg) => !languageCodes.includes(seg.toUpperCase()));

//         return filtered.length > 0 ? `/${filtered.join("/")}` : "";
//     };

//     const fullPath = buildFullPath(route);

//     // Use helper function to get modules for the route
//     // This handles direct matches and parent path fallbacks
//     let modules: TranslationModule[] = getModulesForRoute(fullPath);

//     // If no modules found via full path, try with just the route path
//     if (modules.length === 0 && routePath) {
//         modules = getModulesForRoute(`/${routePath}`);
//     }

//     // If still no modules, check parent route
//     if (modules.length === 0 && route.parent) {
//         const parentPath = route.parent.routeConfig?.path || "";
//         if (parentPath) {
//             modules = getModulesForRoute(`/${parentPath}`);
//         }
//     }

//     // If modules are already loaded, allow navigation immediately
//     // Note: areModulesLoaded checks globally, not per language
//     // We still need to check if translations exist for this language
//     if (modules.length > 0) {
//         // Check if modules are loaded (global check)
//         const areLoaded = translationManager.areModulesLoaded(modules);
//         if (areLoaded) {
//             return true;
//         }
//     }

//     // Load modules if needed
//     if (modules.length > 0) {
//         return translationManager.loadModules(modules, lang).pipe(map(() => true));
//     }

//     // No modules needed for this route, allow navigation
//     return true;
// };

import {inject} from "@angular/core";
import {CanActivateFn} from "@angular/router";
import {TranslationManagerService} from "../services/translation/translation-manager.service";
import {Translation} from "../services/translation/translation";
import {ROUTE_MODULE_MAP} from "../constants/translation-modules";
import {map} from "rxjs/operators";
import {CLIENT_ROUTES} from "../constants/client-routes";

export const translationPreloadGuard: CanActivateFn = (route) => {
    const translationManager = inject(TranslationManagerService);
    const translation = inject(Translation);

    const routePath = route.routeConfig?.path || "";
    const fullPath = `/${routePath}`;
    const lang = translation.getCurrentLang();

    // Check if this is a child route and find parent route path
    let modules = ROUTE_MODULE_MAP[fullPath] || [];

    // If no modules found for this path, check parent routes recursively
    if (modules.length === 0 && route.parent) {
        const parentPath = route.parent.routeConfig?.path || "";
        if (parentPath) {
            const parentFullPath = `/${parentPath}`;
            modules = ROUTE_MODULE_MAP[parentFullPath] || [];
        }
    }

    // Check for auth routes (login, reset-password, first-time-login, create-user, link-status)
    // Since auth.base is now empty, we need to check for specific auth route paths
    if (modules.length === 0) {
        const authRoutes = [CLIENT_ROUTES.auth.login];

        const isAuthRoute = authRoutes.some((authRoute) => {
            return routePath === authRoute || fullPath === `/${authRoute}`;
        });

        if (isAuthRoute) {
            // Get modules from ROUTE_MODULE_MAP using the route path
            modules = ROUTE_MODULE_MAP[fullPath] || ["auth"];
        }
    }

    // Also check for company base path if we're in company routes
    if (
        modules.length === 0 &&
        (fullPath.includes("main/home") || routePath.includes("main/home"))
    ) {
        modules = ROUTE_MODULE_MAP["/main/home"] || [];
    }

    // Also check for branches base path if we're in branches routes
    if (modules.length === 0 && (fullPath.includes("about") || routePath.includes("about"))) {
        modules = ROUTE_MODULE_MAP["/about"] || [];
    }

    // Also check for teams base path if we're in teams routes
    if (modules.length === 0 && (fullPath.includes("team") || routePath.includes("team"))) {
        modules = ROUTE_MODULE_MAP["/team"] || [];
    }

    // Also check for documents base path if we're in documents routes
    if (
        modules.length === 0 &&
        (fullPath.includes("documents") || routePath.includes("documents"))
    ) {
        modules = ROUTE_MODULE_MAP["/documents"] || [];
    }

    // Also check for document-categories base path if we're in document-categories routes
    if (
        modules.length === 0 &&
        (fullPath.includes("document-categories") || routePath.includes("document-categories"))
    ) {
        modules = ROUTE_MODULE_MAP["/document-categories"] || [];
    }

    if (translationManager.areModulesLoaded(modules)) {
        return true;
    }

    if (modules.length > 0) {
        return translationManager.loadModules(modules, lang).pipe(map(() => true));
    }

    return true;
};
