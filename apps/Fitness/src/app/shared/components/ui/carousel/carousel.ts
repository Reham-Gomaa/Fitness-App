import {ChangeDetectionStrategy, Component, input, OnInit, computed} from "@angular/core";
import {MainCard} from "../main-card/main-card";
import {Muscle} from "../../../models/muscles";
// PrimeNG
import {CarouselModule} from "primeng/carousel";
import {ButtonModule} from "primeng/button";
import {TagModule} from "primeng/tag";
import {Category} from "../../../models/meals";
import {Skeleton} from "primeng/skeleton";

@Component({
    selector: "app-carousel",
    imports: [MainCard, CarouselModule, ButtonModule, TagModule, Skeleton],
    templateUrl: "./carousel.html",
    styleUrl: "./carousel.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carousel implements OnInit {
    data = input.required<Muscle[] | Category[]>();
    cat = input<string>();
    rendLocation = input.required<string>();
    numVisible = input<number>(3);
    showIndic = input<boolean>(true);
    responsiveOptions: {breakpoint: string; numVisible: number; numScroll: number}[] = [];

    readonly processedData = computed(() => {
        const d = this.data();
        const location = this.rendLocation();

        if (location !== "home" && location !== "recommend") {
            const rows = 2;
            const grouped: (Muscle | Category)[][] = [];
            for (let i = 0; i < d.length; i += rows) {
                grouped.push(d.slice(i, i + rows));
            }
            return grouped;
        }

        return d;
    });

    ngOnInit(): void {
        this.responsiveOptions = [
            {
                breakpoint: "1400px",
                numVisible: 2,
                numScroll: 2,
            },
            {
                breakpoint: "767px",
                numVisible: 1,
                numScroll: 1,
            },
        ];
    }
}
