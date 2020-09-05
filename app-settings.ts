import { AppSettings } from "./deps.ts";
import { RootArea } from "./areas/root/root.area.ts";
import { ApiArea } from "./areas/api/api.area.ts";
import { Log } from "./middlewares/log.middleware.ts";

export const settings: AppSettings = {
  areas: [RootArea, ApiArea],
  middlewares: [Log],
  logging: false,
};
