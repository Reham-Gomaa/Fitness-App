import {Component, computed, inject, PLATFORM_ID} from "@angular/core";

import {isPlatformBrowser} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ButtonModule} from "primeng/button";
import {Translation} from "../../../core/services/translation/translation";

import {HorizontalCarousel} from "../../../shared/components/ui/horizontalCarousel/horizontalCarousel";
import {AboutUs} from "../about-us/about-us";
import {Meals} from "../meals/meals";
import {Workouts} from "../workouts/workouts";
import { HeroSection } from "./components/hero-section/hero-section";
@Component({
    selector: "app-home",
    imports: [ButtonModule, TranslateModule, AboutUs, Workouts, Meals, HorizontalCarousel, HeroSection],
    templateUrl: "./home.html",
    styleUrl: "./home.scss",
})
export class Home {
    private readonly translation = inject(Translation);
    private readonly platformId = inject(PLATFORM_ID);

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
