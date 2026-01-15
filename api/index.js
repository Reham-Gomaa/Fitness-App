// This file bridges Vercel's function call to your Angular SSR handler
export default import("../dist/apps/FITNESS-APP/server/server.mjs").then(
    (module) => module.reqHandler
);
