import {Component, inject, OnInit, signal} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {Store} from "@ngrx/store";
import {nextStep, prevStep, updateRegisterData} from "../../../../store/auth.actions";
import {FitnessInputSlider} from "@fitness-app/fitness-form";
import {selectRegisterData} from "../../../../store/auth.selectors";

@Component({
    selector: "app-select-height",
    standalone: true,
    imports: [CommonModule, TranslatePipe, FitnessInputSlider],
    templateUrl: "./select-height.html",
    styleUrl: "./select-height.scss",
})
export class SelectHeightComponent implements OnInit {
    private store = inject(Store);
    height = signal<number>(170);

    ngOnInit() {
        this.store.select(selectRegisterData).subscribe((data) => {
            if (data.height) {
                this.height.set(data.height);
            }
        });
    }

    onHeightChange(height: number) {
        this.height.set(height);
    }

    back() {
        this.store.dispatch(prevStep());
    }

    submit() {
        this.store.dispatch(updateRegisterData({data: {height: this.height()}}));
        this.store.dispatch(nextStep());
    }
}
