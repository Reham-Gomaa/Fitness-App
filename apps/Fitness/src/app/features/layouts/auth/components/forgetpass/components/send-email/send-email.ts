import {Component, DestroyRef, EventEmitter, inject, output, Output, signal} from "@angular/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TranslateService, TranslatePipe} from "@ngx-translate/core";
import {AuthApiKpService, ErrorResponse, ForgotPasswordResponse, SignInResponse} from "auth-api-kp";
import {MessageService} from "primeng/api";
import {FitnessInput} from "@fitness-app/fitness-form";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: "app-send-email",
    imports: [FitnessInput, ReactiveFormsModule, TranslatePipe],
    templateUrl: "./send-email.html",
    styleUrl: "./send-email.scss",
})
export class SendEmail {
    private readonly _translate = inject(TranslateService);
    private readonly _authApiKpService = inject(AuthApiKpService);
    private readonly _messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    emailSubmitted = output<string>();

    isLoading = signal<boolean>(false);

    forgetPassForm: FormGroup = new FormGroup({
        email: new FormControl("", [Validators.required, Validators.email]),
    });

    forgetpasswordSubmit(): void {
        if (this.forgetPassForm.invalid || this.isLoading()) return;

        this.isLoading.set(true);
        const email = this.forgetPassForm.get("email")?.value ?? "";

        this._authApiKpService
            .forgetPassword(this.forgetPassForm.value)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: ForgotPasswordResponse | ErrorResponse) => {
                    if ("error" in res) {
                        this._messageService.add({
                            severity: "error",
                            detail: (res as ErrorResponse).error,
                            life: 3000,
                        });
                    } else {
                        this.emailSubmitted.emit(email);
                        this._messageService.add({
                            severity: "success",
                            detail: this._translate.instant("messagesToast.codeResent"),
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
