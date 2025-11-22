import {Component, inject, input} from "@angular/core";
// Services
import {ThemeService} from "@fitness-app/services";
//PrimeNg
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";

@Component({
    selector: "lib-button-theme",
    imports: [ButtonModule, TooltipModule],
    templateUrl: "./button-theme.html",
    styleUrl: "./button-theme.scss",
})
export class ButtonTheme {
    spacing = input<boolean>(true);
    themeService = inject(ThemeService);
    toggle() {
        this.themeService.toggle();
    }
}
