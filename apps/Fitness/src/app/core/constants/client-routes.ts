export const CLIENT_ROUTES = {
    root: "",

    dashboard: {
        base: "dashboard",
    },

    shared: {
        base: "shared",
    },

    documentation: {
        base: "documentation",
    },

    auth: {
        base: "auth",
        login: "login",
    },
} as const;

export type ClientRoutes = typeof CLIENT_ROUTES;
