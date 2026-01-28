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

    if (translationManager.areModulesLoaded(modules, lang)) {
        return true;
    }

    if (modules.length > 0) {
        return translationManager.loadModules(modules, lang).pipe(map(() => true));
    }

    return true;
};
