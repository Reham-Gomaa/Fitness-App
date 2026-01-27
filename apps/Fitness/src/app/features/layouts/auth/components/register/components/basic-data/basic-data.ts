import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {debounceTime} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {RouterLink} from "@angular/router";

// Shared-components
import {FitnessInput} from "@fitness-app/fitness-form";
import {RouteBuilderService} from "../../../../../../../core/services/router/route-builder.service";
import {CLIENT_ROUTES} from "../../../../../../../core/constants/client-routes";
import {nextStep, setStepValidity, updateRegisterData} from "../../../../store/auth.actions";
import {selectRegisterData} from "../../../../store/auth.selectors";
import {PASSWORD_PATTERN} from "../../../../../../../core/constants/validation.constants";
import {passwordMatchValidator} from "../../../../../../../core/utils/validators.util";

@Component({
    selector: "app-basic-data",
    standalone: true,
    imports: [FitnessInput, ReactiveFormsModule, RouterLink, TranslatePipe],
    templateUrl: "./basic-data.html",
    styleUrl: "./basic-data.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicData implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly formBuilder = inject(FormBuilder);
    private readonly store = inject(Store);
    readonly routeBuilder = inject(RouteBuilderService);

    readonly ROUTES = CLIENT_ROUTES;
    basicDataForm!: FormGroup;

    ngOnInit(): void {
        this.initForm();
        this.observeFormChanges();
        this.loadSavedData();
        // Set initial validity
        this.store.dispatch(setStepValidity({isValid: this.basicDataForm.valid}));
    }

    onSubmit(): void {
        if (this.basicDataForm.valid) {
            this.store.dispatch(updateRegisterData({data: this.basicDataForm.value}));
            this.store.dispatch(nextStep());
        }
    }

    private initForm(): void {
        this.basicDataForm = this.formBuilder.group(
            {
                firstName: ["", [Validators.required, Validators.minLength(2)]],
                lastName: ["", [Validators.required, Validators.minLength(2)]],
                email: ["", [Validators.required, Validators.email]],
                password: ["", [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
                rePassword: ["", [Validators.required]],
            },
            {
                validators: passwordMatchValidator("password", "rePassword"),
            }
        );
    }

    private observeFormChanges(): void {
        this.basicDataForm.valueChanges
            .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => {
                this.store.dispatch(updateRegisterData({data: value}));
                this.store.dispatch(setStepValidity({isValid: this.basicDataForm.valid}));
            });
    }

    private loadSavedData(): void {
        this.store
            .select(selectRegisterData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                if (data.firstName || data.email) {
                    this.basicDataForm.patchValue(
                        {
                            firstName: data.firstName || "",
                            lastName: data.lastName || "",
                            email: data.email || "",
                            password: data.password || "",
                            rePassword: data.rePassword || "",
                        },
                        {emitEvent: false}
                    );
                }
            });
    }
}
