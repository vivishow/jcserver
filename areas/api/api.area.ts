import { Area } from "../../deps.ts";
import { ApiController } from "./api.controller.ts";

@Area({
  controllers: [ApiController],
})
export class ApiArea {}
