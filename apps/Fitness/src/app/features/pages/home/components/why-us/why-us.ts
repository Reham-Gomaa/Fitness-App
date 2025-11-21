import {NgOptimizedImage} from "@angular/common";
import {Component, signal, WritableSignal} from "@angular/core";
import {TranslatePipe} from "@ngx-translate/core";
import {Title} from "./../../../../../shared/components/ui/title/title";
import {Header} from "./../../../../../shared/components/ui/header/header";

export interface StepsKeys {
    id: string;
    header: string;
    paragraph: string;
}
export interface TrainersKeys {
    name: string;
    width: number;
    height: number;
    alt: string;
    specialty: string;
    description: string;
}

@Component({
    selector: "app-why-us",
    imports: [NgOptimizedImage, TranslatePipe, Title, Header],
    templateUrl: "./why-us.html",
    styleUrl: "./why-us.scss",
})
export class WhyUs {
    readonly steps: WritableSignal<StepsKeys[] | undefined> = signal([
        {
            id: "why-us.step1.id",
            header: "why-us.step1.header",
            paragraph: "why-us.step1.paragraph",
        },
        {
            id: "why-us.step2.id",
            header: "why-us.step2.header",
            paragraph: "why-us.step2.paragraph",
        },
        {
            id: "why-us.step3.id",
            header: "why-us.step3.header",
            paragraph: "why-us.step3.paragraph",
        },
    ]);
    readonly trainersCol1: WritableSignal<TrainersKeys[] | undefined> = signal([
        {
            name: "trainer-1",
            width: 2000,
            height: 1333,
            alt: "Certified personal trainer guiding client through customized workout routine",
            specialty: "personal training",
            description: "Expert trainer focusing on individualized fitness programs",
        },
        {
            name: "trainer-2",
            width: 291,
            height: 344,
            alt: "Experienced trainer assisting with advanced fitness equipment usage",
            specialty: "equipment training",
            description: "Expert in modern gym equipment and functional training",
        },
    ]);
    readonly trainersCol2: WritableSignal<TrainersKeys[] | undefined> = signal([
        {
            name: "trainer-3",
            width: 304,
            height: 286,
            alt: "Fitness instructor demonstrating proper strength training technique",
            specialty: "strength training",
            description: "Specialized in weight lifting and muscle building techniques",
        },
        {
            name: "trainer-4",
            width: 2000,
            height: 1333,
            alt: "Professional fitness coach demonstrating proper exercise form and technique",
            specialty: "exercise technique",
            description: "Specialized in form correction and movement optimization",
        },
    ]);
}
