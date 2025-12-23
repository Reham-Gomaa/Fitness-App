import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {Observable, retry, shareReplay} from "rxjs";
import {EndPoint} from "../../../core/enums/endpoint";
import {LevelsResponse} from "../../models/levels";

@Injectable({
    providedIn: "root",
})
export class Levels {
    private readonly _httpClient = inject(HttpClient);

    private levelsByMuscleCache = new Map<string, Observable<LevelsResponse>>();

    getLevelsByMuscle(id: string): Observable<LevelsResponse> {
        if (!this.levelsByMuscleCache.has(id)) {
            const request$ = this._httpClient
                .get<LevelsResponse>(`${EndPoint.LEVELS_BY_MUSCLE}?primeMoverMuscleId=${id}`)
                .pipe(retry(2), shareReplay({bufferSize: 1, refCount: true}));
            this.levelsByMuscleCache.set(id, request$);
        }
        return this.levelsByMuscleCache.get(id)!;
    }

    clearCache(id?: string): void {
        if (id) {
            this.levelsByMuscleCache.delete(id);
        } else {
            this.levelsByMuscleCache.clear();
        }
    }
}
