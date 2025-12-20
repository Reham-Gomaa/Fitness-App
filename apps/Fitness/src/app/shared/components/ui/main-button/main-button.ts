import {Component, inject, input, InputSignal, signal, WritableSignal} from "@angular/core";
import {Router} from "@angular/router";
import {CLIENT_ROUTES} from "./../../../../core/constants/client-routes";
import {StorageKeys} from "./../../../../core/constants/storage.config";

@Component({
    selector: "app-main-button",
    imports: [],
    templateUrl: "./main-button.html",
    styleUrl: "./main-button.scss",
})
export class MainButton {
    private _router = inject(Router);

    btnText = input.required<string>();
    btnIcon = input<string>();
    fontWeight = input<string>();
    customClass = input<string>();

    fireStartExplore: InputSignal<"start" | "explore"> = input<"start" | "explore">("start");
    isLoggedIn: WritableSignal<boolean> = signal(false);

    private checkAuthStatus() {
        const token = localStorage.getItem(StorageKeys.TOKEN);
        this.isLoggedIn.set(!!token);
    }

    getCurrentLang(): string {
        const lang = localStorage.getItem(StorageKeys.LANGUAGE) || "en";
        return lang.toLowerCase();
    }

    getFired() {
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

    goToRegistration() {
        this._router.navigate([
            this.getCurrentLang(),
            CLIENT_ROUTES.auth.base,
            CLIENT_ROUTES.auth.register,
        ]);
    }

    getStarted() {
        this._router.navigate([
            this.getCurrentLang(),
            CLIENT_ROUTES.main.base,
            CLIENT_ROUTES.main.classes,
        ]);
    }

    exploreMore() {
        this._router.navigate([
            this.getCurrentLang(),
            CLIENT_ROUTES.main.base,
            CLIENT_ROUTES.main.meals,
        ]);
    }
}
