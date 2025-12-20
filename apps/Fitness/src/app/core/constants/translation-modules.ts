export const CORE_TRANSLATION_MODULES = ["shared", "layouts"] as const;

export const FEATURE_TRANSLATION_MODULES = [
    "auth",
    "home",
    "about",
    "classes",
    "meals",
    "account",
] as const;

export const TRANSLATION_MODULES = [
    ...CORE_TRANSLATION_MODULES,
    ...FEATURE_TRANSLATION_MODULES,
] as const;

export type CoreTranslationModule = (typeof CORE_TRANSLATION_MODULES)[number];
export type FeatureTranslationModule = (typeof FEATURE_TRANSLATION_MODULES)[number];
export type TranslationModule = (typeof TRANSLATION_MODULES)[number];

export const ROUTE_MODULE_MAP: Record<string, TranslationModule[]> = {
    "/auth": ["auth"],
    "/home": ["home", "about", "classes", "meals"],
    "/about": ["about"],
    "/classes": ["classes"],
    "/meals": ["meals"],
    "/account": ["account"],
};
