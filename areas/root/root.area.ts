import { Area } from "../../deps.ts";
import { RootController } from "./root.controller.ts";

@Area({
  controllers: [RootController],
})
export class RootArea {}
