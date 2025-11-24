import {Component} from "@angular/core";
import {Navbar} from "./components/navbar/navbar";
import {Footer} from "./components/footer/footer";
import {RouterModule} from "@angular/router";
import {ButtonTheme} from "@fitness-app/buttons";
import { HorizontalCarousel } from "../../../shared/components/ui/horizontalCarousel/horizontalCarousel";

@Component({
    selector: "app-main",
    imports: [Navbar, Footer, RouterModule, ButtonTheme, HorizontalCarousel],
    templateUrl: "./main.html",
    styleUrl: "./main.scss",
})
export class Main {}
