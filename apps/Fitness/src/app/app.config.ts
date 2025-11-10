import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
// Hydration imports removed - not needed for static builds
// import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { appRoutes } from './app.routes';

// Primeng
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';

// Translation
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { DEFAULT_LANGUAGE } from './core/constants/translation.constants';
import { TRANSLATION_INITIALIZER } from './core/initializers/translation.initializer';
import { createCustomTranslateLoader } from './core/services/translation/custom-translate-loader';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    // HTTP Client
    provideHttpClient(
      withFetch(),
      withInterceptors([]),
      withInterceptorsFromDi()
    ),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),

    // Translation
    TRANSLATION_INITIALIZER,
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: () => createCustomTranslateLoader(),
      },
      fallbackLang: DEFAULT_LANGUAGE,
    }),

    // PrimeNG
    MessageService,
    importProvidersFrom(ToastModule),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'light-mode',
          cssLayer: false,
        },
      },
    }),

    // Router with hash location (Angular 20 best practice)
    provideRouter(
      appRoutes,
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      })
    ),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
};
