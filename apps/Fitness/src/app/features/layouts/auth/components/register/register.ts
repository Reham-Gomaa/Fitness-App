// Core
import {Component, inject} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

// Shared-components
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {ProgressCircleComponent} from "apps/Fitness/src/app/shared/components/progress-circle/progress-circle";
import {BasicData} from "./components/basic-data/basic-data";
import {SelectGender} from "./components/select-gender/select-gender";

// NgRx
import {Store} from "@ngrx/store";
import {nextStep, prevStep, submitRegistration} from "../../store/auth.actions";
import {
    selectAuthLoading,
    selectAuthError,
    selectStep,
    selectIsStepValid,
} from "../../store/auth.selectors";
import {SelectOldComponent} from "./components/select-old/select-old";
import {SelectWeightComponent} from "./components/select-weight/select-weight";
import {SelectHeightComponent} from "./components/select-height/select-height";
import {SelectGoalComponent} from "./components/select-goal/select-goal";
import {SelectActivityLevelComponent} from "./components/select-activity-level/select-activity-level";

@Component({
    selector: "app-register",
    standalone: true,
    imports: [
        BasicData,
        SelectGender,
        ReactiveFormsModule,
        RouterModule,
        SelectOldComponent,
        SelectWeightComponent,
        SelectHeightComponent,
        SelectGoalComponent,
        SelectActivityLevelComponent,
        CommonModule,
        ButtonModule,
        TranslatePipe,
        ProgressCircleComponent,
        FormsModule,
    ],
    templateUrl: "./register.html",
    styleUrl: "./register.scss",
})
export class Register {
    private store = inject(Store);
    isLoading = this.store.selectSignal(selectAuthLoading);
    error = this.store.selectSignal(selectAuthError);
    step = this.store.selectSignal(selectStep);
    isStepValid = this.store.selectSignal(selectIsStepValid);

    next() {
        if (this.step() === 6) {
            this.store.dispatch(submitRegistration());
        } else {
            this.store.dispatch(nextStep());
        }
    }

    back() {
        this.store.dispatch(prevStep());
    }
}
