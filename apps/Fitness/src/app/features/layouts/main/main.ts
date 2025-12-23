import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Navbar } from "./components/navbar/navbar";
import { Footer } from "./components/footer/footer";
import { HorizontalCarousel } from "../../../shared/components/ui/horizontalCarousel/horizontalCarousel";
import { CLIENT_ROUTES } from "../../../core/constants/client-routes";
import { ChatBot } from "../../pages/chat-bot/chat-bot";

@Component({
    selector: "app-main",
    imports: [Navbar, Footer, RouterModule, HorizontalCarousel, CommonModule, ChatBot],
    templateUrl: "./main.html",
    styleUrl: "./main.scss",
})
export class Main {
    constructor(private router: Router) {}

    // Check if current route is the accounts page
    isAccountsPage(): boolean {
        return this.router.url.includes(CLIENT_ROUTES.main.account);
    }
}
