import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { muscleGroupRes, musclesRes } from '../../models/muscles';
import { environment } from '@fitness-app/environment/baseUrl.dev';

@Injectable({
  providedIn: 'root',
})
export class Muscles {
  private http = inject(HttpClient);

  getAllMuscleGroups(): Observable<musclesRes> {
    return this.http.get<musclesRes>(
      `${environment.baseApiUrl}muscles`
    , {
      headers:{
        'accept-language':"en"
      }
    });
  }

  getAllMusclesByMuscleGroup(id: string): Observable<muscleGroupRes> {
    return this.http.get<muscleGroupRes>(
      `${environment.baseApiUrl}musclesGroup/${id}`,
      {
        headers: {
          'accept-language': 'en',
        },
      }
    );
  }

  getRandomMuscles():Observable<muscleGroupRes>{
    return this.http.get<muscleGroupRes>(`${environment.baseApiUrl}muscles/random`, {
      headers: {
        'accept-language': 'en',
      },
    });
  }
}
