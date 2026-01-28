import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import {MuscleGroup} from "../../../models/muscles";
import {MealService} from "../../../services/meals/meals";
import {Muscles} from "../../../services/muscle/muscles";
import {Panel} from "../business/panel/panel";
import {NavTabs} from "../navTabs/navTabs";
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly muscleService = inject(Muscles);
    private readonly mealService = inject(MealService);
    private readonly destroyRef = inject(DestroyRef);

    readonly id = signal<string>("");
    readonly cat = signal<string>("");
    readonly workoutMuscles = signal<MuscleGroup[]>([]);

    readonly selectedExercise = computed(() => this.muscleService.getSelectedExercise());
    readonly selectedMeal = computed(() => this.mealService.getSelectedMeal());

    ngOnInit(): void {
        this.getItemId();
    }

    getCurrentLang(): string {
        const lang = localStorage.getItem(StorageKeys.LANGUAGE) || "en";
        return lang.toLowerCase();
    }

    getPath(): void {
        this.router.navigate([
            this.getCurrentLang(),
            CLIENT_ROUTES.main.base,
            CLIENT_ROUTES.main.classes,
        ]);
    }

    private getItemId(): void {
        this.activatedRoute.paramMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((params) => {
                this.id.set(params.get("id") ?? "");
                this.cat.set(params.get("cat") ?? "");
                if (this.router.url.includes("classes")) {
                    this.getAllMuscles();
                }
            });
    }

    private getAllMuscles(): void {
        this.muscleService
            .getAllMuscleGroups()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const allMuscles: MuscleGroup[] = [
                        {
                            _id: "1234",
                            name: "full body",
                            isActive: this.muscleService.activeMuscleGroup() === "1234",
                        },
                        ...res.musclesGroup.map((item) => ({
                            ...item,
                            isActive: item._id === this.muscleService.activeMuscleGroup(),
                        })),
                    ];
                    this.workoutMuscles.set(allMuscles);
                },
            });
    }
}
