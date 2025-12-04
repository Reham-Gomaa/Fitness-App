import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FitnessInput } from '@fitness-app/fitness-form'; // Adjust path as needed
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    TranslateModule, 
    FitnessInput,
    ReactiveFormsModule
  ],
  templateUrl: "./change-password-modal.html",
  styleUrl: "./change-password-modal.scss",
})
export class ChangePasswordModalComponent {
  private dialogRef = inject(DynamicDialogRef);
  protected translate = inject(TranslateService);
  private fb = inject(FormBuilder);

    passwordForm: FormGroup = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Use type assertion to satisfy TypeScript
  get oldPasswordControl(): AbstractControl {
    return this.passwordForm.get('oldPassword')!;
  }

  get newPasswordControl(): AbstractControl {
    return this.passwordForm.get('newPassword')!;
  }

  submit(): void {
    if (this.passwordForm.valid) {
      const { oldPassword, newPassword } = this.passwordForm.value;
      this.dialogRef.close({ oldPassword, newPassword });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}