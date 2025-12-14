import {Component, input, computed} from "@angular/core";
import {CommonModule} from "@angular/common";

@Component({
    selector: "app-progress-circle",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./progress-circle.html",
    styleUrls: ["./progress-circle.scss"],
})
export class ProgressCircleComponent {
    current = input<number>(0);
    total = input<number>(0);
    radius = input<number>(24);
    strokeWidth = input<number>(4);

    circumference = computed(() => 2 * Math.PI * this.radius());

    strokeDashoffset = computed(() => {
        const c = this.circumference();
        const t = this.total();
        const cur = this.current();
        const progress = t > 0 ? cur / t : 0;
        return c - progress * c;
    });
}
