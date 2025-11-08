import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
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

// Translation
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TRANSLATION_INITIALIZER } from './core/initializers/translation.initializer';
import { createCustomTranslateLoader } from './core/services/translation/custom-translate-loader';
import { DEFAULT_LANGUAGE } from './core/constants/translation.constants';

// Auth LIB
import { API_CONFIG } from 'auth-api-kp';
import { environment } from '@fitness-app/environment/baseUrl.dev';

export const appConfig: ApplicationConfig = {
  providers: [
    // HTTP Client
    provideHttpClient(
      withFetch(),
      withInterceptors([]),
      withInterceptorsFromDi()
    ),
    // Auth API Configuration
    {
      provide: API_CONFIG,
      useValue: {
        baseUrl: `${environment.baseApiUrl}api`,
        apiVersion: 'v1',
        endpoints: {
          auth: {
            login: 'auth/signin',
            register: 'auth/signup',
            logout: 'auth/logout',
            forgotPassword: 'auth/forgotPassword',
            verifyResetCode: 'auth/verifyResetCode',
            resetPassword: 'auth/resetPassword',
            profileData: 'auth/profile-data',
            editProfile: 'auth/editProfile',
            changePassword: 'auth/change-password',
            deleteMe: 'auth/deleteMe',
            uploadPhoto: 'auth/upload-photo',
            forgetPasswordForm: 'auth/forgetPasswordForm',
          },
        },
      },
    },

    // Zoneless / Hydration / Animations
    provideClientHydration(withEventReplay()),
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
      lang: DEFAULT_LANGUAGE,
    }),

    // PrimeNG
    MessageService,
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
      // Enable hash routing for language prefixes
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      })
    ),
  ],
};
