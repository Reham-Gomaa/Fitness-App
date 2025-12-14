import {Component, inject, OnInit, signal} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {Store} from "@ngrx/store";
import {nextStep, prevStep, updateRegisterData} from "../../../../store/auth.actions";
import {FitnessInputSlider} from "@fitness-app/fitness-form";
import {selectRegisterData} from "../../../../store/auth.selectors";

@Component({
    selector: "app-select-weight",
    standalone: true,
    imports: [CommonModule, TranslatePipe, FitnessInputSlider],
    templateUrl: "./select-weight.html",
    styleUrl: "./select-weight.scss",
})
export class SelectWeightComponent implements OnInit {
    private store = inject(Store);
    weight = signal<number>(90);

    ngOnInit() {
        this.store.select(selectRegisterData).subscribe((data) => {
            if (data.weight) {
                this.weight.set(data.weight);
            }
        });
    }

    onWeightChange(weight: number) {
        this.weight.set(weight);
    }

    back() {
        this.store.dispatch(prevStep());
    }

    submit() {
        this.store.dispatch(updateRegisterData({data: {weight: this.weight()}}));
        this.store.dispatch(nextStep());
    }
}
