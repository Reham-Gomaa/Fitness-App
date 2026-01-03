import {Component, inject, OnDestroy, OnInit, PLATFORM_ID, Inject} from "@angular/core";
import {CommonModule, isPlatformBrowser} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {AvatarModule} from "primeng/avatar";
import {MenuModule} from "primeng/menu";
import {MenuItem} from "primeng/api";
import {StorageKeys} from "../../../../../core/constants/storage.config";
import {CLIENT_ROUTES} from "../../../../../core/constants/client-routes";
import {MainButton} from "./../../../../../shared/components/ui/main-button/main-button";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
    selector: "app-navbar",
    standalone: true,
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
})
export class Navbar implements OnInit, OnDestroy {
    private router = inject(Router);
    private translate = inject(TranslateService);
    private isBrowser: boolean;

    isLoggedIn = false;
    mobileMenuOpen = false;
    private authCheckInterval: any;
    isScrolled = false;

    navItems = [
        {labelKey: "navbar.home", path: CLIENT_ROUTES.main.home},
        {labelKey: "navbar.about", path: CLIENT_ROUTES.main.about},
        {labelKey: "navbar.classes", path: CLIENT_ROUTES.main.classes},
        {labelKey: "navbar.health", path: CLIENT_ROUTES.main.meals},
    ];

    accountMenuItems: MenuItem[] = [
        {
            label: "Account",
            icon: "pi pi-user",
            command: () => this.navigateToAccount(),
        },
        {
            label: "Logout",
            icon: "pi pi-sign-out",
            command: () => this.logout(),
        },
    ];

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngOnInit() {
        this.checkAuthStatus();
        
       
        if (this.isBrowser) {
            this.authCheckInterval = setInterval(() => {
                this.checkAuthStatus();
            }, 1000);

            window.addEventListener("scroll", this.onScroll.bind(this));
        }
    }

    ngOnDestroy() {
       
        if (this.isBrowser) {
            if (this.authCheckInterval) {
                clearInterval(this.authCheckInterval);
            }
            window.removeEventListener("scroll", this.onScroll.bind(this));
        }
    }

    private onScroll() {
        if (this.isBrowser) {
            this.isScrolled = window.scrollY > 20;
        }
    }

    private checkAuthStatus() {
       
        if (this.isBrowser) {
            const token = localStorage.getItem(StorageKeys.TOKEN);
            this.isLoggedIn = !!token;
        }
    }

    getCurrentLang(): string {
        
        if (this.isBrowser) {
            const lang = localStorage.getItem(StorageKeys.LANGUAGE) || "en";
            return lang.toLowerCase();
        }
        return "en";
    }

    getRoute(path: string) {
        return [path];
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;

       
        if (this.isBrowser) {
            if (this.mobileMenuOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
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
       
        if (this.isBrowser) {
            localStorage.removeItem(StorageKeys.TOKEN);
        }
        this.checkAuthStatus();
        this.closeMobileMenu();
        this.router.navigate([this.getCurrentLang(), "main", CLIENT_ROUTES.main.home]);
    }

    closeMobileMenu() {
        this.mobileMenuOpen = false;
      
        if (this.isBrowser) {
            document.body.style.overflow = "";
        }
    }
}