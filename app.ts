import { App } from "./deps.ts";
import { settings } from "./app-settings.ts";

const app = new App(settings);

app.useStatic({
  root: `${Deno.cwd()}/public/`,
  index: "index.html",
  baseRoute: "",
});

app.listen({ port: 3000 });
