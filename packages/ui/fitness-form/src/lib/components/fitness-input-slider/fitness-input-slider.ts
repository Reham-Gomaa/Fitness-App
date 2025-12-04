import { Component, computed, input, output, signal, SimpleChanges } from '@angular/core';

@Component({
  selector: 'lib-fitness-input-slider',
  imports: [],
  templateUrl: './fitness-input-slider.html',
  styleUrl: './fitness-input-slider.scss',
})
export class FitnessInputSlider {
  weight = signal(90);
  minWeight = input(60);
  maxWeight = input(300);
  unit = input.required<string>();
   initialWeight = input<number>();
  
  weightChange = output<number>();

  isDragging = signal(false);
  startX = signal(0);
  startWeight = signal(0);


ngOnChanges(changes: SimpleChanges): void {
    // Update weight when initialWeight input changes
    if (changes['initialWeight'] && this.initialWeight() !== undefined) {
      const initial = this.initialWeight()!;
      if (initial >= this.minWeight() && initial <= this.maxWeight()) {
        this.weight.set(initial);
      }
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