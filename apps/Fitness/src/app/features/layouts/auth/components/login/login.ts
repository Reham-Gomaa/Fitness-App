import {OnInit} from "@angular/core";
// Core
import {Component, DestroyRef, inject, signal} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {HttpErrorResponse} from "@angular/common/http";
// Forms
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from "@angular/forms";
// i18n
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
// Shared-components
import {FitnessInput} from "@fitness-app/fitness-form";

// Prime ng
import {MessageService} from "primeng/api";

// Router
import {Router, RouterLink} from "@angular/router";
import {CLIENT_ROUTES} from "../../../../../core/constants/client-routes";
// package
import {AuthApiKpService, ErrorResponse, SignInResponse} from "auth-api-kp";
// Router
import {RouteBuilderService} from "../../../../../core/services/router/route-builder.service";
// Local Storage Keys
import {StorageKeys} from "../../../../../core/constants/storage.config";
@Component({
    selector: "app-login",
    imports: [ReactiveFormsModule, FitnessInput, TranslatePipe, RouterLink],
    templateUrl: "./login.html",
    styleUrl: "./login.scss",
})
export class Login implements OnInit {
    // Denpendency Injection
    private readonly formBuilder = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);
    private readonly _authApiKpService = inject(AuthApiKpService);
    private readonly _router = inject(Router);
    public _messageService = inject(MessageService);
    private readonly _translate = inject(TranslateService);
    _routeBuilder = inject(RouteBuilderService);
    ROUTES = CLIENT_ROUTES;
    isLoading = signal<boolean>(false);

    ngOnInit(): void {
        console.log(
            ["/", this.currentLang, this.ROUTES.auth.base, this.ROUTES.auth.forgetpass].join("/")
        );
    }

    get currentLang(): string {
        return this._translate.getCurrentLang();
    }

    loginForm: FormGroup = this.formBuilder.group({
        email: ["", [Validators.required, Validators.email]],
        password: [
            "",
            [
                Validators.required,
                Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&\\)]).{8,}$"),
            ],
        ],
    });

    submit() {
        if (this.loginForm.valid) {
            console.log("Form Data:", this.loginForm.value);
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    saveToken(token: string): void {
        localStorage.setItem(StorageKeys.TOKEN, token);
    }

    LoginSubmit(): void {
        if (this.loginForm.invalid || this.isLoading()) return;

        this.isLoading.set(true);
        this._authApiKpService
            .login(this.loginForm.value)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: SignInResponse | ErrorResponse) => {
                    if ("error" in res) {
                        this._messageService.add({
                            severity: "error",
                            detail: (res as ErrorResponse).error,
                            life: 3000,
                        });
                        return;
                    }

                    const successRes = res as SignInResponse & {message?: string};

                    // persist token for authenticated requests
                    this.saveToken(successRes.token);

                    const message =
                        successRes.message || this._translate.instant("messagesToast.loginSuccess");
                    this._messageService.add({
                        severity: "success",
                        detail: message,
                        life: 5000,
                    });
                    this._router.navigate(["/"]);
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
