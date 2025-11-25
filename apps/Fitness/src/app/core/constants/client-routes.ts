export const CLIENT_ROUTES = {
    root: "",
    main: {
        base: "main",
        home: "home",
        about: "about",
        classes: "classes",
        meals: "meals",
        account: "account",
        details:"details/:cat/:id"
    },
    auth: {
        base: "auth",
        login: "login",
        register: "register",
        forgetpass: "forgetpass",
    },
} as const;

export type ClientRoutes = typeof CLIENT_ROUTES;
