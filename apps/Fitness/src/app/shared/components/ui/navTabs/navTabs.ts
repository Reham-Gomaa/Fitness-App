import {Component, input, output, OutputEmitterRef} from "@angular/core";
import {Skeleton} from "primeng/skeleton";
import {navItem} from "../../../models/navItem";

@Component({
    selector: "app-nav-tabs",
    imports: [Skeleton],
    templateUrl: "./navTabs.html",
    styleUrl: "./navTabs.scss",
})
export class NavTabs {
    navItems = input<navItem[]>();
    isInPanel = input<boolean>(false);
    navItemClick: OutputEmitterRef<navItem> = output();

    makeArr(l: number) {
        return Array.from({length: l});
    }

    itemClickEmit(e: PointerEvent, item: navItem) {
        e.preventDefault();
        this.navItemClick.emit(item);
    }
}
