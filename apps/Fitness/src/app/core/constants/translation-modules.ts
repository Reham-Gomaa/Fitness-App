/**
 * Translation Modules Configuration
 *
 * Defines all translation modules used in the application.
 * Modules are organized into core (always loaded) and feature (lazy loaded) modules.
 */

/**
 * Core translation modules that are always loaded on app initialization.
 * These contain translations for shared components and layouts used across the app.
 */
export const CORE_TRANSLATION_MODULES = ["shared", "layouts"] as const;

/**
 * Feature translation modules that are loaded on-demand based on routes.
 * These contain translations specific to certain features/pages.
 */
export const FEATURE_TRANSLATION_MODULES = ["auth", "home"] as const;

/**
 * All available translation modules in the application.
 */
export const TRANSLATION_MODULES = [
    ...CORE_TRANSLATION_MODULES,
    ...FEATURE_TRANSLATION_MODULES,
] as const;

/**
 * Type definitions for translation modules
 */
export type CoreTranslationModule = (typeof CORE_TRANSLATION_MODULES)[number];
export type FeatureTranslationModule = (typeof FEATURE_TRANSLATION_MODULES)[number];
export type TranslationModule = (typeof TRANSLATION_MODULES)[number];

/**
 * Route to Translation Module Mapping
 *
 * Maps route paths to their required translation modules.
 * When a route is accessed, the corresponding modules are preloaded.
 *
 * Key: Route path (must start with '/')
 * Value: Array of translation modules required for that route
 *
 * @example
 * "/auth" -> ["auth"] // Auth routes need auth translations
 * "/home" -> ["home"] // Home page needs home translations
 * "/main" -> ["home"] // Main layout includes home page
 */
export const ROUTE_MODULE_MAP: Record<string, TranslationModule[]> = {
    // Auth routes
    "/auth": ["auth"],
    "/auth/login": ["auth"],
    "/auth/register": ["auth"],
    "/auth/forgetpass": ["auth"],

    // Home routes
    "/home": ["home"],
    "/main": ["home"],
    "/main/home": ["home"],
} as const;

/**
 * Helper function to get translation modules for a route path
 *
 * @param routePath - The route path (e.g., "/auth/login")
 * @returns Array of translation modules required for the route, or empty array if none
 *
 * @example
 * getModulesForRoute("/auth/login") // Returns ["auth"]
 * getModulesForRoute("/main/home") // Returns ["home"]
 * getModulesForRoute("/unknown") // Returns []
 */
export function getModulesForRoute(routePath: string): TranslationModule[] {
    // Normalize path (ensure it starts with '/')
    const normalizedPath = routePath.startsWith("/") ? routePath : `/${routePath}`;

    // Direct match
    if (ROUTE_MODULE_MAP[normalizedPath]) {
        return ROUTE_MODULE_MAP[normalizedPath];
    }

    // Try parent paths (e.g., "/auth/login" -> "/auth")
    const segments = normalizedPath.split("/").filter(Boolean);
    for (let i = segments.length; i > 0; i--) {
        const parentPath = `/${segments.slice(0, i).join("/")}`;
        if (ROUTE_MODULE_MAP[parentPath]) {
            return ROUTE_MODULE_MAP[parentPath];
        }
    }

    return [];
}

/**
 * Helper function to check if a route requires specific translation modules
 *
 * @param routePath - The route path to check
 * @param modules - The modules to check for
 * @returns True if the route requires any of the specified modules
 *
 * @example
 * routeRequiresModules("/auth/login", ["auth"]) // Returns true
 * routeRequiresModules("/home", ["auth"]) // Returns false
 */
export function routeRequiresModules(routePath: string, modules: TranslationModule[]): boolean {
    const routeModules = getModulesForRoute(routePath);
    return modules.some((module) => routeModules.includes(module));
}

/**
 * Get all routes that require a specific translation module
 *
 * @param module - The translation module to find routes for
 * @returns Array of route paths that require this module
 *
 * @example
 * getRoutesForModule("auth") // Returns ["/auth", "/auth/login", ...]
 */
export function getRoutesForModule(module: TranslationModule): string[] {
    return Object.keys(ROUTE_MODULE_MAP).filter((route) =>
        ROUTE_MODULE_MAP[route].includes(module)
    );
}
