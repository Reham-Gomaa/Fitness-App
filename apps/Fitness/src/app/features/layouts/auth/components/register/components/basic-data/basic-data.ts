import {Component, DestroyRef, inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateService, TranslatePipe} from "@ngx-translate/core";
import {AuthApiKpService} from "auth-api-kp";
import {MessageService} from "primeng/api";

// Shared-components
import {FitnessInput} from "@fitness-app/fitness-form";
import {Router, RouterLink} from "@angular/router";
import {RouteBuilderService} from "apps/Fitness/src/app/core/services/router/route-builder.service";
import {CLIENT_ROUTES} from "apps/Fitness/src/app/core/constants/client-routes";

import {Store} from "@ngrx/store";
import {nextStep, updateRegisterData} from "../../../../store/auth.actions";

import {selectRegisterData} from "../../../../store/auth.selectors";
import {PASSWORD_PATTERN} from "apps/Fitness/src/app/core/constants/validation.constants";
import {passwordMatchValidator} from "apps/Fitness/src/app/core/utils/validators.util";

@Component({
    selector: "app-basic-data",
    imports: [FitnessInput, ReactiveFormsModule, RouterLink, TranslatePipe],
    templateUrl: "./basic-data.html",
    styleUrl: "./basic-data.scss",
})
export class BasicData implements OnInit {
    private readonly _translate = inject(TranslateService);
    private readonly _authApiKpService = inject(AuthApiKpService);
    private readonly _messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly _formBuilder = inject(FormBuilder);
    _routeBuilder = inject(RouteBuilderService);
    ROUTES = CLIENT_ROUTES;
    private readonly _router = inject(Router);
    private readonly store = inject(Store);
    basicDataForm!: FormGroup;

    ngOnInit(): void {
        this.frominit();
        // Load saved data from store
        this.store.select(selectRegisterData).subscribe((data) => {
            if (data.firstName || data.email) {
                this.basicDataForm.patchValue({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    password: data.password || "",
                    rePassword: data.rePassword || "",
                });
            }
        });
    }

    frominit() {
        this.basicDataForm = this._formBuilder.group(
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

    onSubmit() {
        if (this.basicDataForm.valid) {
            this.store.dispatch(updateRegisterData({data: this.basicDataForm.value}));
            this.store.dispatch(nextStep());
        }
    }
}
