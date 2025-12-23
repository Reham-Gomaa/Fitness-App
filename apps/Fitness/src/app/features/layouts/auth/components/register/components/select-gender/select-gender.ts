import {Component, DestroyRef, inject, OnInit, signal} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CommonModule} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {Store} from "@ngrx/store";
import {nextStep, prevStep, updateRegisterData} from "../../../../store/auth.actions";
import {FitnessInputGender, Gender} from "@fitness-app/fitness-form";
import {selectRegisterData} from "../../../../store/auth.selectors";

@Component({
    selector: "app-select-gender",
    standalone: true,
    imports: [CommonModule, TranslatePipe, FitnessInputGender],
    templateUrl: "./select-gender.html",
    styleUrl: "./select-gender.scss",
})
export class SelectGender implements OnInit {
    private store = inject(Store);
    private destroyRef = inject(DestroyRef);
    selectedGender = signal<Gender>(Gender.Male);

    ngOnInit() {
        this.loadSavedGender();
    }

    private loadSavedGender() {
        this.store
            .select(selectRegisterData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                if (data.gender) {
                    this.selectedGender.set(data.gender as Gender);
                } else {
                    this.store.dispatch(
                        updateRegisterData({data: {gender: this.selectedGender()}})
                    );
                }
            });
    }

    onGenderChange(gender: Gender) {
        this.selectedGender.set(gender);
        this.store.dispatch(updateRegisterData({data: {gender}}));
    }

    back() {
        this.store.dispatch(prevStep());
    }

    submit() {
        this.store.dispatch(updateRegisterData({data: {gender: this.selectedGender()}}));
        this.store.dispatch(nextStep());
    }
}
