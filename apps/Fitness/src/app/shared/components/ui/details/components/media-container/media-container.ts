import {Component, input} from "@angular/core";

@Component({
    selector: "app-media-container",
    imports: [],
    templateUrl: "./media-container.html",
    styleUrl: "./media-container.scss",
})
export class MediaContainer {
  type = input.required<'meal'|'class'>()
}
