import {HttpInterceptorFn} from "@angular/common/http";
import {PlatFormService} from "@fitness-app/services";
import {inject} from "@angular/core";
import {StorageKeys} from "../constants/storage.config";

/**
 * @name headerInterceptor
 * @category Interceptors
 * @description
 * Interceptor responsible for automatically attaching apikey and subdomain headers to HTTP requests.
 *
 * ### Usage
 * Registered in app.config.ts:
 * ```ts
 * providers: [
 *   { provide: HTTP_INTERCEPTORS, useClass: headerInterceptor, multi: true }
 * ]
 * ```
 *
 * @since 1.0.0
 */

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platform = inject(PlatFormService);

    if (platform.isBrowser()) {
        const headers: {[key: string]: string} = {};

        const isLoginRequest = req.url.includes("/users/auth/login");

        if (!isLoginRequest) {
            const token = localStorage.getItem(StorageKeys.TOKEN);
            if (token && !req.headers.has("token")) {
                headers["token"] = token;
            }
        }

        if (window.location && window.location.hostname && !req.headers.has("subdomain")) {
            const hostname = window.location.hostname;
            const dotIndex = hostname.indexOf(".");

            let subdomain = "localhost";
            if (dotIndex > 0) {
                const extractedSubdomain = hostname.substring(0, dotIndex);
                if (extractedSubdomain) {
                    subdomain = extractedSubdomain;
                }
            } else if (dotIndex === -1 && hostname) {
                subdomain = hostname;
            }

            headers["subdomain"] = subdomain;
        }

        if (localStorage.getItem(StorageKeys.LANGUAGE)) {
            headers["accept-language"] = localStorage.getItem(StorageKeys.LANGUAGE) || "en";
        } else {
            headers["accept-language"] = "en";
        }

        if (Object.keys(headers).length > 0) {
            req = req.clone({
                setHeaders: headers,
            });
        }
    }
    return next(req);
};
