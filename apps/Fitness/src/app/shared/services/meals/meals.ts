import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, mealCatRes } from '../../models/meals';
import { environment } from '@fitness-app/environment/baseUrl.dev';

@Injectable({
    providedIn: "root",
})
export class MealService {
    private http = inject(HttpClient);
    mealCategories: WritableSignal<Category[]> = signal([]);

    getMealsCats(): Observable<mealCatRes> {
        return this.http.get<mealCatRes>(`${environment.mealApiUrl}categories.php`);
    }
}
