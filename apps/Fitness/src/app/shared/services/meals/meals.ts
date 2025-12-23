import {HttpClient} from "@angular/common/http";
import {inject, Injectable, signal, WritableSignal} from "@angular/core";
import {environment} from "@fitness-app/environment/baseUrl.dev";
import {Observable, retry, shareReplay} from "rxjs";
import {EndPoint} from "../../../core/enums/endpoint";
import {
    Category,
    Meal,
    mealCatRes,
    MealDetails,
    MealDetailsResponse,
    MealsByCategoryResponse,
} from "../../models/meals";

@Injectable({
    providedIn: "root",
})
export class MealService {
    private http = inject(HttpClient);

    // Caches
    categoriesCache$?: Observable<mealCatRes>;
    mealsByCategoryCache = new Map<string, Observable<MealsByCategoryResponse>>();
    mealDetailsCache = new Map<string, Observable<MealDetailsResponse>>();

    // State Signals
    private selectedMeal = signal<Meal | null>(null);
    mealCategories: WritableSignal<Category[]> = signal([]);
    mealDetails: WritableSignal<MealDetails | undefined> = signal(undefined);

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

    getMealDetails(meal_id: string): Observable<MealDetailsResponse> {
        if (!this.mealDetailsCache.has(meal_id)) {
            const request$ = this.http
                .get<MealDetailsResponse>(`${EndPoint.MEAL_DETAILS}?i=${meal_id}`)
                .pipe(retry(2), shareReplay({bufferSize: 1, refCount: true}));
            this.mealDetailsCache.set(meal_id, request$);
        }
        return this.mealDetailsCache.get(meal_id)!;
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

    clearMealDetailsCache(meal_id?: string): void {
        if (meal_id) {
            this.mealDetailsCache.delete(meal_id);
        } else {
            this.mealDetailsCache.clear();
        }
    }

    clearAllCache() {
        this.clearCategoryCache();
        this.clearMealsByCategoryCache();
        this.clearMealDetailsCache();
    }
}
