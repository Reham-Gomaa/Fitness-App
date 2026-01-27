import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {Router, RouterModule} from "@angular/router";
import {CLIENT_ROUTES} from "../../../core/constants/client-routes";
import {HorizontalCarousel} from "../../../shared/components/ui/horizontalCarousel/horizontalCarousel";
import {Footer} from "./components/footer/footer";
import {Navbar} from "./components/navbar/navbar";

@Component({
    selector: "app-main",
    imports: [Navbar, Footer, RouterModule, HorizontalCarousel],
    templateUrl: "./main.html",
    styleUrl: "./main.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Main {
    private router = inject(Router);

    /**
     * Check if current route is the accounts page
     */
    isAccountsPage(): boolean {
        return this.router.url.includes(CLIENT_ROUTES.main.account);
    }
}
