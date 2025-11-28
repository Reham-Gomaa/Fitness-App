import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { FitnessFormRadio } from '@fitness-app/fitness-form';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-level-modal",
  standalone: true,
  imports: [CommonModule, ButtonModule, FitnessFormRadio, TranslateModule],
  templateUrl: "./level-modal.html",
  styleUrl: "./level-modal.scss",
})
export class LevelModal implements OnInit {
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  private translate = inject(TranslateService);

  selectedActivityLevel: string = 'level1';
  activityLevelOptions = signal<{ value: string, label: string }[]>([]);

  ngOnInit(): void {
    const currentLevel = this.dialogConfig.data?.currentActivityLevel;
    
    if (currentLevel) {
      this.selectedActivityLevel = currentLevel;
    }
    
    this.updateOptions();
  }

  private updateOptions(): void {
    const options = [
      { value: 'level1', label: this.translate.instant('ACCOUNT.LEVEL.ROOKIE') },
      { value: 'level2', label: this.translate.instant('ACCOUNT.LEVEL.BEGINNER') },
      { value: 'level3', label: this.translate.instant('ACCOUNT.LEVEL.INTERMEDIATE') },
      { value: 'level4', label: this.translate.instant('ACCOUNT.LEVEL.ADVANCED') },
      { value: 'level5', label: this.translate.instant('ACCOUNT.LEVEL.TRUE_BEAST') }
    ];
    
    this.activityLevelOptions.set(options);
  }

  onLevelChange(level: string): void {
    this.selectedActivityLevel = level;
  }

  onNext(): void {
    this.dialogRef.close(this.selectedActivityLevel);
  }

  close(): void {
    this.dialogRef.close(false); 
  }
}