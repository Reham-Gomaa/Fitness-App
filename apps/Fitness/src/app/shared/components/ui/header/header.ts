import {ChangeDetectionStrategy, Component, input} from "@angular/core";

@Component({
    selector: "app-header",
    imports: [],
    templateUrl: "./header.html",
    styleUrl: "./header.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
    containerClass = input<string>("text-center mx-auto w-12 xl:w-8");
}
