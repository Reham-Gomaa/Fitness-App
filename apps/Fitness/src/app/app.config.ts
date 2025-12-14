import {
    provideHttpClient,
    withFetch,
    withInterceptors,
    withInterceptorsFromDi,
} from "@angular/common/http";
import {authInterceptor} from "./core/interceptors/auth.interceptor";
import {
    ApplicationConfig,
    importProvidersFrom,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from "@angular/core";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {
    provideRouter,
    withComponentInputBinding,
    withInMemoryScrolling,
    withViewTransitions,
} from "@angular/router";

import {routes} from "./app.routes";

// Primeng
import Aura from "@primeuix/themes/aura";
import {MessageService} from "primeng/api";
import {providePrimeNG} from "primeng/config";
import {ToastModule} from "primeng/toast";
import { DialogService } from 'primeng/dynamicdialog';

// Translation
import {provideTranslateService, TranslateLoader} from "@ngx-translate/core";
import {DEFAULT_LANGUAGE} from "./core/constants/translation.constants";
import {TRANSLATION_INITIALIZER} from "./core/initializers/translation.initializer";
import {createCustomTranslateLoader} from "./core/services/translation/custom-translate-loader";

import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {environment} from "@fitness-app/environment/baseUrl.dev";
import {API_CONFIG} from "auth-api-kp";

// NgRx
import {provideStore} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {provideStoreDevtools} from "@ngrx/store-devtools";
import {authReducer} from "./features/layouts/auth/store/auth.reducer";
import {AuthEffects} from "./features/layouts/auth/store/auth.effects";
import {isDevMode} from "@angular/core";

export const appConfig: ApplicationConfig = {
    providers: [
        // Translation
        TRANSLATION_INITIALIZER,
        // HTTP Client
        provideHttpClient(
            withFetch(),
            withInterceptors([authInterceptor]),
            withInterceptorsFromDi()
        ),

        // Auth API Configuration
        {
            provide: API_CONFIG,
            useValue: {
                baseUrl: `${environment.baseApiUrl}`,
                endpoints: {
                    auth: {
                        login: "auth/signin",
                        register: "auth/signup",
                        logout: "auth/logout",
                        forgotPassword: "auth/forgotPassword",
                        verifyResetCode: "auth/verifyResetCode",
                        resetPassword: "auth/resetPassword",
                        profileData: "auth/profile-data",
                        editProfile: "auth/editProfile",
                        changePassword: "auth/change-password",
                        deleteMe: "auth/deleteMe",
                        uploadPhoto: "auth/upload-photo",
                        forgetPasswordForm: "auth/forgetPasswordForm",
                    },
                },
            },
        },

        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideAnimationsAsync(),

        // Translation
        provideTranslateService({
            loader: {
                provide: TranslateLoader,
                useFactory: () => createCustomTranslateLoader(),
            },
            fallbackLang: DEFAULT_LANGUAGE,
        }),

        // PrimeNG
        MessageService,
         DialogService, 
        importProvidersFrom(ToastModule),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    prefix: "p",
                    darkModeSelector: "light-mode",
                    cssLayer: false,
                },
            },
        }),

        // Router with hash location (Angular 20 best practice)
        provideRouter(
            routes,
            withViewTransitions(),
            withInMemoryScrolling({
                scrollPositionRestoration: "enabled",
            }),
            withComponentInputBinding()
        ),
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        provideHttpClient(withFetch()),

        // NgRx
        provideStore({auth: authReducer}),
        provideEffects([AuthEffects]),
        provideStoreDevtools({maxAge: 25, logOnly: !isDevMode()}),
    ],
};
