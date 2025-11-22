import {Component, inject} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ThemeService} from "@fitness-app/services";
import {ToastModule} from "primeng/toast";

@Component({
    imports: [RouterModule, ToastModule],
    selector: "app-root",
    templateUrl: "./app.html",
    styleUrl: "./app.scss",
})
export class App {
    protected title = "Fitness";
    protected readonly _themeService = inject(ThemeService);
}
