import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from "@angular/core";
import {MainCard} from "./../../../shared/components/ui/main-card/main-card";
//primeNg
import {MessageService} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {CarouselModule} from "primeng/carousel";
import {TagModule} from "primeng/tag";
import {Toast} from "primeng/toast";

//rxjs
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

//app Service
import {Muscles} from "./../../../shared/services/muscle/muscles";

//interfaces
import {Muscle, MuscleGroup} from "./../../../shared/models/muscles";

//reusable directive
import {Carousel} from "./../../../shared/components/ui/carousel/carousel";
import {Header} from "./../../../shared/components/ui/header/header";
import {NavTabs} from "./../../../shared/components/ui/navTabs/navTabs";
import {Title} from "./../../../shared/components/ui/title/title";
import {navItem} from "./../../../shared/models/navItem";

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
    ],
    templateUrl: "./workouts.html",
    styleUrl: "./workouts.scss",
})
export class Workouts implements OnInit {
    private muscleService = inject(Muscles);
    private destroyRef = inject(DestroyRef);
    private msgService = inject(MessageService);

    // workout_muscles: MuscleGroup[] = [] as MuscleGroup[];
    workout_muscles = signal<MuscleGroup[]>([]);
    related_Muscles: WritableSignal<Muscle[]> = signal([]);
    loading = signal(false);
    ngOnInit() {
        this.getAllMuscleGroups();
        this.getMusclesByGroup("1234");
    }

    SetCurrentMuscle(muscle: navItem) {
        this.workout_muscles.set(
            this.workout_muscles().map((m) => ({
                ...m,
                isActive: m._id == muscle._id,
            }))
        );
        this.getMusclesByGroup(muscle._id);
    }

    getAllMuscleGroups() {
        this.muscleService
            .getAllMuscleGroups()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.workout_muscles.set(res.musclesGroup);
                    this.workout_muscles().splice(0, 0, {
                        _id: "1234",
                        name: "full body",
                        isActive: true,
                    });
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
            summary: "info",
            detail: "No Data Available Now..!",
        });
    }
}
