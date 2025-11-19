
import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { Workouts } from './components/workouts/workouts';
import { Meals } from "./components/meals/meals";

import {isPlatformBrowser} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ButtonModule} from "primeng/button";
import {Translation} from "../../../core/services/translation/translation";


import {AboutUs} from "./components/about-us/about-us";
@Component({

    selector: "app-home",
    imports: [ButtonModule, TranslateModule, AboutUs,Meals, Workouts, Meals],
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
