import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { FitnessFormRadio } from '@fitness-app/fitness-form';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-goal-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule, FitnessFormRadio, TranslateModule],
  templateUrl: "./goal-modal.html",
  styleUrl: "./goal-modal.scss",
})
export class GoalModalComponent implements OnInit {
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  private translate = inject(TranslateService);

  selectedGoal: string = 'lose_weight';
  goalOptions = signal<{ value: string, label: string }[]>([]);

  ngOnInit(): void {
    if (this.dialogConfig.data?.currentGoal) {
      this.selectedGoal = this.dialogConfig.data.currentGoal;
    }
    
    // Translate options immediately
    this.updateOptions();
  }

  private updateOptions(): void {
    const options = [
      { value: 'gain_weight', label: this.translate.instant('ACCOUNT.GOAL.GAIN_WEIGHT') },
      { value: 'lose_weight', label: this.translate.instant('ACCOUNT.GOAL.LOSE_WEIGHT') },
      { value: 'get_fitter', label: this.translate.instant('ACCOUNT.GOAL.GET_FITTER') },
      { value: 'gain_more_flexible', label: this.translate.instant('ACCOUNT.GOAL.GAIN_MORE_FLEXIBLE') },
      { value: 'learn_the_basic', label: this.translate.instant('ACCOUNT.GOAL.LEARN_THE_BASIC') }
    ];
    
    this.goalOptions.set(options);
  }

  onGoalChange(goal: string): void {
    this.selectedGoal = goal;
  }

  onNext(): void {
    this.dialogRef.close(this.selectedGoal);
  }

  close(): void {
    this.dialogRef.close(false); 
  }
}