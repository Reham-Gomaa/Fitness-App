import {
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    OnInit,
    signal,
    WritableSignal,
} from "@angular/core";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Panel} from "../business/panel/panel";
import {NavTabs} from "../navTabs/navTabs";
import {Muscles} from "../../../services/muscle/muscles";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MuscleGroup} from "../../../models/muscles";
import {Exercise} from "../../../models/exercises";
import {Meal} from "../../../models/meals";
import {MealService} from "../../../services/meals/meals";

import {MediaContainer} from "./components/media-container/media-container";
import {WorkoutLegends} from "./components/workout-legends/workout-legends";
import {Ingradients} from "./components/ingradients/ingradients";
import {Recomendation} from "./components/recomendation/recomendation";
import {NgOptimizedImage} from "@angular/common";
import {CLIENT_ROUTES} from "./../../../../core/constants/client-routes";

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
        RouterLink,
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

    getPath() {
        return [CLIENT_ROUTES.main.classes];
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
