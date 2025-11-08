import { APP_INITIALIZER, inject } from '@angular/core';
import { Translation } from '../services/translation/translation';

export function initializeTranslations(): () => Promise<void> {
  return async () => {
    const translation = inject(Translation);
    await translation.initialize();
  };
}

export const TRANSLATION_INITIALIZER = {
  provide: APP_INITIALIZER,
  useFactory: initializeTranslations,
  multi: true,
};
