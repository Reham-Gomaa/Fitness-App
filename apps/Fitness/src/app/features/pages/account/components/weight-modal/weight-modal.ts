import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { FitnessInputSlider } from '@fitness-app/fitness-form'; 
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-weight-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule, FitnessInputSlider, TranslateModule],
  templateUrl: "./weight-modal.html",
  styleUrl: "./weight-modal.scss",
})
export class WeightModalComponent implements OnInit {
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  private translate = inject(TranslateService);

  currentWeight = signal(70);

  ngOnInit(): void {
    if (this.dialogConfig.data?.currentWeight) {
      this.currentWeight.set(this.dialogConfig.data.currentWeight);
    }
  }

  onWeightChange(weight: number): void {
    this.currentWeight.set(weight);
  }

  onDone(): void {
    this.dialogRef.close(this.currentWeight());
  }

  close(): void {
    this.dialogRef.close(false); 
  }
}