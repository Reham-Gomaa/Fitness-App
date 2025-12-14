import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '@fitness-app/services';
import { DialogService } from 'primeng/dynamicdialog';
import { UserService } from './services/user-service/user-service';
import { GoalModalComponent } from './components/goal-modal/goal-modal';
import { Subscription } from 'rxjs';
import { LevelModal } from './components/level-modal/level-modal';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal';
import { MessageService } from 'primeng/api';
import { LogoutConfirmationModalComponent } from './components/logout-confirmation-modal/logout-confirmation-modal';
import { Router } from '@angular/router';
import { WeightModalComponent } from './components/weight-modal/weight-modal';
import { Translation } from '../../../core/services/translation/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: "app-account",
    standalone: true,
    imports: [CommonModule, ButtonModule, TranslateModule],
    templateUrl: "./account.html",
    styleUrl: "./account.scss",
})
export class Account implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private dialogService = inject(DialogService);
  themeService = inject(ThemeService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private translation = inject(Translation);
  private translate = inject(TranslateService);

  private subscriptions = new Subscription();

  user = this.userService.currentUser;
  currentLang = this.translation.lang;

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadUserData(): void {
    const sub = this.userService.getLoggedUserData().subscribe({
      error: (error) => {
        console.error('Error loading user data:', error);
      }
    });
    this.subscriptions.add(sub);
  }

  onThemeToggle(): void {
    this.themeService.toggle();
  }

  getCurrentLanguageDisplay(): string {
    const current = this.currentLang();
    return current === 'en' ? 'English' : 'العربية';
  }

  switchLanguage(): void {
    const current = this.currentLang();
    const newLang = current === 'en' ? 'ar' : 'en';
    
    console.log('Switching language from', current, 'to', newLang);
    this.translation.setLanguage(newLang);
    
    const languageName = newLang === 'en' ? 'English' : 'العربية';
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('ACCOUNT.MESSAGES.LANGUAGE_CHANGED', { language: languageName }),
      life: 2000
    });
  }

  openGoalModal(): void {
    const currentGoal = this.user()?.goal;
    
    const dialogRef = this.dialogService.open(GoalModalComponent, {
      width: '90vw',
      style: { 
        'max-width': '500px', 
        'border-radius': '16px',
        'border': 'none',
        'background': 'transparent', 
      },
      data: {
        currentGoal: currentGoal
      }
    });

    if (dialogRef) {
      const sub = dialogRef.onClose.subscribe((result: string) => {
        if (result) {
          this.updateGoal(result);
        }
      });
      this.subscriptions.add(sub);
    }
  }

  openWeightModal(): void {
    const currentWeight = this.user()?.weight;
    
    const dialogRef = this.dialogService.open(WeightModalComponent, {
      width: '90vw',
      style: { 
        'max-width': '500px', 
        'border-radius': '16px',
        'border': 'none',
        'background': 'transparent', 
      },
      data: {
        currentWeight: currentWeight
      }
    });

    if (dialogRef) {
      const sub = dialogRef.onClose.subscribe((result: number) => {
        if (result) {
          this.updateWeight(result);
        }
      });
      this.subscriptions.add(sub);
    }
  }

  private updateWeight(weight: number): void {
    const sub = this.userService.updateWeight(weight).subscribe({
      next: () => {
        console.log('Weight updated successfully');
      },
      error: (error) => {
        console.error('Error updating weight:', error);
      }
    });
    this.subscriptions.add(sub);
  }

  openActivityLevelModal(): void {
    const currentLevel = this.user()?.activityLevel;
    
    const dialogRef = this.dialogService.open(LevelModal, {
      width: '90vw',
      style: { 
        'max-width': '500px', 
        'border-radius': '16px',
        'border': 'none',
        'background': 'transparent', 
      },
      data: {
        currentActivityLevel: currentLevel
      }
    });

    if (dialogRef) {
      const sub = dialogRef.onClose.subscribe((result: string) => {
        if (result) {
          this.updateActivityLevel(result);
        }
      });
      this.subscriptions.add(sub);
    }
  }

  private updateActivityLevel(activityLevel: string): void {
    const sub = this.userService.updateActivityLevel(activityLevel).subscribe({
      next: () => {
        console.log('Activity level updated successfully');
      },
      error: (error) => {
        console.error('Error updating activity level:', error);
      }
    });
    this.subscriptions.add(sub);
  }

  private updateGoal(goal: string): void {
    const sub = this.userService.updateGoal(goal).subscribe({
      next: () => {
        console.log('Goal updated successfully');
      },
      error: (error) => {
        console.error('Error updating goal:', error);
      }
    });
    this.subscriptions.add(sub);
  }

  getDisplayGoal(goal: string | undefined): string {
    if (!goal) return this.translate.instant('ACCOUNT.GOAL.NOT_SET');
    
    const goalMap: { [key: string]: string } = {
      'gain_weight': this.translate.instant('ACCOUNT.GOAL.GAIN_WEIGHT'),
      'lose_weight': this.translate.instant('ACCOUNT.GOAL.LOSE_WEIGHT'),
      'get_fitter': this.translate.instant('ACCOUNT.GOAL.GET_FITTER'),
      'gain_more_flexible': this.translate.instant('ACCOUNT.GOAL.GAIN_MORE_FLEXIBLE'),
      'learn_the_basic': this.translate.instant('ACCOUNT.GOAL.LEARN_THE_BASIC')
    };
    
    return goalMap[goal] || goal;
  }

  getDisplayActivityLevel(level: string | undefined): string {
    if (!level) return this.translate.instant('ACCOUNT.LEVEL.NOT_SET');
    
    const levelMap: { [key: string]: string } = {
      'level1': this.translate.instant('ACCOUNT.LEVEL.ROOKIE'),
      'level2': this.translate.instant('ACCOUNT.LEVEL.BEGINNER'),
      'level3': this.translate.instant('ACCOUNT.LEVEL.INTERMEDIATE'),
      'level4': this.translate.instant('ACCOUNT.LEVEL.ADVANCED'),
      'level5': this.translate.instant('ACCOUNT.LEVEL.TRUE_BEAST')
    };
    
    return levelMap[level] || level;
  }

  openChangePasswordModal(): void {
    const dialogRef = this.dialogService.open(ChangePasswordModalComponent, {
      width: '90vw',
      style: { 
        'max-width': '500px', 
        'border-radius': '16px',
        'border': 'none',
        'background': 'transparent', 
      }
    });

    if (dialogRef) {
      const sub = dialogRef.onClose.subscribe((result: { oldPassword: string, newPassword: string }) => {
        if (result) {
          this.changePassword(result.oldPassword, result.newPassword);
        }
      });
      this.subscriptions.add(sub);
    }
  }

  private changePassword(oldPassword: string, newPassword: string): void {
    const sub = this.userService.changePassword(oldPassword, newPassword).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('ACCOUNT.MESSAGES.PASSWORD_CHANGED_SUCCESS'),
          life: 3000
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('ACCOUNT.MESSAGES.PASSWORD_CHANGE_ERROR'),
          life: 3000
        });
      }
    });
    this.subscriptions.add(sub);
  }

  openLogoutConfirmation(): void {
    const dialogRef = this.dialogService.open(LogoutConfirmationModalComponent, {
      width: '90vw',
      style: { 
        'max-width': '400px', 
        'border-radius': '16px',
        'border': 'none',
        'background': 'transparent', 
      }
    });

    if (dialogRef) {
      const sub = dialogRef.onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.logout();
        }
      });
      this.subscriptions.add(sub);
    }
  }

  private logout(): void {
    const sub = this.userService.logout().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('ACCOUNT.MESSAGES.LOGOUT_SUCCESS'),
          life: 3000
        });
        this.router.navigate(['/']);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      },
      error: (error) => {
        this.userService.currentUser.set(null);
        localStorage.removeItem('token');
      
        if (error.status === 404) {
          this.messageService.add({
            severity: 'info',
            summary: this.translate.instant('ACCOUNT.MESSAGES.LOGOUT_LOCAL'),
            life: 3000
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('ACCOUNT.MESSAGES.LOGOUT_SUCCESS'),
            life: 3000
          });
        }
        
        this.router.navigate(['/']);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    });
    this.subscriptions.add(sub);
  }
}