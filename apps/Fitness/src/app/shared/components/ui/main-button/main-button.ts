import {Component, input} from "@angular/core";

@Component({
    selector: "app-main-button",
    imports: [],
    templateUrl: "./main-button.html",
    styleUrl: "./main-button.scss",
})
export class MainButton {
    btnText = input.required<string>();
    btnIcon = input<string>();
    btnBg = input<string>();
    btnColor = input<string>();
    btnBorder = input<string>();
}
