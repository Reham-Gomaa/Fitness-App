import {Component, DestroyRef, inject, input, output, signal, effect} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateService, TranslatePipe} from "@ngx-translate/core";
import {MessageService} from "primeng/api";
import {InputOtpModule} from "primeng/inputotp";
import {AuthApiKpService, ErrorResponse, VerifyResetCodeResponse} from "auth-api-kp";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: "app-confirm-otp",
    imports: [ReactiveFormsModule, InputOtpModule, TranslatePipe],
    templateUrl: "./confirm-otp.html",
    styleUrl: "./confirm-otp.scss",
})
export class ConfirmOtp {
    private readonly _translate = inject(TranslateService);
    private readonly _authApiKpService = inject(AuthApiKpService);
    private readonly _messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    email = input<string>("");

    codeVerified = output<string>();
    goBack = output<void>();

    // State signals
    isLoading = signal<boolean>(false);
    resendCooldown = signal<number>(0);

    // Form
    verifyCodeForm: FormGroup = new FormGroup({
        otpCode: new FormControl("", [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
        ]),
    });

    ngOnInit(): void {
        this.startCooldown();
    }

    verifyCodeSubmit(): void {
        if (this.verifyCodeForm.invalid || this.isLoading()) return;

        this.isLoading.set(true);

        const resetCode = this.verifyCodeForm.get("otpCode")?.value;
        const data = {email: this.email(), resetCode};

        this._authApiKpService
            .verifyCode(data)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: VerifyResetCodeResponse | ErrorResponse) => {
                    if ("error" in res) {
                        this._messageService.add({
                            severity: "error",
                            detail: (res as ErrorResponse).error,
                            life: 3000,
                        });
                    } else {
                        this._messageService.add({
                            severity: "success",
                            detail: this._translate.instant("messagesToast.otpVerified"),
                            life: 5000,
                        });

                        this.codeVerified.emit(res.status);
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

    resendCode(): void {
        if (this.isLoading() || this.resendCooldown() > 0) return;

        this.isLoading.set(true);

        this._authApiKpService
            .forgetPassword({email: this.email()})
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: any) => {
                    if ("error" in res) {
                        this._messageService.add({
                            severity: "error",
                            detail: (res as ErrorResponse).error,
                            life: 3000,
                        });
                    } else {
                        this._messageService.add({
                            severity: "success",
                            detail: this._translate.instant("messagesToast.codeResent"),
                            life: 5000,
                        });
                        this.startCooldown();
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

    private startCooldown(): void {
        this.resendCooldown.set(30);
        const interval = setInterval(() => {
            this.resendCooldown.update((v) => v - 1);
            if (this.resendCooldown() <= 0) {
                clearInterval(interval);
            }
        }, 1000);
    }

    /**
     * Emit goBack signal to parent
     */
    onGoBack(): void {}
}
