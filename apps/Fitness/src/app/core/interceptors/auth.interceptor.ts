import {HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {StorageKeys} from "../constants/storage.config";
import {DEFAULT_LANGUAGE} from "../constants/translation.constants";

/**
 * HTTP Interceptor that adds authentication token and language headers to all requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem(StorageKeys.TOKEN) : null;

    // Get current language (ar or en)
    const lang =
        typeof window !== "undefined"
            ? localStorage.getItem(StorageKeys.LANGUAGE) || DEFAULT_LANGUAGE
            : DEFAULT_LANGUAGE;

    // Clone the request and add headers
    // Skip external APIs and i18n files
    if (req.url.includes("www.themealdb.com") == false && req.url.includes("/i18n/") == false) {
        const clonedRequest = req.clone({
            setHeaders: {
                ...(token && {token: token}),
                lang: lang,
            },
        });

        return next(clonedRequest);
    }
    return next(req);
};
