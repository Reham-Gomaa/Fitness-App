import {Component, DestroyRef, inject, OnInit, signal} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CommonModule} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {Store} from "@ngrx/store";
import {nextStep, prevStep, updateRegisterData} from "../../../../store/auth.actions";
import {FitnessInputSlider} from "@fitness-app/fitness-form";
import {selectRegisterData} from "../../../../store/auth.selectors";

@Component({
    selector: "app-select-old",
    standalone: true,
    imports: [CommonModule, TranslatePipe, FitnessInputSlider],
    templateUrl: "./select-old.html",
    styleUrl: "./select-old.scss",
})
export class SelectOldComponent implements OnInit {
    private store = inject(Store);
    private destroyRef = inject(DestroyRef);
    age = signal<number>(25);

    ngOnInit() {
        this.loadSavedAge();
    }

    private loadSavedAge() {
        this.store
            .select(selectRegisterData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                if (data.age) {
                    this.age.set(data.age);
                } else {
                    this.store.dispatch(updateRegisterData({data: {age: this.age()}}));
                }
            });
    }

    onAgeChange(age: number) {
        this.age.set(age);
        this.store.dispatch(updateRegisterData({data: {age}}));
    }

    back() {
        this.store.dispatch(prevStep());
    }

    submit() {
        this.store.dispatch(updateRegisterData({data: {age: this.age()}}));
        this.store.dispatch(nextStep());
    }
}
