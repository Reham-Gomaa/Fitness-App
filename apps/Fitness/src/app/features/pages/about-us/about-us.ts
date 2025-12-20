import {NgOptimizedImage} from "@angular/common";
import {Component, inject, OnInit, signal, WritableSignal} from "@angular/core";
import {TranslatePipe} from "@ngx-translate/core";
import {Router} from "@angular/router";
// Reusable_Components
import {Header} from "./../../../shared/components/ui/header/header";
import {Title} from "./../../../shared/components/ui/title/title";
import {MainButton} from "./../../../shared/components/ui/main-button/main-button";
// Constants
import {CLIENT_ROUTES} from "./../../../core/constants/client-routes";
import {StorageKeys} from "./../../../core/constants/storage.config";

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
    imports: [NgOptimizedImage, TranslatePipe, Header, Title, MainButton],
    templateUrl: "./about-us.html",
    styleUrl: "./about-us.scss",
})
export class AboutUs implements OnInit {
    private _router = inject(Router);

    ngOnInit(): void {
        this.getLocation();
    }

    getLocation() {
        return this._router.url.includes("home");
    }

    readonly trainers: WritableSignal<trainersKeys[]> = signal([
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

    readonly services: WritableSignal<servicesKeys[]> = signal([
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
