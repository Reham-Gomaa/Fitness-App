import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-logout-confirmation-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslateModule],
  templateUrl: "./logout-confirmation-modal.html",
  styleUrl: "./logout-confirmation-modal.scss",
})
export class LogoutConfirmationModalComponent {
  private dialogRef = inject(DynamicDialogRef);
  protected translate = inject(TranslateService);

  confirmLogout(): void {
    this.dialogRef.close(true); 
  }

  close(): void {
    this.dialogRef.close(false); 
  }
}