import { Component, inject, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Translation } from '../../../core/services/translation/translation';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ButtonModule, TranslateModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly translation = inject(Translation);
  private readonly platformId = inject(PLATFORM_ID);

  // Expose language signal for template
  currentLang = this.translation.lang;

  // Get current URL for display
  currentUrl = computed(() => {
    if (isPlatformBrowser(this.platformId)) {
      return window.location.href;
    }
    return '';
  });

  // Get supported languages for buttons
  readonly languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  switchLanguage(lang: string): void {
    this.translation.setLanguage(lang);
  }
}
