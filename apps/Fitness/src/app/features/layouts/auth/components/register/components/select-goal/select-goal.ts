import {Component, inject, OnInit, signal} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {Store} from "@ngrx/store";
import {nextStep, prevStep, updateRegisterData} from "../../../../store/auth.actions";
import {FitnessFormRadio, RadioItem} from "@fitness-app/fitness-form";
import {selectRegisterData} from "../../../../store/auth.selectors";

@Component({
    selector: "app-select-goal",
    standalone: true,
    imports: [CommonModule, TranslatePipe, FitnessFormRadio],
    templateUrl: "./select-goal.html",
    styleUrl: "./select-goal.scss",
})
export class SelectGoalComponent implements OnInit {
    private store = inject(Store);
    goal = signal<string>("gainWeight");

    ngOnInit() {
        this.store.select(selectRegisterData).subscribe((data) => {
            if (data.goal) {
                this.goal.set(data.goal);
            }
        });
    }

    goalOptions: RadioItem[] = [
        {value: "gainWeight", label: "register.selectGoal.options.gainWeight"},
        {value: "loseWeight", label: "register.selectGoal.options.loseWeight"},
        {value: "getFitter", label: "register.selectGoal.options.getFitter"},
        {value: "gainFlexibility", label: "register.selectGoal.options.gainFlexibility"},
        {value: "learnBasics", label: "register.selectGoal.options.learnBasics"},
    ];

    onGoalChange(goal: string) {
        this.goal.set(goal);
    }

    back() {
        this.store.dispatch(prevStep());
    }

    submit() {
        this.store.dispatch(updateRegisterData({data: {goal: this.goal()}}));
        this.store.dispatch(nextStep());
    }
}
