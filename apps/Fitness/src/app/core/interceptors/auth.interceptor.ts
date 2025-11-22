import {HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {StorageKeys} from "../constants/storage.config";
import {Translation} from "../services/translation/translation";

/**
 * HTTP Interceptor that adds authentication token and language headers to all requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const translation = inject(Translation);

    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem(StorageKeys.TOKEN) : null;

    // Get current language (ar or en)
    const lang = translation.lang();

    // Clone the request and add headers
    const clonedRequest = req.clone({
        setHeaders: {
            ...(token && {token: token}),
            lang: lang || "en",
        },
    });

    return next(clonedRequest);
};
