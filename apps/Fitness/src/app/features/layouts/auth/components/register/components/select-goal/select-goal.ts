import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TranslatePipe} from "@ngx-translate/core";
import {Store} from "@ngrx/store";
import {
    nextStep,
    prevStep,
    setStepValidity,
    updateRegisterData,
} from "../../../../store/auth.actions";
import {FitnessFormRadio, RadioItem} from "@fitness-app/fitness-form";
import {selectRegisterData} from "../../../../store/auth.selectors";

@Component({
    selector: "app-select-goal",
    standalone: true,
    imports: [TranslatePipe, FitnessFormRadio],
    templateUrl: "./select-goal.html",
    styleUrl: "./select-goal.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectGoalComponent implements OnInit {
    private readonly store = inject(Store);
    private readonly destroyRef = inject(DestroyRef);

    readonly goal = signal<string>("gainWeight");

    readonly goalOptions: RadioItem[] = [
        {value: "gainWeight", label: "register.selectGoal.options.gainWeight"},
        {value: "loseWeight", label: "register.selectGoal.options.loseWeight"},
        {value: "getFitter", label: "register.selectGoal.options.getFitter"},
        {value: "gainFlexibility", label: "register.selectGoal.options.gainFlexibility"},
        {value: "learnBasics", label: "register.selectGoal.options.learnBasics"},
    ];

    ngOnInit(): void {
        this.loadSavedGoal();
        this.store.dispatch(setStepValidity({isValid: true}));
    }

    onGoalChange(goal: string): void {
        this.goal.set(goal);
        this.store.dispatch(updateRegisterData({data: {goal}}));
    }

    back(): void {
        this.store.dispatch(prevStep());
    }

    submit(): void {
        this.store.dispatch(updateRegisterData({data: {goal: this.goal()}}));
        this.store.dispatch(nextStep());
    }

    private loadSavedGoal(): void {
        this.store
            .select(selectRegisterData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                if (data.goal) {
                    this.goal.set(data.goal);
                } else {
                    this.store.dispatch(updateRegisterData({data: {goal: this.goal()}}));
                }
            });
    }
}
