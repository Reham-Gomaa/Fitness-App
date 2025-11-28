import {Injectable, inject} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

/**
 * Route Builder Service
 * Provides convenient methods to build language-aware route paths
 *
 * Usage in components:
 *   routeBuilder = inject(RouteBuilderService);
 *   [routerLink]="routeBuilder.build(ROUTES.auth.base, ROUTES.auth.login)"
 */
@Injectable({providedIn: "root"})
export class RouteBuilderService {
    private readonly translate = inject(TranslateService);

    /**
     * Get current language code (lowercase: en, ar)
     */
    get currentLang(): string {
        return this.translate.getCurrentLang().toLowerCase();
    }

    /**
     * Build route array with automatic language prefix
     * @param segments - Route segments to combine
     * @returns Array ready for [routerLink]
     *
     * Example:
     *   build(ROUTES.auth.base, ROUTES.auth.login)
     *   Returns: ['/', 'en', 'auth', 'login']
     */
    build(...segments: string[]): string[] {
        return ["/", this.currentLang, ...segments];
    }

    /**
     * Build route array for routerLink binding (alias for build())
     * @param segments - Route segments to combine
     * @returns Array ready for [routerLink]
     *
     * Example:
     *   buildPath(ROUTES.auth.base, ROUTES.auth.login)
     *   Returns: ['/', 'en', 'auth', 'login']
     */
    buildPath(...segments: string[]): string[] {
        return this.build(...segments);
    }
}
