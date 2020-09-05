import { App } from "./deps.ts";
import { settings } from "./app-settings.ts";

const app = new App(settings);

app.useStatic({
  root: `${Deno.cwd()}/public/`,
  baseRoute: "/static/",
});

app.listen({ port: 3000 });
