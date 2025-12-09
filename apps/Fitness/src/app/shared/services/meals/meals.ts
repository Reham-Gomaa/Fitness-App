import {HttpClient} from "@angular/common/http";
import {inject, Injectable, signal} from "@angular/core";
import {Observable, retry, shareReplay} from "rxjs";
import {Meal, mealCatRes, MealsByCategoryResponse} from "../../models/meals";
import {environment} from "@fitness-app/environment/baseUrl.dev";
import {EndPoint} from "../../../core/enums/endpoint";

@Injectable({
    providedIn: "root",
})
export class MealService {
    private http = inject(HttpClient);
    private selectedMeal = signal<Meal | null>(null);

    private categoriesCache$?: Observable<mealCatRes>;

    private mealsByCategoryCache = new Map<string, Observable<MealsByCategoryResponse>>();

    getMealsCats(): Observable<mealCatRes> {
        if (!this.categoriesCache$) {
            this.categoriesCache$ = this.http
                .get<mealCatRes>(`${environment.mealApiUrl}categories.php`)
                .pipe(
                    retry(2),
                    shareReplay({bufferSize: 1, refCount: true}) // Cache the last emission
                );
        }
        return this.categoriesCache$;
    }

    getMealsByCategory(cat: string): Observable<MealsByCategoryResponse> {
        if (!this.mealsByCategoryCache.has(cat)) {
            const request$ = this.http
                .get<MealsByCategoryResponse>(`${EndPoint.MEALS_BY_CATEGORY}?c=${cat}`)
                .pipe(retry(2), shareReplay({bufferSize: 1, refCount: true}));
            this.mealsByCategoryCache.set(cat, request$);
        }
        return this.mealsByCategoryCache.get(cat)!;
    }

    // Clear cache when needed (e.g., after logout, or on demand)
    clearCategoryCache(): void {
        this.categoriesCache$ = undefined;
    }

    clearMealsByCategoryCache(cat?: string): void {
        if (cat) {
            this.mealsByCategoryCache.delete(cat);
        } else {
            this.mealsByCategoryCache.clear();
        }
    }

    clearAllCache() {
        this.clearCategoryCache();
        this.clearMealsByCategoryCache();
    }

    setSelectedMeal(meal: Meal) {
        this.selectedMeal.set(meal);
    }

    getSelectedMeal(): Meal | null {
        return this.selectedMeal();
    }
}
