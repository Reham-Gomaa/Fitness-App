import {HttpClient} from "@angular/common/http";
import {inject, Injectable, signal, WritableSignal} from "@angular/core";
import {Observable, retry, shareReplay} from "rxjs";
import {Category, Meal, mealCatRes, MealsByCategoryResponse} from "../../models/meals";
import {environment} from "@fitness-app/environment/baseUrl.dev";
import {EndPoint} from "../../../core/enums/endpoint";
import {ReloadableHttpHelper} from "../../../core/services/api-reload/reloadable-http.helper";

@Injectable({
    providedIn: "root",
})
export class MealService {
    private http = inject(HttpClient);

    // Caches
    private categoriesCache$?: Observable<mealCatRes>;
    private mealsByCategoryCache = new Map<string, Observable<MealsByCategoryResponse>>();

    // State Signals
    private selectedMeal = signal<Meal | null>(null);
    mealCategories: WritableSignal<Category[]> = signal([]);

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

    setSelectedMeal(meal: Meal) {
        this.selectedMeal.set(meal);
    }

    getSelectedMeal(): Meal | null {
        return this.selectedMeal();
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
}
