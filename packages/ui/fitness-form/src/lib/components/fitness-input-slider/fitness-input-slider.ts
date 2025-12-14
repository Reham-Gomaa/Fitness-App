import {Component, computed, input, OnInit, output, signal} from "@angular/core";

@Component({
    selector: "lib-fitness-input-slider",
    imports: [],
    templateUrl: "./fitness-input-slider.html",
    styleUrl: "./fitness-input-slider.scss",
})
export class FitnessInputSlider implements OnInit {
    weight = signal(30);
    minWeight = input(60);
    maxWeight = input(300);
    unit = input.required<string>();
    initialValue = input<number>();

    weightChange = output<number>();

    isDragging = signal(false);
    startX = signal(0);
    startWeight = signal(0);

    ngOnInit(): void {
        const initial = this.initialValue();
        if (initial !== undefined) {
            this.weight.set(initial);
        } else {
            this.weight.set(this.minWeight() + (this.maxWeight() - this.minWeight()) / 2);
        }
    }

    // Get 8 numbers centered around current weight
    visibleWeights = computed(() => {
        const current = this.weight();
        const weights: number[] = [];

        // Show 4 numbers before and 3 after (total 8 including current)
        for (let i = current - 3; i <= current + 3; i++) {
            if (i >= this.minWeight() && i <= this.maxWeight()) {
                weights.push(i);
            }
        }

        return weights;
    });

    // Calculate opacity based on distance from center
    getOpacity(w: number): number {
        const current = this.weight();
        const distance = Math.abs(w - current);

        if (distance === 0) return 1; // Active number
        if (distance <= 2) return 1; // 2 numbers on each side are white
        return 0.3; // Others are faded (shadow effect)
    }

    // Helper method to update weight and emit change
    private updateWeight(newWeight: number): void {
        if (newWeight >= this.minWeight() && newWeight <= this.maxWeight()) {
            this.weight.set(newWeight);
            this.weightChange.emit(newWeight);
        }
    }

    onWheel(event: WheelEvent): void {
        event.preventDefault();
        const delta = event.deltaY > 0 ? -1 : 1;
        const newWeight = this.weight() + delta;
        this.updateWeight(newWeight);
    }

    onMouseDown(event: MouseEvent): void {
        this.isDragging.set(true);
        this.startX.set(event.clientX);
        this.startWeight.set(this.weight());
        event.preventDefault();
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.isDragging()) return;

        const diff = this.startX() - event.clientX;
        const steps = Math.round(diff / 20);
        const newWeight = this.startWeight() + steps;
        this.updateWeight(newWeight);
    }

    onMouseUp(): void {
        this.isDragging.set(false);
    }

    onTouchStart(event: TouchEvent): void {
        this.isDragging.set(true);
        this.startX.set(event.touches[0].clientX);
        this.startWeight.set(this.weight());
    }

    onTouchMove(event: TouchEvent): void {
        if (!this.isDragging()) return;

        const diff = this.startX() - event.touches[0].clientX;
        const steps = Math.round(diff / 20);
        const newWeight = this.startWeight() + steps;
        this.updateWeight(newWeight);
    }

    onTouchEnd(): void {
        this.isDragging.set(false);
    }
}
