import {inject, Injectable} from "@angular/core";
import {Exercises} from "../exercises/exercises";
import {Levels} from "../levels/levels";
import {MealService} from "../meals/meals";
import {Muscles} from "../muscle/muscles";

@Injectable({
    providedIn: "root",
})
export class ClearCache {
    private readonly _levels = inject(Levels);
    private readonly _exercises = inject(Exercises);
    private readonly _mealService = inject(MealService);
    private readonly _muscles = inject(Muscles);

    clearAllCaches() {
        this._levels.clearCache();
        this._exercises.clearCache();
        this._mealService.clearAllCache();
        this._muscles.clearAllCache();
    }
}
