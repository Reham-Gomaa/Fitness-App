import {Route} from "@angular/router";
import {Main} from "./features/layouts/main/main";
import {DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES} from "./core/constants/translation.constants";
import {Auth} from "./features/layouts/auth/auth";
import {translationPreloadGuard} from "./core/guards/translation-preload.guard";

// Helper function to create routes with language prefix
function createLanguageRoutes(): Route[] {
    const routes: Route[] = [];

    // Add routes for each supported language
    SUPPORTED_LANGUAGES.forEach((lang) => {
        routes.push({
            path: lang.toUpperCase(),
            children: [
                {
                    path: "",
                    redirectTo: "main",
                    pathMatch: "full",
                },
                {
                    path: "main",
                    component: Main,
                    title: "Main",
                    canActivate: [translationPreloadGuard],
                    children: [
                        {path: "", redirectTo: "home", pathMatch: "full"},
                        {
                            path: "home",
                            title: "Home",
                            canActivate: [translationPreloadGuard],
                            loadComponent: () =>
                                import("./features/pages/home/home").then((c) => c.Home),
                        },
                    ],
                },
                {
                    path: "auth",
                    title: "Authentication",
                    component: Auth,
                    canActivate: [translationPreloadGuard],
                    children: [
                        {
                            path: "login",
                            title: "Login",
                            canActivate: [translationPreloadGuard],
                            loadComponent: () =>
                                import("./features/layouts/auth/components/login/login").then(
                                    (c) => c.Login
                                ),
                        },
                        {
                            path: "register",
                            title: "Register",
                            canActivate: [translationPreloadGuard],
                            loadComponent: () =>
                                import("./features/layouts/auth/components/register/register").then(
                                    (c) => c.Register
                                ),
                        },
                        {
                            path: "forgetpass",
                            title: "Forget Password",
                            canActivate: [translationPreloadGuard],
                            loadComponent: () =>
                                import(
                                    "./features/layouts/auth/components/forgetpass/forgetpass"
                                ).then((c) => c.Forgetpass),
                        },
                    ],
                },
            ],
        });
    });

    return routes;
}

export const appRoutes: Route[] = [
    // Redirect root to default language
    {
        path: "",
        redirectTo: DEFAULT_LANGUAGE.toUpperCase(),
        pathMatch: "full",
    },
    // Language-specific routes
    ...createLanguageRoutes(),
    // Fallback for invalid language codes - redirect to default
    {
        path: "**",
        redirectTo: DEFAULT_LANGUAGE.toUpperCase(),
    },
];
