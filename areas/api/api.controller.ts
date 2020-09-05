import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  QueryParam,
  Body,
} from "../../deps.ts";

@Controller("/api")
export class ApiController {
  @Get("/orders")
  getOrders() {
    return "all of orders";
  }

  @Get("/orders/:id")
  getParamIdOrder(@Param("id") id: string) {
    return id;
  }

  @Post("/addOrder")
  addOrder(@Body() body: any) {
    return body;
  }
}
