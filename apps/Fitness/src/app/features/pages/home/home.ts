import {isPlatformBrowser} from "@angular/common";
import {ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {ButtonModule} from "primeng/button";
// Services
import {SeoService} from "../../../core/services/seo/seo.service";
import {Translation} from "../../../core/services/translation/translation";
// Shared_components
import {HorizontalCarousel} from "../../../shared/components/ui/horizontalCarousel/horizontalCarousel";
import {AboutUs} from "../about-us/about-us";
import {Meals} from "../meals/meals";
import {Workouts} from "../workouts/workouts";
import {HeroSection} from "./components/hero-section/hero-section";
import {WhyUs} from "./components/why-us/why-us";
@Component({
    selector: "app-home",
    imports: [
        ButtonModule,
        TranslateModule,
        AboutUs,
        Workouts,
        Meals,
        HorizontalCarousel,
        HeroSection,
        WhyUs,
        Meals,
    ],
    templateUrl: "./home.html",
    styleUrl: "./home.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
    private readonly translation = inject(Translation);
    private readonly platformId = inject(PLATFORM_ID);
    private seo = inject(SeoService);

    constructor() {
        this.seo.update(
            "Home | FitZone",
            "Kickstart your fitness journey. Explore our personalized workout plans, expert trainer sessions, and nutritious meal guides. Discover our mission, modern equipment, and join a community focused on your results. Get started today!"
        );
    }

    // Expose language signal for template
    currentLang = this.translation.lang;

    // Get current URL for display
    currentUrl = computed(() => {
        if (isPlatformBrowser(this.platformId)) {
            return window.location.href;
        }
        return "";
    });

    // Get supported languages for buttons
    readonly languages = [
        {code: "en", label: "English", flag: "🇬🇧"},
        {code: "ar", label: "العربية", flag: "🇸🇦"},
    ];

    switchLanguage(lang: string): void {
        this.translation.setLanguage(lang);
    }
}
