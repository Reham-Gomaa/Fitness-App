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

    // Automatically reloads when language changes
    // Uses BehaviorSubject for efficient multicasting
    private readonly reloadHelper = inject(ReloadableHttpHelper);
    private readonly reloadTrigger$ = this.reloadHelper.createReloadTrigger();

    // Caches
    private musclesCache$?: Observable<musclesRes>;
    private randomMusclesCache$?: Observable<muscleGroupRes>;
    private musclesByIdCache = new Map<string, Observable<muscleGroupRes>>();

    // State Signal
    private selectedExercise = signal<Exercise | null>(null);
    activeMuscleGroup: WritableSignal<string> = signal("1234");

    /**
     * Get all muscle groups
     * Automatically reloads when language changes with proper caching
     */
    getAllMuscleGroups(): Observable<musclesRes> {
        if (!this.musclesCache$) {
            this.musclesCache$ = this.reloadTrigger$.pipe(
                switchMap(() => this.http.get<musclesRes>(`${environment.baseApiUrl}muscles`)),
                shareReplay({bufferSize: 1, refCount: true}) // Cache for performance
            );
        }
        return this.musclesCache$;
    }

    /**
     * Get muscles by muscle group ID
     * Automatically reloads when language changes
     */
    getAllMusclesByMuscleGroup(id: string): Observable<muscleGroupRes> {
        if (!this.musclesByIdCache.has(id)) {
            const request$ = this.reloadTrigger$.pipe(
                switchMap(() =>
                    this.http.get<muscleGroupRes>(`${environment.baseApiUrl}musclesGroup/${id}`)
                ),
                shareReplay({bufferSize: 1, refCount: true}) // Cache for performance
            );
            this.musclesByIdCache.set(id, request$);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.musclesByIdCache.get(id)!;
    }

    /**
     * Get random muscles
     * Automatically reloads when language changes
     */
    getRandomMuscles(): Observable<muscleGroupRes> {
        if (!this.randomMusclesCache$) {
            this.randomMusclesCache$ = this.reloadTrigger$.pipe(
                switchMap(() =>
                    this.http.get<muscleGroupRes>(`${environment.baseApiUrl}muscles/random`)
                ),
                shareReplay({bufferSize: 1, refCount: true}) // Cache for performance
            );
        }
        return this.randomMusclesCache$;
    }

    setSelectedExercise(exercise: Exercise) {
        this.selectedExercise.set(exercise);
    }

    getSelectedExercise(): Exercise | null {
        return this.selectedExercise();
    }

    // Clear cache when needed (e.g., after logout, or on demand)
    clearMuscleCache(): void {
        this.musclesCache$ = undefined;
    }

    clearMusclesByIdCache(id?: string): void {
        if (id) {
            this.musclesByIdCache.delete(id);
        } else {
            this.musclesByIdCache.clear();
        }
    }

    clearRandomMuscleCache(): void {
        this.randomMusclesCache$ = undefined;
    }

    clearAllCache() {
        this.clearMuscleCache();
        this.clearMusclesByIdCache();
        this.clearRandomMuscleCache();
    }
}
