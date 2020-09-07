import { Controller, Get, Redirect } from "../../deps.ts";

@Controller()
export class RootController {
  @Get()
  public async getRoot() {
    return "root page";
  }

  @Get("/addOrders")
  addOrdersPage() {
    return Redirect("/test.html");
  }
}
