// Core
import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

// Shared-components
import {ButtonModule} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";
import {ProgressCircleComponent} from "../../../../../shared/components/progress-circle/progress-circle";
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
        ButtonModule,
        TranslatePipe,
        ProgressCircleComponent,
    ],
    templateUrl: "./register.html",
    styleUrl: "./register.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
    private readonly store = inject(Store);
    readonly isLoading = this.store.selectSignal(selectAuthLoading);
    readonly error = this.store.selectSignal(selectAuthError);
    readonly step = this.store.selectSignal(selectStep);
    readonly isStepValid = this.store.selectSignal(selectIsStepValid);

    next(): void {
        if (this.step() === 6) {
            this.store.dispatch(submitRegistration());
        } else {
            this.store.dispatch(nextStep());
        }
    }

    back(): void {
        this.store.dispatch(prevStep());
    }
}
