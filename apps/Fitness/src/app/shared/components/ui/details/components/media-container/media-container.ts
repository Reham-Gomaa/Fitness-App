import {Component, input, InputSignal} from "@angular/core";
import {Exercise} from "../../../../../models/exercises";
import {Meal} from "../../../../../models/meals";
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: "app-media-container",
    imports: [NgOptimizedImage],
    templateUrl: "./media-container.html",
    styleUrl: "./media-container.scss",
})
export class MediaContainer {
    type = input.required<"meal" | "class">();
    selectedExercise: InputSignal<Exercise | undefined> = input<Exercise | undefined>(undefined);
    selectedMeal: InputSignal<Meal | undefined> = input<Meal | undefined>(undefined);
}
