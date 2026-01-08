import {RenderMode, ServerRoute} from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
    {
        path: ":lang/main/home",
        renderMode: RenderMode.Server,
    },
    {
        path: ":lang/main/about",
        renderMode: RenderMode.Prerender,
    },
    {
        path: ":lang/main/classes",
        renderMode: RenderMode.Server,
    },
    {
        path: ":lang/main/meals",
        renderMode: RenderMode.Server,
    },
    {
        path: "**",
        renderMode: RenderMode.Client,
    },
];
