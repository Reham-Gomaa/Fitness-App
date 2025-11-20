import { Component, DestroyRef, inject, input, output, signal, effect } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";
import { InputOtpModule } from "primeng/inputotp";
import { AuthApiKpService } from "auth-api-kp";

@Component({
    selector: "app-confirm-otp",
    imports: [ReactiveFormsModule, InputOtpModule],
    templateUrl: "./confirm-otp.html",
    styleUrl: "./confirm-otp.scss",
})
export class ConfirmOtp {
    private readonly _translate = inject(TranslateService);
    private readonly _authApiKpService = inject(AuthApiKpService);
    private readonly _messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    // Zoneless: use input() instead of @Input()
    email = input<string>("");

    // Zoneless: use output() instead of @Output() + EventEmitter
    codeVerified = output<number>();
    goBack = output<void>();

    // State signals
    isLoading = signal<boolean>(false);
    isResending = signal<boolean>(false);
    cooldownSeconds = signal<number>(0);

    // Form
    verifyCodeForm: FormGroup = new FormGroup({
        otpCode: new FormControl("", [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
        ]),
    });





    verifyCodeSubmit(): void {
        if (this.verifyCodeForm.invalid || this.isLoading()) return;

        this.isLoading.set(true);

        const resetCode = this.verifyCodeForm.get("otpCode")?.value;
        const data = { email: this.email(), resetCode };

        this._authApiKpService
            .verifyCode(data)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                this.codeVerified.emit(1234);

                },
                error: () => {
                    this._messageService.add({
                        severity: "error",
                        detail: this._translate.instant("messagesToast.unexpectedError"),
                        life: 3000,
                    });
                },
                complete: () => {
                    this.isLoading.set(false);
                },
            });
    }

    /**
     * Emit goBack signal to parent
     */
    onGoBack(): void {
    }
}


    
