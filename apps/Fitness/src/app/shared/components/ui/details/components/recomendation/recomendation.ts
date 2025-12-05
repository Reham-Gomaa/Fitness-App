import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from "@angular/core";
import { Carousel } from "../../../carousel/carousel";
import {MealService} from "./../../../../../services/meals/meals";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {Category} from "./../../../../../../shared/models/meals";

@Component({
    selector: "app-recomendation",
    imports: [Carousel],
    templateUrl: "./recomendation.html",
    styleUrl: "./recomendation.scss",
})
export class Recomendation implements OnInit {
    mealService = inject(MealService);
    private destroyRef = inject(DestroyRef);
    mealCats: WritableSignal<Category[]> = signal([]);

    ngOnInit() {
        this.getMealCats()
    }

    getMealCats() {
        this.mealService
            .getMealsCats()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.mealService.mealCategories.set(res.categories);
                    this.mealCats.set(res.categories);
                },
            });
    }
}
