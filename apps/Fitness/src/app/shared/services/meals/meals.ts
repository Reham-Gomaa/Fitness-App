import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mealCatRes } from '../../models/meals';
import { environment } from '@fitness-app/environment/baseUrl.dev';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private http = inject(HttpClient)

  getMealsCats():Observable<mealCatRes>{
    return this.http.get<mealCatRes>(
      `
      ${environment.mealApiUrl}/categories.php`,
      {
        headers: {
          'accept-language': 'en',
        },
      }
    );
  }
}
