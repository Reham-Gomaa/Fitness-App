import {Component, inject, OnInit, signal, WritableSignal} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Panel} from "../business/panel/panel";
import {NavTabs} from "../navTabs/navTabs";

@Component({
    selector: "app-details",
    imports: [Panel, NavTabs],
    templateUrl: "./details.html",
    styleUrl: "./details.scss",
})
export class Details implements OnInit {
    private activatedRoute = inject(ActivatedRoute);

    id: WritableSignal<string> = signal<string>("");

    //to decide which api to call
    cat: WritableSignal<string> = signal<string>("");

    ngOnInit(): void {
        this.getItemId();
    }

    getItemId() {
        this.activatedRoute.paramMap.subscribe((res) => {
            this.id.set(res.get("id") as string);
            this.cat.set(res.get("cat") as string);
        });
    }
}
