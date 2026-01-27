import {Injectable, inject} from "@angular/core";
import {Meta, Title} from "@angular/platform-browser";
import {DOCUMENT} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

export interface SeoConfig {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    type?: "website" | "article";
    twitterCard?: "summary" | "summary_large_image";
}

@Injectable({
    providedIn: "root",
})
export class SeoService {
    private meta = inject(Meta);
    private title = inject(Title);
    private document = inject(DOCUMENT);
    private translate = inject(TranslateService);
    private router = inject(Router);

    private readonly defaultImage = "/assets/images/og-image.png";
    private readonly siteName = "FitZone";
    private readonly twitterHandle = "@fitzone";

    /**
     * Update all SEO meta tags with i18n support
     */
    update(title: string, description: string, config?: Partial<SeoConfig>): void {
        const fullTitle = title.includes(this.siteName) ? title : `${title} | ${this.siteName}`;

        // Set page title
        this.title.setTitle(fullTitle);

        // Description meta
        this.meta.updateTag({name: "description", content: description});

        // Keywords (if provided)
        if (config?.keywords) {
            this.meta.updateTag({name: "keywords", content: config.keywords});
        }

        // Open Graph tags (Facebook, LinkedIn)
        this.meta.updateTag({property: "og:title", content: fullTitle});
        this.meta.updateTag({property: "og:description", content: description});
        this.meta.updateTag({property: "og:type", content: config?.type || "website"});
        this.meta.updateTag({property: "og:site_name", content: this.siteName});
        this.meta.updateTag({property: "og:image", content: config?.image || this.defaultImage});
        this.meta.updateTag({property: "og:url", content: this.getCanonicalUrl()});
        this.meta.updateTag({property: "og:locale", content: this.getCurrentLocale()});

        // Twitter Card tags
        this.meta.updateTag({
            name: "twitter:card",
            content: config?.twitterCard || "summary_large_image",
        });
        this.meta.updateTag({name: "twitter:site", content: this.twitterHandle});
        this.meta.updateTag({name: "twitter:title", content: fullTitle});
        this.meta.updateTag({name: "twitter:description", content: description});
        this.meta.updateTag({name: "twitter:image", content: config?.image || this.defaultImage});

        // Canonical URL
        this.updateCanonicalUrl();
    }

    /**
     * Update SEO using translation keys (i18n-aware)
     */
    updateFromTranslation(
        titleKey: string,
        descriptionKey: string,
        config?: Partial<SeoConfig>
    ): void {
        const title = this.translate.instant(titleKey);
        const description = this.translate.instant(descriptionKey);
        this.update(title, description, config);
    }

    /**
     * Update or create canonical URL link element
     */
    private updateCanonicalUrl(): void {
        const url = this.getCanonicalUrl();
        let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');

        if (!link) {
            link = this.document.createElement("link");
            link.setAttribute("rel", "canonical");
            this.document.head.appendChild(link);
        }

        link.setAttribute("href", url);
    }

    /**
     * Get canonical URL for current page
     */
    private getCanonicalUrl(): string {
        const baseUrl = this.document.location.origin;
        const path = this.router.url.split("?")[0]; // Remove query params
        return `${baseUrl}${path}`;
    }

    /**
     * Get locale string based on current language
     */
    private getCurrentLocale(): string {
        const lang = this.translate.currentLang || "en";
        const localeMap: Record<string, string> = {
            en: "en_US",
            ar: "ar_EG",
        };
        return localeMap[lang] || "en_US";
    }

    /**
     * Set robots meta tag
     */
    setRobots(index: boolean = true, follow: boolean = true): void {
        const content = `${index ? "index" : "noindex"}, ${follow ? "follow" : "nofollow"}`;
        this.meta.updateTag({name: "robots", content});
    }

    /**
     * Reset SEO tags to default site values
     */
    reset(): void {
        this.update(
            "FitZone | Fitness for Everyone",
            "Achieve your fitness goals with FitZone's certified trainers and modern facilities."
        );
    }
}
