import {Component, inject, signal, DestroyRef, input, output} from "@angular/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TranslateService, TranslatePipe} from "@ngx-translate/core";
import {FitnessInput} from "@fitness-app/fitness-form";
import {MessageService} from "primeng/api";
import {AuthApiKpService, ErrorResponse, ResetPasswordResponse} from "auth-api-kp";
import {HttpErrorResponse} from "@angular/common/http";
import {PASSWORD_PATTERN} from "../../../../../../../core/constants/validation.constants";
import {passwordMatchValidator} from "../../../../../../../core/utils/validators.util";

@Component({
    selector: "app-create-new-pass",
    imports: [ReactiveFormsModule, FitnessInput, TranslatePipe],
    templateUrl: "./create-new-pass.html",
    styleUrl: "./create-new-pass.scss",
})
export class CreateNewPass {
    private readonly _translate = inject(TranslateService);
    private readonly _authApiKpService = inject(AuthApiKpService);
    private readonly _messageService = inject(MessageService);
    private readonly _router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    email = input<string>("");
    passwordReset = output<void>();

    isLoading = signal<boolean>(false);

    resetPasswordForm = new FormGroup(
        {
            password: new FormControl("", [
                Validators.required,
                Validators.pattern(PASSWORD_PATTERN),
            ]),
            confirmPassword: new FormControl("", Validators.required),
        },
        {validators: passwordMatchValidator("password", "confirmPassword")}
    );

    ngOnInit(): void {
        // Must call signal as function
        if (!this.email()) {
            this._router.navigate(["/forget-pass"]);
        }
    }

    resetPasswordSubmit(): void {
        if (this.resetPasswordForm.invalid) {
            this.resetPasswordForm.markAllAsTouched();
            return;
        }

        const newPassword = this.resetPasswordForm.get("password")?.value;
        if (!newPassword) return;

        this.isLoading.set(true);

        this._authApiKpService
            .resetPassword({
                email: this.email(),
                newPassword,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: ResetPasswordResponse | ErrorResponse) => {
                    if ("error" in res) {
                        this._messageService.add({
                            severity: "error",
                            detail: res.error,
                            life: 3000,
                        });
                    } else {
                        this.passwordReset.emit();
                        this._messageService.add({
                            severity: "success",
                            detail: this._translate.instant("messagesToast.resetSuccess"),
                            life: 5000,
                        });
                    }
                },
                error: (err: HttpErrorResponse) => {
                    this._messageService.add({
                        severity: "error",
                        detail: err.error,
                        life: 5000,
                    });
                },
                complete: () => {
                    this.isLoading.set(false);
                },
            });
    }
}
