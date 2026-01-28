import {ChangeDetectionStrategy, Component, input, output} from "@angular/core";
import {Skeleton} from "primeng/skeleton";
import {navItem} from "../../../models/navItem";

@Component({
    selector: "app-nav-tabs",
    imports: [Skeleton],
    templateUrl: "./navTabs.html",
    styleUrl: "./navTabs.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavTabs {
    navItems = input<navItem[]>();
    isInPanel = input<boolean>(false);
    navItemClick = output<navItem>();

    makeArr(length: number): undefined[] {
        return Array.from({length});
    }

    itemClickEmit(event: PointerEvent, item: navItem): void {
        event.preventDefault();
        this.navItemClick.emit(item);
    }
}
