import {Component, DestroyRef, inject, OnInit, signal} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Store} from "@ngrx/store";
import {
    submitRegistration,
    registerSuccess,
    registerFailure,
    prevStep,
    updateRegisterData,
    resetRegisterState,
} from "../../../../store/auth.actions";
import {FitnessFormRadio, RadioItem} from "@fitness-app/fitness-form";
import {selectRegisterData, selectAuthLoading} from "../../../../store/auth.selectors";
import {MessageService} from "primeng/api";
import {Actions, ofType} from "@ngrx/effects";
import {Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {tap} from "rxjs/operators";
import {CLIENT_ROUTES} from "apps/Fitness/src/app/core/constants/client-routes";
import {RouteBuilderService} from "apps/Fitness/src/app/core/services/router/route-builder.service";

@Component({
    selector: "app-select-activity-level",
    standalone: true,
    imports: [CommonModule, TranslatePipe, FitnessFormRadio],
    templateUrl: "./select-activity-level.html",
    styleUrl: "./select-activity-level.scss",
})
export class SelectActivityLevelComponent implements OnInit {
    private readonly store = inject(Store);
    private readonly messageService = inject(MessageService);
    private readonly translate = inject(TranslateService);
    private readonly actions$ = inject(Actions);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly routeBuilder = inject(RouteBuilderService);

    activityLevel = signal<string>("level1");
    isLoading = this.store.selectSignal(selectAuthLoading);

    activityOptions: RadioItem[] = [
        {value: "level1", label: "register.selectActivity.options.rookie"},
        {value: "level2", label: "register.selectActivity.options.beginner"},
        {value: "level3", label: "register.selectActivity.options.intermediate"},
        {value: "level4", label: "register.selectActivity.options.advance"},
        {value: "level5", label: "register.selectActivity.options.trueBeast"},
    ];

    ngOnInit(): void {
        this.loadSavedActivityLevel();
        this.listenToRegistrationSuccess();
        this.listenToRegistrationFailure();
    }

    onActivityChange(level: string): void {
        this.activityLevel.set(level);
        this.store.dispatch(updateRegisterData({data: {activityLevel: level}}));
    }

    back(): void {
        this.store.dispatch(prevStep());
    }

    submit(): void {
        this.store.dispatch(updateRegisterData({data: {activityLevel: this.activityLevel()}}));
        this.store.dispatch(submitRegistration());
    }

    private loadSavedActivityLevel(): void {
        this.store
            .select(selectRegisterData)
            .pipe(
                tap((data) => {
                    if (data.activityLevel) {
                        this.activityLevel.set(data.activityLevel);
                    } else {
                        this.store.dispatch(
                            updateRegisterData({data: {activityLevel: this.activityLevel()}})
                        );
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    private listenToRegistrationSuccess(): void {
        this.actions$
            .pipe(
                ofType(registerSuccess),
                tap(() => {
                    this.showSuccessToast();
                    this.navigateToLogin();
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    private listenToRegistrationFailure(): void {
        this.actions$
            .pipe(
                ofType(registerFailure),
                tap((action) => this.showErrorToast(action.error)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    private showSuccessToast(): void {
        this.messageService.add({
            severity: "success",
            summary: this.translate.instant("register.success.title"),
            detail: this.translate.instant("register.success.message"),
        });
    }

    private showErrorToast(error?: string): void {
        this.messageService.add({
            severity: "error",
            summary: this.translate.instant("register.error.title"),
            detail: error || this.translate.instant("register.error.message"),
        });
    }

    private navigateToLogin(): void {
        this.router
            .navigate(
                this.routeBuilder.buildPath(CLIENT_ROUTES.auth.base, CLIENT_ROUTES.auth.login)
            )
            .then(() => {
                this.store.dispatch(resetRegisterState());
            });
    }
}
