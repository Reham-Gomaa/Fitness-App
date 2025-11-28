import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, TranslateModule],
  templateUrl: "./change-password-modal.html",
  styleUrl: "./change-password-modal.scss",
})
export class ChangePasswordModalComponent {
  private dialogRef = inject(DynamicDialogRef);
  protected translate = inject(TranslateService);

  submit(oldPassword: string, newPassword: string): void {
    if (oldPassword && newPassword && newPassword.length >= 6) {
      this.dialogRef.close({ oldPassword, newPassword });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}