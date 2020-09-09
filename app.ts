import { App, CorsBuilder, env } from "./deps.ts";
import { settings } from "./app-settings.ts";

const app = new App(settings);

app.useStatic({
  root: `${Deno.cwd()}/public/`,
  index: "index.html",
  baseRoute: "",
});

app.useCors(
  new CorsBuilder().AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin(),
);

app.listen({ port: 8820 });
