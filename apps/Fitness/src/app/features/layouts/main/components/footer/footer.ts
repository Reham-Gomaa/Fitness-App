import {ChangeDetectionStrategy, Component} from "@angular/core";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: "app-footer",
    imports: [TranslatePipe],
    templateUrl: "./footer.html",
    styleUrl: "./footer.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {}
