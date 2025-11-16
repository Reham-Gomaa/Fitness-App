import {APP_INITIALIZER, inject} from "@angular/core";
import {Translation} from "../services/translation/translation";

/**
 * Translation Initializer
 *
 * Initializes translations without blocking app startup.
 * The initialize() method now loads translations in background,
 * allowing the app to render immediately.
 */
export function initializeTranslations(): () => Promise<void> {
    return async () => {
        const translation = inject(Translation);
        // Initialize is now non-blocking - it sets language immediately
        // and loads translations in background
        await translation.initialize();
    };
}

export const TRANSLATION_INITIALIZER = {
    provide: APP_INITIALIZER,
    useFactory: initializeTranslations,
    multi: true,
};
