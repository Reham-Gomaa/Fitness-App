import {Component} from "@angular/core";
import {Header} from "./../../../../../shared//components/ui/header/header";
import {MainButton} from "./../../../../../shared/components/ui/main-button/main-button";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: "app-hero-section",
    imports: [Header, MainButton, TranslatePipe],
    templateUrl: "./hero-section.html",
    styleUrl: "./hero-section.scss",
})
export class HeroSection {
    statistics = [
        {
            num: "hero.statistics.index0.number",
            desc: "hero.statistics.index0.text",
        },
        {
            num: "hero.statistics.index1.number",
            desc: "hero.statistics.index1.text",
        },
        {
            num: "hero.statistics.index2.number",
            desc: "hero.statistics.index2.text",
        },
    ];
}
