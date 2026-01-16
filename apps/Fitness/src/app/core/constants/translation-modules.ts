export const CORE_TRANSLATION_MODULES = ["shared", "layouts", "bot"] as const;

export const FEATURE_TRANSLATION_MODULES = [
    "auth",
    "home",
    "about",
    "classes",
    "meals",
    "account",
    "bot",
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
    "/home": ["home", "about", "classes", "meals", "layouts"],
    "/about": ["about", "layouts"],
    "/classes": ["classes", "layouts"],
    "/meals": ["meals", "layouts"],
    "/account": ["account", "layouts"],
    "/bot": ["bot"],
};
