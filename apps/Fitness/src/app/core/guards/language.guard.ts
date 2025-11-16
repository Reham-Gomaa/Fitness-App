import {inject} from "@angular/core";
import {CanActivateFn, Router, UrlTree} from "@angular/router";
import {Translation} from "../services/translation/translation";
import {DEFAULT_LANGUAGE, isSupportedLanguage} from "../constants/translation.constants";

export const languageGuard: CanActivateFn = (route): boolean | UrlTree => {
    const router = inject(Router);
    const translation = inject(Translation);

    const lang = (route.params["lang"] as string)?.toLowerCase();

    if (!lang || !isSupportedLanguage(lang)) {
        return router.createUrlTree([`/${DEFAULT_LANGUAGE}`]);
    }

    translation.setLanguage(lang);

    return true;
};
