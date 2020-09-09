import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  QueryParam,
  Body,
  Redirect,
} from "../../deps.ts";
import {
  createOrders,
  getOrderDetails,
  getOrders,
  deleteOrder,
  updateOrder,
} from "../../services/orders.ts";

@Controller("/api")
export class ApiController {
  @Get("/orders")
  getOrders() {
    return { data: "all of orders" };
  }

  @Get("/orders/:id")
  getParamIdOrder(@Param("id") id: string) {
    return id;
  }

  @Post("/addOrder")
  async addOrder(@Body() body: any) {
    await createOrders(body);
    return { msg: "已添加,请查看!" };
  }
}
