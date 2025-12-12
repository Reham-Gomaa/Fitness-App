import {
    Component,
    DestroyRef,
    effect,
    inject,
    input,
    InputSignal,
    signal,
    WritableSignal,
} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
// Shared_Interface
import {Exercise} from "../../../../models/exercises";
import {Meal} from "../../../../models/meals";
import {navItem} from "../../../../models/navItem";
// Shared_Service
import {Exercises} from "../../../../services/exercises/exercises";
import {Levels} from "../../../../services/levels/levels";
import {MealService} from "../../../../services/meals/meals";
// Shared_Component
import {NavTabs} from "../../navTabs/navTabs";
import {TranslatePipe} from "@ngx-translate/core";
import {Muscles} from "../../../../services/muscle/muscles";
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: "app-panel",
    imports: [NavTabs, TranslatePipe, NgOptimizedImage],
    templateUrl: "./panel.html",
    styleUrl: "./panel.scss",
})
export class Panel {
    private readonly _levels = inject(Levels);
    private readonly _exercises = inject(Exercises);
    private readonly _mealService = inject(MealService);
    private readonly _muscles = inject(Muscles);
    private readonly _destroyRef = inject(DestroyRef);

    panelType: InputSignal<string> = input<string>("");
    panelID: InputSignal<string> = input<string>("");

    muscle_id: WritableSignal<string> = signal<string>("");
    difficultyLevels: WritableSignal<navItem[] | undefined> = signal<navItem[] | undefined>(
        undefined
    );
    exercesList: WritableSignal<Exercise[] | undefined> = signal<Exercise[] | undefined>(undefined);

    meals_id: WritableSignal<string> = signal<string>("");
    mealsCategories: WritableSignal<navItem[] | undefined> = signal<navItem[] | undefined>(
        undefined
    );
    mealsList: WritableSignal<Meal[] | undefined> = signal<Meal[] | undefined>(undefined);

    private levelsEffect = effect(() => {
        if (this.panelType() === "classes") {
            this.muscle_id.set(this.panelID());
            this.loadLevels(this.muscle_id());
        } else if (this.panelType() === "meals") {
            this.meals_id.set(this.panelID());
            this.loadMeals(this.meals_id());
        }
    });

    loadLevels(muscleId: string) {
        this._levels
            .getLevelsByMuscle(muscleId)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (res) => {
                    const navItems: navItem[] = res.difficulty_levels.map((level, index) => ({
                        _id: level.id,
                        name: level.name,
                        isActive: index === 0,
                    }));
                    this.difficultyLevels.set(navItems);
                    this.getExercises(navItems[0]);
                },
            });
    }

    getExercises(level: navItem) {
        this._exercises
            .getExercisesByMuscle(this.muscle_id(), level._id)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (res) => {
                    this.exercesList.set(res.exercises);
                    this.updateActiveTab(this.difficultyLevels, level);
                },
            });
    }

    selectExercise(exercise: Exercise) {
        this._muscles.setSelectedExercise(exercise);
    }

    loadMeals(mealsId: string) {
        this._mealService
            .getMealsCats()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (res) => {
                    const navItems: navItem[] = res.categories.map((cat) => ({
                        _id: cat.idCategory,
                        name: cat.strCategory,
                        isActive: cat.idCategory === mealsId,
                    }));
                    this.mealsCategories.set(navItems);
                    this.getMeals(navItems[navItems.findIndex((item) => item._id === mealsId)]);
                },
            });
    }

    getMeals(meals: navItem) {
        this._mealService
            .getMealsByCategory(meals.name)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (res) => {
                    this.mealsList.set(res.meals);
                    this.updateActiveTab(this.mealsCategories, meals);
                },
            });
    }

    updateActiveTab(tabsList: WritableSignal<navItem[] | undefined>, navitem: navItem) {
        tabsList.update((value) =>
            value?.map((item) => ({
                ...item,
                isActive: item._id === navitem._id,
            }))
        );
    }

    selectMeal(meal: Meal) {
        this._mealService.setSelectedMeal(meal);
    }
}
