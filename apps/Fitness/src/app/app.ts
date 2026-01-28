import {Component, inject} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ThemeService} from "@fitness-app/services";
import {ToastModule} from "primeng/toast";
import {Bot} from "./features/pages/chat-bot/bot/bot";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    imports: [RouterModule, ToastModule, Bot, CommonModule, TranslateModule],
    selector: "app-root",
    templateUrl: "./app.html",
    styleUrl: "./app.scss",
})
export class App {
    protected title = "Fitness";
    protected readonly _themeService = inject(ThemeService);

    onClose(): void {
        // This is a placeholder for the custom template close button
        // PrimeNG handles message removal automatically if the icon is clicked
    }
}
