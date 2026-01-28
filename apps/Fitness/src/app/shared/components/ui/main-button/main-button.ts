import {ChangeDetectionStrategy, Component, inject, input, signal} from "@angular/core";
import {Router} from "@angular/router";
import {CLIENT_ROUTES} from "./../../../../core/constants/client-routes";
import {StorageKeys} from "./../../../../core/constants/storage.config";

@Component({
    selector: "app-main-button",
    imports: [],
    templateUrl: "./main-button.html",
    styleUrl: "./main-button.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainButton {
    private readonly router = inject(Router);

    btnText = input.required<string>();
    btnIcon = input<string>();
    fontWeight = input<string>();
    customClass = input<string>();
    fireStartExplore = input<"start" | "explore" | "bot">("start");

    private readonly isLoggedIn = signal(false);

    private checkAuthStatus(): void {
        const token = localStorage.getItem(StorageKeys.TOKEN);
        this.isLoggedIn.set(!!token);
    }

    private getCurrentLang(): string {
        const lang = localStorage.getItem(StorageKeys.LANGUAGE) || "en";
        return lang.toLowerCase();
    }

    getFired(): void {
        if (this.fireStartExplore() === "bot") {
            return;
        }
        this.checkAuthStatus();
        if (this.isLoggedIn()) {
            if (this.fireStartExplore() === "start") {
                this.getStarted();
            } else {
                this.exploreMore();
            }
        } else {
            this.goToRegistration();
        }
    }

    private goToRegistration(): void {
        this.router.navigate([
            this.getCurrentLang(),
            CLIENT_ROUTES.auth.base,
            CLIENT_ROUTES.auth.register,
        ]);
    }

    private getStarted(): void {
        this.router.navigate([
            this.getCurrentLang(),
            CLIENT_ROUTES.main.base,
            CLIENT_ROUTES.main.classes,
        ]);
    }

    private exploreMore(): void {
        this.router.navigate([
            this.getCurrentLang(),
            CLIENT_ROUTES.main.base,
            CLIENT_ROUTES.main.meals,
        ]);
    }
}
