import {
    Component,
    computed,
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
import {NgOptimizedImage} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {Skeleton} from "primeng/skeleton";
import {Muscles} from "../../../../services/muscle/muscles";
import {NavTabs} from "../../navTabs/navTabs";

interface PanelConfig {
    heading: string;
    section: string;
    listLabel: string;
    emptyLabel: string;

    list: Exercise[] | Meal[] | undefined;

    onItemSelect: (item: Exercise | Meal) => void;
    getItemLabel: (item: Exercise | Meal) => string;
    getSrOnlyView: (item: Exercise | Meal) => string;
}

@Component({
    selector: "app-panel",
    imports: [NavTabs, TranslatePipe, NgOptimizedImage, Skeleton],
    templateUrl: "./panel.html",
    styleUrl: "./panel.scss",
})
export class Panel {
    private readonly _levels = inject(Levels);
    private readonly _exercises = inject(Exercises);
    private readonly _mealService = inject(MealService);
    private readonly _muscles = inject(Muscles);
    private readonly _destroyRef = inject(DestroyRef);

    loading: WritableSignal<boolean> = signal(true);
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
    panelConfig = computed<PanelConfig>(() => {
        const type = this.panelType();

        return {
            heading: `${type}.sr-only.heading`,
            section: `${type}.sr-only.section`,
            listLabel: `${type}.sr-only.ul`,
            emptyLabel: `${type}.empty`,
            list: type === "classes" ? this.exercesList() : this.mealsList(),
            onItemSelect: (item: Exercise | Meal) =>
                type === "classes"
                    ? this.selectExercise(item as Exercise)
                    : this.selectMeal(item as Meal),
            getItemLabel: (item: Exercise | Meal) =>
                type === "classes"
                    ? `${(item as Exercise).exercise}, ${(item as Exercise).primary_equipment}`
                    : (item as Meal).strMeal,
            getSrOnlyView: (item: Exercise | Meal) =>
                `${type}.sr-only.view | translate` +
                " " +
                (type === "classes" ? (item as Exercise).exercise : (item as Meal).strMeal),
        };
    });

    getNavItems() {
        return this.panelType() === "classes" ? this.difficultyLevels() : this.mealsCategories();
    }

    getNavItemsResponse(nav: navItem) {
        return this.panelType() === "classes" ? this.getExercises(nav) : this.getMeals(nav);
    }

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
                    this.selectExercise();
                },
                complete: () => this.loading.set(false),
            });
    }

    selectExercise(exercise?: Exercise) {
        if (exercise) this._muscles.setSelectedExercise(exercise);
        else this._muscles.setSelectedExercise(this.exercesList()![0]);
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
                    this.selectMeal();
                },
                complete: () => this.loading.set(false),
            });
    }

    updateActiveTab(tabsList: WritableSignal<navItem[] | undefined>, navitem: navItem) {
        tabsList.update((value) => {
            if (!value) return value;
            return value.map((item) => ({
                ...item,
                isActive: item._id === navitem._id,
            }));
        });

        if (this.panelType() === "classes") {
            this.difficultyLevels.update((value) => [...(value || [])]);
        } else {
            this.mealsCategories.update((value) => [...(value || [])]);
        }
    }

    selectMeal(meal?: Meal) {
        if (meal) this._mealService.setSelectedMeal(meal);
        else this._mealService.setSelectedMeal(this.mealsList()![0]);
    }
}
