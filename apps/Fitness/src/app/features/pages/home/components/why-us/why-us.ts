import {NgOptimizedImage} from "@angular/common";
import {ChangeDetectionStrategy, Component, signal} from "@angular/core";
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
    standalone: true,
    imports: [NgOptimizedImage, TranslatePipe, Title, Header],
    templateUrl: "./why-us.html",
    styleUrl: "./why-us.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyUs {
    readonly steps = signal<StepsKeys[]>([
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

    readonly trainersCol1 = signal<TrainersKeys[]>([
        {
            name: "trainer-1",
            width: 291,
            height: 194, // 2000x1333 intrinsic means 1.5 AR. 291 / 1.5 = 194.
            alt: "why-us.sr-only.trainer-1.alt",
            specialty: "why-us.sr-only.trainer-1.speciality",
            description: "why-us.sr-only.trainer-1.description",
        },
        {
            name: "trainer-2",
            width: 291,
            height: 344, // 291x344 intrinsic means 0.85 AR.
            alt: "why-us.sr-only.trainer-2.alt",
            specialty: "why-us.sr-only.trainer-2.speciality",
            description: "why-us.sr-only.trainer-2.description",
        },
    ]);

    readonly trainersCol2 = signal<TrainersKeys[]>([
        {
            name: "trainer-3",
            width: 291,
            height: 274, // 304x286 intrinsic means 1.06 AR. 291 / 1.06 = 274.
            alt: "why-us.sr-only.trainer-3.alt",
            specialty: "why-us.sr-only.trainer-3.speciality",
            description: "why-us.sr-only.trainer-3.description",
        },
        {
            name: "trainer-4",
            width: 291,
            height: 194, // 2000x1333 intrinsic means 1.5 AR. 291 / 1.5 = 194.
            alt: "why-us.sr-only.trainer-4.alt",
            specialty: "why-us.sr-only.trainer-4.speciality",
            description: "why-us.sr-only.trainer-4.description",
        },
    ]);
}
