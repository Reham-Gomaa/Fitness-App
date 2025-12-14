// Core
import {Component, effect, input, output, signal} from "@angular/core";
import {NgOptimizedImage} from "@angular/common";
// enums
import {Gender} from "../../enums/gender";
@Component({
    selector: "lib-fitness-input-gender",
    imports: [NgOptimizedImage],
    templateUrl: "./fitness-input-gender.html",
    styleUrl: "./fitness-input-gender.scss",
})
export class FitnessInputGender {
    genderChange = output<Gender>();
    initialGender = input<Gender>(Gender.Male);

    gender = signal<Gender>(Gender.Male);

    Gender = Gender;

    constructor() {
        effect(() => {
            this.gender.set(this.initialGender());
        });
    }

    genderChangeHandler(gender: Gender) {
        this.gender.set(gender);
        this.genderChange.emit(gender);
    }
}
