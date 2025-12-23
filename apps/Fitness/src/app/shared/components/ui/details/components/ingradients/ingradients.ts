import {Component, computed, inject} from "@angular/core";
import {MealService} from "./../../../../../services/meals/meals";

@Component({
    selector: "app-ingradients",
    imports: [],
    templateUrl: "./ingradients.html",
    styleUrl: "./ingradients.scss",
})
export class Ingradients {
    private readonly _mealService = inject(MealService);

    mealDetails = computed(() => this._mealService.mealDetails());

    // Convert strIngredientX + strMeasureX → array
    ingredients = computed(() => {
        const meal = this.mealDetails();
        if (!meal) return [];

        const list: {ingredient: string; measure: string}[] = [];

        for (let i = 1; i <= 20; i++) {
            const ingredient = (meal as any)[`strIngredient${i}`]?.trim();
            const measure = (meal as any)[`strMeasure${i}`]?.trim();

            if (ingredient && ingredient !== "") {
                list.push({
                    ingredient,
                    measure: measure || "",
                });
            }
        }

        return list;
    });
}
