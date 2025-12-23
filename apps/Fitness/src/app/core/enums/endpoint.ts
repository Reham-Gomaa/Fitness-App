import {environment} from "@fitness-app/environment/baseUrl.dev";

export class EndPoint {
    static LEVELS = `${environment.baseApiUrl}levels`;
    static LEVELS_BY_MUSCLE = `${environment.baseApiUrl}levels/difficulty-levels/by-prime-mover`;
    static MUSCLES = `${environment.baseApiUrl}muscles`;
    static EXERCISES = `${environment.baseApiUrl}exercises`;
    static EXERCISES_BY_MUSCLE_DIFFICULTY = `${environment.baseApiUrl}exercises/by-muscle-difficulty`;
    static MEALS_BY_CATEGORY = `${environment.mealApiUrl}filter.php`;
    static MEAL_DETAILS = `${environment.mealApiUrl}lookup.php`;
}
