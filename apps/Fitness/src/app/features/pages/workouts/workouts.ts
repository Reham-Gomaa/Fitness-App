import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    input,
    OnInit,
    signal,
    WritableSignal,
} from "@angular/core";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
//primeNg
import {MessageService} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {CarouselModule} from "primeng/carousel";
import {TagModule} from "primeng/tag";
import {Toast} from "primeng/toast";

//rxjs
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

//app Service
import {SeoService} from "../../../core/services/seo/seo.service";
import {Muscles} from "./../../../shared/services/muscle/muscles";

//interfaces
import {Muscle, MuscleGroup} from "./../../../shared/models/muscles";
import {navItem} from "./../../../shared/models/navItem";

//reusable directive
import {IMAGE_LOADER, ImageLoaderConfig} from "@angular/common";
import {Carousel} from "./../../../shared/components/ui/carousel/carousel";
import {Header} from "./../../../shared/components/ui/header/header";
import {MainCard} from "./../../../shared/components/ui/main-card/main-card";
import {NavTabs} from "./../../../shared/components/ui/navTabs/navTabs";
import {Title} from "./../../../shared/components/ui/title/title";

@Component({
    selector: "app-workouts",
    imports: [
        MainCard,
        CarouselModule,
        ButtonModule,
        TagModule,
        Title,
        Header,
        Carousel,
        Toast,
        NavTabs,
        TranslatePipe,
    ],
    providers: [
        {
            provide: IMAGE_LOADER,
            useValue: (config: ImageLoaderConfig) => {
                // 1. If it's a local image (starts with /), don't use the proxy
                if (
                    config.src.startsWith("/") ||
                    config.src.startsWith("./") ||
                    config.src.startsWith("assets/")
                ) {
                    return config.src;
                }

                // 2. For external images (like Wikimedia), use the proxy
                // We use encodeURIComponent to ensure special characters in URLs don't break the proxy
                const imageUrl = config.src.includes("://") ? config.src : `https://${config.src}`;
                const widthParam = config.width ? `&w=${config.width}` : "";
                return `https://wsrv.nl/?url=${encodeURIComponent(
                    imageUrl
                )}${widthParam}&output=webp`;
            },
        },
    ],
    templateUrl: "./workouts.html",
    styleUrl: "./workouts.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Workouts implements OnInit {
    private muscleService = inject(Muscles);
    private destroyRef = inject(DestroyRef);
    private msgService = inject(MessageService);
    private seo = inject(SeoService);
    private translateService = inject(TranslateService);

    constructor() {
        this.seo.update(
            "Classes | FitZone",
            "Explore workout categories by muscle group (Chest, Back, Legs, Shoulders, Arms, Stomach) and filter by difficulty level (Beginner to Advanced). Watch detailed exercise videos with step-by-step guidance, and get personalized meal recommendations to support your fitness journey."
        );
    }
    renderLocation = input("main");

    // workout_muscles: MuscleGroup[] = [] as MuscleGroup[];
    workout_muscles = signal<MuscleGroup[]>([]);
    related_Muscles: WritableSignal<Muscle[]> = signal([]);
    loading = signal(false);
    ngOnInit() {
        this.getAllMuscleGroups();
        this.getMusclesByGroup("1234");
    }

    SetCurrentMuscle(muscle: navItem) {
        if (this.muscleService.activeMuscleGroup() === muscle._id) return;

        this.workout_muscles.update((muscles) =>
            muscles.map((m) => ({
                ...m,
                isActive: m._id === muscle._id,
            }))
        );
        this.getMusclesByGroup(muscle._id);
        this.muscleService.activeMuscleGroup.set(muscle._id);
    }

    getAllMuscleGroups() {
        this.muscleService
            .getAllMuscleGroups()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const allMuscles = [
                        {_id: "1234", name: "full body", isActive: true},
                        ...res.musclesGroup,
                    ];
                    this.workout_muscles.set(allMuscles);
                },
            });
    }

    getMusclesByGroup(id: string) {
        this.loading.set(true);
        if (id == "1234") {
            this.getFullBodyMuscles();
            return;
        }
        this.muscleService
            .getAllMusclesByMuscleGroup(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.loading.set(false);
                    if (res.muscles.length == 0) {
                        this.noMusclesFound();
                        return;
                    }
                    this.related_Muscles.set(res.muscles);
                },
            });
    }
    getFullBodyMuscles() {
        this.muscleService
            .getRandomMuscles()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.related_Muscles.set(res.muscles);
                },
            });
    }

    noMusclesFound() {
        this.msgService.add({
            severity: "info",
            summary: this.translateService.instant("classes.noDataSummary") || "Info",
            detail:
                this.translateService.instant("classes.noDataDetail") || "No Data Available Now..!",
        });
    }
}
