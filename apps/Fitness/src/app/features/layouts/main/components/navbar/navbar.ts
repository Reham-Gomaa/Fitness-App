import {
    Component,
    inject,
    OnDestroy,
    OnInit,
    ChangeDetectionStrategy,
    signal,
    computed,
} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {AvatarModule} from "primeng/avatar";
import {MenuModule} from "primeng/menu";
import {StorageKeys} from "../../../../../core/constants/storage.config";
import {CLIENT_ROUTES} from "../../../../../core/constants/client-routes";
import {MainButton} from "./../../../../../shared/components/ui/main-button/main-button";
import {TranslateModule} from "@ngx-translate/core";
import {PlatFormService} from "@fitness-app/services";
import {UserService} from "../../../../pages/account/services/user-service/user-service";

@Component({
    selector: "app-navbar",
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        AvatarModule,
        MenuModule,
        MainButton,
        TranslateModule,
    ],
    templateUrl: "./navbar.html",
    styleUrl: "./navbar.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar implements OnInit, OnDestroy {
    private router = inject(Router);
    private platform = inject(PlatFormService);
    private userService = inject(UserService);

    // Use signals and computed for reactive state
    isLoggedIn = computed(() => {
        const user = this.userService.currentUser();
        if (user) return true;

        // Fallback for initial load if token exists but user profile not yet fetched
        if (this.platform.isBrowser()) {
            return !!localStorage.getItem(StorageKeys.TOKEN);
        }
        return false;
    });

    mobileMenuOpen = signal(false);
    isScrolled = signal(false);

    private boundOnScroll = this.onScroll.bind(this);
    private boundOnStorage = this.onStorageChange.bind(this);

    navItems = [
        {labelKey: "navbar.home", path: CLIENT_ROUTES.main.home},
        {labelKey: "navbar.about", path: CLIENT_ROUTES.main.about},
        {labelKey: "navbar.classes", path: CLIENT_ROUTES.main.classes},
        {labelKey: "navbar.health", path: CLIENT_ROUTES.main.meals},
    ];

    ngOnInit() {
        if (this.platform.isBrowser()) {
            this.userService.getLoggedUserData().subscribe();
            // Use storage event listener instead of polling interval
            window.addEventListener("storage", this.boundOnStorage);
            window.addEventListener("scroll", this.boundOnScroll, {passive: true});
        }
    }

    ngOnDestroy() {
        if (this.platform.isBrowser()) {
            window.removeEventListener("storage", this.boundOnStorage);
            window.removeEventListener("scroll", this.boundOnScroll);
        }
    }

    private onScroll() {
        if (this.platform.isBrowser()) {
            this.isScrolled.set(window.scrollY > 20);
        }
    }

    private onStorageChange(event: StorageEvent) {
        if (event.key === StorageKeys.TOKEN) {
            // Re-fetch user data if token changes in another tab
            this.userService.getLoggedUserData().subscribe();
        }
    }

    getCurrentLang(): string {
        if (this.platform.isBrowser()) {
            const lang = localStorage.getItem(StorageKeys.LANGUAGE) || "en";
            return lang.toLowerCase();
        }
        return "en";
    }

    getRoute(path: string) {
        return [path];
    }

    toggleMobileMenu() {
        this.mobileMenuOpen.update((open) => !open);

        if (this.mobileMenuOpen()) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }

    onLogin() {
        this.router.navigate([
            this.getCurrentLang(),
            CLIENT_ROUTES.auth.base,
            CLIENT_ROUTES.auth.login,
        ]);
        this.closeMobileMenu();
    }

    onSignup() {
        this.router.navigate([
            this.getCurrentLang(),
            CLIENT_ROUTES.auth.base,
            CLIENT_ROUTES.auth.register,
        ]);
        this.closeMobileMenu();
    }

    navigateToAccount() {
        this.router.navigate([this.getCurrentLang(), "main", CLIENT_ROUTES.main.account]);
        this.closeMobileMenu();
    }

    logout() {
        this.userService.logout().subscribe({
            next: () => {
                this.closeMobileMenu();
                this.router.navigate([this.getCurrentLang(), "main", CLIENT_ROUTES.main.home]);
            },
        });
    }

    closeMobileMenu() {
        this.mobileMenuOpen.set(false);
        document.body.style.overflow = "";
    }
}
