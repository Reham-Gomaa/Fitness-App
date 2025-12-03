import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from "@angular/core";
import {Category} from "./../../../shared/models/meals";
import {MealService} from "./../../../shared/services/meals/meals";
//reusable
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Carousel} from "./../../../shared/components/ui/carousel/carousel";
import {Header} from "./../../../shared/components/ui/header/header";
import {Title} from "./../../../shared/components/ui/title/title";
import {SeoService} from "../../../core/services/seo/seo.service";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: "app-meals",
    imports: [Title, Header, Carousel, TranslatePipe],
    templateUrl: "./meals.html",
    styleUrl: "./meals.scss",
})
export class Meals implements OnInit {
    private mealService = inject(MealService);
    private destroyRef = inject(DestroyRef);
    private seo = inject(SeoService);

    mealCats: WritableSignal<Category[]> = signal([]);

    constructor() {
        this.seo.update(
            "Healthy | FitZone",
            "Explore healthy meal categories like chicken, pasta, and seafood. View detailed recipes with ingredients, step-by-step instructions, and nutritional guidance to support your fitness goals. Find meal ideas that fit your diet plan."
        );
    }

    ngOnInit(): void {
        this.getMealCats();
    }
    getMealCats() {
        this.mealService
            .getMealsCats()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.mealCats.set(res.categories);
                },
            });
    }
}
