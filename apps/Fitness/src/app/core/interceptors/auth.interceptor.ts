import { HttpInterceptorFn } from "@angular/common/http";
import { PlatFormService } from "@fitness-app/services";
import { inject } from "@angular/core";
import { StorageKeys } from "../constants/storage.config";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Skip MealDB requests completely (from second interceptor)
    if (req.url.includes("www.themealdb.com")) {
        return next(req);
    }

    const platform = inject(PlatFormService);
    
    if (platform.isBrowser()) {
        const headers: { [key: string]: string } = {};
        
        const isLoginRequest = req.url.includes("/users/auth/login");

        // Token logic from first interceptor
        if (!isLoginRequest) {
            const token = localStorage.getItem(StorageKeys.TOKEN);
            if (token && !req.headers.has("token")) {
                headers["token"] = token;
            }
        }

        // Bearer token logic from second interceptor
        const bearerToken = localStorage.getItem(StorageKeys.TOKEN);
        if (bearerToken && !req.headers.has("Authorization")) {
            headers["Authorization"] = `Bearer ${bearerToken}`;
        }

        // Subdomain logic from first interceptor
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

        // Language logic - merged from both interceptors
        // Priority: first interceptor's "accept-language" > second interceptor's "lang"
        if (!req.headers.has("accept-language")) {
            headers["accept-language"] = localStorage.getItem(StorageKeys.LANGUAGE) || "en";
        }
        
        // Add lang header from second interceptor
        if (!req.headers.has("lang")) {
            headers["lang"] = localStorage.getItem(StorageKeys.LANGUAGE) || "en";
        }

        if (Object.keys(headers).length > 0) {
            req = req.clone({
                setHeaders: headers,
            });
        }
    }
    
    return next(req);
};