/**
 * Language codes supported by the application
 */
export enum Language {
    ENGLISH = "en",
    ARABIC = "ar",
}

/**
 * Text direction for UI layout
 */
export enum Direction {
    LEFT_TO_RIGHT = "ltr",
    RIGHT_TO_LEFT = "rtl",
}

/**
 * Languages that read from right to left
 */
export const RTL_LANGUAGES: readonly Language[] = [Language.ARABIC] as const;

/**
 * Languages currently supported by the application
 */
export const SUPPORTED_LANGUAGES: readonly Language[] = [
    Language.ENGLISH,
    Language.ARABIC,
] as const;

/**
 * All languages that can be detected from URL
 */
export const ALL_LANGUAGES: readonly Language[] = [Language.ENGLISH, Language.ARABIC] as const;

/**
 * Default language for the application
 */
export const DEFAULT_LANGUAGE = Language.ENGLISH;

/**
 * Check if a language is RTL
 */
export function isRtlLanguage(lang: string): boolean {
    return RTL_LANGUAGES.includes(lang as Language);
}

/**
 * Get text direction for a given language
 */
export function getDirectionForLanguage(lang: string): Direction {
    return isRtlLanguage(lang) ? Direction.RIGHT_TO_LEFT : Direction.LEFT_TO_RIGHT;
}

/**
 * Check if a language is supported
 */
export function isSupportedLanguage(lang: string): boolean {
    return SUPPORTED_LANGUAGES.includes(lang as Language);
}

/**
 * Check if a language code is valid
 */
export function isValidLanguage(lang: string): boolean {
    return ALL_LANGUAGES.includes(lang as Language);
}
