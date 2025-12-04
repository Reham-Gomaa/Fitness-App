import {Component, OnInit, signal} from "@angular/core";

import {CarouselModule} from "primeng/carousel";
import {ButtonModule} from "primeng/button";
import {TagModule} from "primeng/tag";
@Component({
    selector: "app-horizontal-carousel",
    imports: [CarouselModule, ButtonModule, TagModule],
    templateUrl: "./horizontalCarousel.html",
    styleUrl: "./horizontalCarousel.scss",
})
export class HorizontalCarousel implements OnInit {
    responsiveOptions: any[] | undefined;

    ngOnInit(): void {
        this.responsiveOptions = [
            {
                breakpoint: "1400px",
                numVisible: 2,
                numScroll: 1,
            },
            {
                breakpoint: "1199px",
                numVisible: 3,
                numScroll: 1,
            },
            {
                breakpoint: "767px",
                numVisible: 2,
                numScroll: 1,
            },
            {
                breakpoint: "575px",
                numVisible: 1,
                numScroll: 1,
            },
        ];
    }

    expressions() {
        const arr = [
            "NUTRITION COACHING",
            "WORKOUT PROGRAMS",
            "YOGA & MEDITATION",
            "STRENGTH TRAINING",
            "CARDIO SESSIONS",
            "HOME WORKOUTS",
        ];

        return [...arr, ...arr]; // 👈 IMPORTANT (double array)
    }
}
