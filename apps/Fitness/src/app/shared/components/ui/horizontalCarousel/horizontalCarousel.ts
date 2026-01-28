import {ChangeDetectionStrategy, Component, computed} from "@angular/core";
import {CarouselModule} from "primeng/carousel";
import {ButtonModule} from "primeng/button";
import {TagModule} from "primeng/tag";

interface ResponsiveOption {
    breakpoint: string;
    numVisible: number;
    numScroll: number;
}

@Component({
    selector: "app-horizontal-carousel",
    imports: [CarouselModule, ButtonModule, TagModule],
    templateUrl: "./horizontalCarousel.html",
    styleUrl: "./horizontalCarousel.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalCarousel {
    /** Responsive breakpoints for carousel */
    readonly responsiveOptions: ResponsiveOption[] = [
        {breakpoint: "1400px", numVisible: 2, numScroll: 1},
        {breakpoint: "1199px", numVisible: 3, numScroll: 1},
        {breakpoint: "767px", numVisible: 2, numScroll: 1},
        {breakpoint: "575px", numVisible: 1, numScroll: 1},
    ];

    /** Expression items for carousel - computed for memoization */
    readonly expressions = computed(() => {
        const items = [
            "NUTRITION COACHING",
            "WORKOUT PROGRAMS",
            "YOGA & MEDITATION",
            "STRENGTH TRAINING",
            "CARDIO SESSIONS",
            "HOME WORKOUTS",
        ];
        return [...items, ...items]; // Double for seamless loop
    });
}
