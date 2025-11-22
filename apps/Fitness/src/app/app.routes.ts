import {Routes} from "@angular/router";
import {Main} from "./features/layouts/main/main";
import {DEFAULT_LANGUAGE} from "./core/constants/translation.constants";
import {Auth} from "./features/layouts/auth/auth";
import {translationPreloadGuard} from "./core/guards/translation-preload.guard";
import {CLIENT_ROUTES} from "./core/constants/client-routes";

// Helper function to create routes with language prefix
export const routes: Routes = [
    {path: "", pathMatch: "full", redirectTo: DEFAULT_LANGUAGE},
    {
        path: ":lang",
        children: [
            {
                path: "",
                redirectTo: CLIENT_ROUTES.main.base,
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
                        path: CLIENT_ROUTES.main.home,
                        title: "Home",
                        canActivate: [translationPreloadGuard],
                        loadComponent: () =>
                            import("./features/pages/home/home").then((c) => c.Home),
                    },
                    {
                        path: CLIENT_ROUTES.main.about,
                        title: "About",
                        canActivate: [translationPreloadGuard],
                        loadComponent: () =>
                            import("./features/pages/about-us/about-us").then((c) => c.AboutUs),
                    },
                    {
                        path: CLIENT_ROUTES.main.classes,
                        title: "Classes",
                        canActivate: [translationPreloadGuard],
                        loadComponent: () =>
                            import("./features/pages/workouts/workouts").then((c) => c.Workouts),
                    },
                    {
                        path: CLIENT_ROUTES.main.meals,
                        title: "Meals",
                        canActivate: [translationPreloadGuard],
                        loadComponent: () =>
                            import("./features/pages/meals/meals").then((c) => c.Meals),
                    },
                    {
                        path: CLIENT_ROUTES.main.account,
                        title: "Account",
                        canActivate: [translationPreloadGuard],
                        loadComponent: () =>
                            import("./features/pages/account/account").then((c) => c.Account),
                    },
                ],
            },
            {
                path: CLIENT_ROUTES.auth.base,
                title: "Authentication",
                component: Auth,
                canActivate: [translationPreloadGuard],
                children: [
                    {
                        path: CLIENT_ROUTES.auth.login,
                        title: "Login",
                        canActivate: [translationPreloadGuard],
                        loadComponent: () =>
                            import("./features/layouts/auth/components/login/login").then(
                                (c) => c.Login
                            ),
                    },
                    {
                        path: CLIENT_ROUTES.auth.register,
                        title: "Register",
                        canActivate: [translationPreloadGuard],
                        loadComponent: () =>
                            import("./features/layouts/auth/components/register/register").then(
                                (c) => c.Register
                            ),
                    },
                    {
                        path: CLIENT_ROUTES.auth.forgetpass,
                        title: "Forget Password",
                        canActivate: [translationPreloadGuard],
                        loadComponent: () =>
                            import("./features/layouts/auth/components/forgetpass/forgetpass").then(
                                (c) => c.Forgetpass
                            ),
                    },
                ],
            },
        ],
    },
];
