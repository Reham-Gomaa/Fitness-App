import {NgOptimizedImage} from "@angular/common";
import {Component, inject, signal, WritableSignal} from "@angular/core";
import {SeoService} from "./../../../../../core/services/seo/seo.service";
import {TranslatePipe} from "@ngx-translate/core";

export interface trainersKeys {
    name: string;
    width: number;
    height: number;
    ratio: number;
}
export interface servicesKeys {
    header: string;
    paragraph1: string;
    paragraph2: string;
}

@Component({
    selector: "app-about-us",
    imports: [NgOptimizedImage, TranslatePipe],
    templateUrl: "./about-us.html",
    styleUrl: "./about-us.scss",
})
export class AboutUs {
    private seo = inject(SeoService);

    constructor() {
        this.seo.update(
            "About Us | FitZone",
            "Learn more about FitZone – empowering you to achieve your fitness goals with certified trainers, top equipment, and a supportive community."
        );
    }

    trainers: WritableSignal<trainersKeys[]> = signal([
        {
            name: "trainer-3",
            width: 358,
            height: 537.1,
            ratio: 1333 / 2000,
        },
        {
            name: "trainer-1",
            width: 353,
            height: 529.6,
            ratio: 1333 / 2000,
        },
        {
            name: "trainer-2",
            width: 222,
            height: 148,
            ratio: 444 / 296,
        },
    ]);

    services: WritableSignal<servicesKeys[]> = signal([
        {
            header: "about.service1.header",
            paragraph1: "about.service1.paragraph1",
            paragraph2: "about.service1.paragraph2",
        },
        {
            header: "about.service2.header",
            paragraph1: "about.service2.paragraph1",
            paragraph2: "about.service2.paragraph2",
        },
        {
            header: "about.service3.header",
            paragraph1: "about.service3.paragraph1",
            paragraph2: "about.service3.paragraph2",
        },
        {
            header: "about.service4.header",
            paragraph1: "about.service4.paragraph1",
            paragraph2: "about.service4.paragraph2",
        },
    ]);
}
