import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {Observable, retry, shareReplay} from "rxjs";
import {EndPoint} from "../../../core/enums/endpoint";
import {ExercisesResponse} from "../../models/exercises";

@Injectable({
    providedIn: "root",
})
export class Exercises {
    private readonly _httpClient = inject(HttpClient);

    // Cache Map: key = "muscleId_levelId", value = Observable<ExercisesResponse>
    private exercisesCache = new Map<string, Observable<ExercisesResponse>>();

    getExercisesByMuscle(muscle_id: string, level_id: string): Observable<ExercisesResponse> {
        const cacheKey = `${muscle_id}_${level_id}`;
        if (!this.exercisesCache.has(cacheKey)) {
            const request$ = this._httpClient
                .get<ExercisesResponse>(
                    `${EndPoint.EXERCISES_BY_MUSCLE_DIFFICULTY}?primeMoverMuscleId=${muscle_id}&difficultyLevelId=${level_id}`
                )
                .pipe(retry(2), shareReplay({bufferSize: 1, refCount: true}));
            this.exercisesCache.set(cacheKey, request$);
        }
        return this.exercisesCache.get(cacheKey)!;
    }

    clearCache(muscle_id?: string, level_id?: string): void {
        if (muscle_id && level_id) {
            const cacheKey = `${muscle_id}_${level_id}`;
            this.exercisesCache.delete(cacheKey);
        } else {
            this.exercisesCache.clear();
        }
    }
}
