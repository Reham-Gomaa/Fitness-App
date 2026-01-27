import {NgOptimizedImage} from "@angular/common";
import {Component, input} from "@angular/core";
import {RouterLink} from "@angular/router";
import {cardInfo} from "../../../models/card";

@Component({
    selector: "app-main-card",
    imports: [NgOptimizedImage, RouterLink],
    templateUrl: "./main-card.html",
    styleUrl: "./main-card.scss",
})
export class MainCard {
    item = input<cardInfo>();
}
