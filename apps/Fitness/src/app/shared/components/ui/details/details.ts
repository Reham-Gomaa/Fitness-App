import {
    Component,
    computed,
    DestroyRef,
    inject,
    OnInit,
    signal,
    WritableSignal,
} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router} from "@angular/router";
import {MuscleGroup} from "../../../models/muscles";
import {MealService} from "../../../services/meals/meals";
import {Muscles} from "../../../services/muscle/muscles";
import {Panel} from "../business/panel/panel";
import {NavTabs} from "../navTabs/navTabs";

import {NgOptimizedImage} from "@angular/common";
import {CLIENT_ROUTES} from "./../../../../core/constants/client-routes";
import {StorageKeys} from "./../../../../core/constants/storage.config";
import {Ingradients} from "./components/ingradients/ingradients";
import {MediaContainer} from "./components/media-container/media-container";
import {Recomendation} from "./components/recomendation/recomendation";
import {WorkoutLegends} from "./components/workout-legends/workout-legends";

@Component({
    selector: "app-details",
    imports: [
        Panel,
        MediaContainer,
        WorkoutLegends,
        Ingradients,
        Recomendation,
        NavTabs,
        NgOptimizedImage,
    ],
    templateUrl: "./details.html",
    styleUrl: "./details.scss",
})
export class Details implements OnInit {
    private activatedRoute = inject(ActivatedRoute);
    private _router = inject(Router);
    private _muscleService = inject(Muscles);
    private _mealService = inject(MealService);
    private _destroyRef = inject(DestroyRef);

    id: WritableSignal<string> = signal<string>("");
    //to decide which api to call
    cat: WritableSignal<string> = signal<string>("");
    workout_muscles = signal<MuscleGroup[]>([]);

    selectedExercise = computed(() => this._muscleService.getSelectedExercise());
    selectedMeal = computed(() => this._mealService.getSelectedMeal());

    getCurrentLang(): string {
        const lang = localStorage.getItem(StorageKeys.LANGUAGE) || "en";
        return lang.toLowerCase();
    }

    getPath() {
        this._router.navigate([
            this.getCurrentLang(),
            CLIENT_ROUTES.main.base,
            CLIENT_ROUTES.main.classes,
        ]);
    }

    ngOnInit(): void {
        this.getItemId();
    }

    getItemId() {
        this.activatedRoute.paramMap.subscribe((res) => {
            this.id.set(res.get("id") as string);
            this.cat.set(res.get("cat") as string);
            if (this._router.url.includes("classes")) {
                this.getAllMuscles();
            }
        });
    }

    getAllMuscles() {
        this._muscleService
            .getAllMuscleGroups()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (res) => {
                    this.workout_muscles.set(res.musclesGroup);
                    const allMuscles = [
                        {
                            _id: "1234",
                            name: "full body",
                            isActive: this._muscleService.activeMuscleGroup() === "1234",
                        },
                        ...res.musclesGroup.map((item) => ({
                            ...item,
                            isActive: item._id === this._muscleService.activeMuscleGroup(),
                        })),
                    ];
                    this.workout_muscles.set(allMuscles);
                },
            });
    }
}
