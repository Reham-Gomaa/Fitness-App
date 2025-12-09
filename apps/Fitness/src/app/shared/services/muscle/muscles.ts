import {HttpClient} from "@angular/common/http";
import {inject, Injectable, signal, WritableSignal} from "@angular/core";
import {Observable} from "rxjs";
import {switchMap, shareReplay} from "rxjs/operators";
import {muscleGroupRes, musclesRes} from "../../models/muscles";
import {environment} from "@fitness-app/environment/baseUrl.dev";
import {ReloadableHttpHelper} from "../../../core/services/api-reload/reloadable-http.helper";
import {Exercise} from "../../models/exercises";

/**
 * High-performance service for muscle data
 * Optimized for Angular 20 with automatic API reload on language change
 */
@Injectable({
    providedIn: "root",
})
export class Muscles {
    private readonly http = inject(HttpClient);
    private readonly reloadHelper = inject(ReloadableHttpHelper);

    // Automatically reloads when language changes
    // Uses BehaviorSubject for efficient multicasting
    private readonly reloadTrigger$ = this.reloadHelper.createReloadTrigger();

    private selectedExercise = signal<Exercise | null>(null);
    activeMuscleGroup: WritableSignal<string> = signal("1234");

    /**
     * Get all muscle groups
     * Automatically reloads when language changes with proper caching
     */
    getAllMuscleGroups(): Observable<musclesRes> {
        return this.reloadTrigger$.pipe(
            switchMap(() => this.http.get<musclesRes>(`${environment.baseApiUrl}muscles`)),
            shareReplay({bufferSize: 1, refCount: true}) // Cache for performance
        );
    }

    /**
     * Get muscles by muscle group ID
     * Automatically reloads when language changes
     */
    getAllMusclesByMuscleGroup(id: string): Observable<muscleGroupRes> {
        return this.reloadTrigger$.pipe(
            switchMap(() =>
                this.http.get<muscleGroupRes>(`${environment.baseApiUrl}musclesGroup/${id}`)
            ),
            shareReplay({bufferSize: 1, refCount: true}) // Cache for performance
        );
    }

    /**
     * Get random muscles
     * Automatically reloads when language changes
     */
    getRandomMuscles(): Observable<muscleGroupRes> {
        return this.reloadTrigger$.pipe(
            switchMap(() =>
                this.http.get<muscleGroupRes>(`${environment.baseApiUrl}muscles/random`)
            ),
            shareReplay({bufferSize: 1, refCount: true}) // Cache for performance
        );
    }

    setSelectedExercise(exercise: Exercise) {
        this.selectedExercise.set(exercise);
    }

    getSelectedExercise(): Exercise | null {
        return this.selectedExercise();
    }
}
