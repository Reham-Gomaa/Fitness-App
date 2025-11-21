import { Component } from "@angular/core";
import { Header } from "./../../../../../shared//components/ui/header/header";
import { MainButton } from "./../../../../../shared/components/ui/main-button/main-button";
import {HorizontalCarousel} from "./../../../../../shared/components/ui/horizontalCarousel/horizontalCarousel";

@Component({
    selector: "app-hero-section",
    imports: [Header, MainButton, HorizontalCarousel],
    templateUrl: "./hero-section.html",
    styleUrl: "./hero-section.scss",
})
export class HeroSection {
    statistics = [
        {
            num: 1200,
            desc: "Active Members",
        },
        {
            num: 12,
            desc: "Certified Trainers",
        },
        {
            num: 20,
            desc: "Year Of Experience",
        },
    ];
}
