import {NgOptimizedImage} from "@angular/common";
import {Component, input} from "@angular/core";

@Component({
    selector: "app-title",
    imports: [NgOptimizedImage],
    templateUrl: "./title.html",
    styleUrl: "./title.scss",
})
export class Title {
    titleImg = input<string>("");
    titleTxt = input.required<string>();
    imgW = input<string>("100");
    imgH = input<string>("100");
    containerClass = input<string>("w-fit mx-auto");
    justifyCenter = input<boolean>(true);
}
