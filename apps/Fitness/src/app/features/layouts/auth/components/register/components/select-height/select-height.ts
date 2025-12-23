import {Component, DestroyRef, inject, OnInit, signal} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
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
    private destroyRef = inject(DestroyRef);
    height = signal<number>(170);

    ngOnInit() {
        this.loadSavedHeight();
    }

    private loadSavedHeight() {
        this.store
            .select(selectRegisterData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                if (data.height) {
                    this.height.set(data.height);
                } else {
                    this.store.dispatch(updateRegisterData({data: {height: this.height()}}));
                }
            });
    }

    onHeightChange(height: number) {
        this.height.set(height);
        this.store.dispatch(updateRegisterData({data: {height}}));
    }

    back() {
        this.store.dispatch(prevStep());
    }

    submit() {
        this.store.dispatch(updateRegisterData({data: {height: this.height()}}));
        this.store.dispatch(nextStep());
    }
}
