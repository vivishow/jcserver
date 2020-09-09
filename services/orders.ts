import db from "../config/db.ts";
import Order from "../models/Order.ts";
const orders = db.collection("orders");

export const createOrders = async (data: Order[]) => {
  const insertedOrder = await orders.insertMany(data);
  return { ...data, ...insertedOrder };
};

export const getOrders = async () => {
  const result = await orders.find();
  return result;
};

export const getOrderDetails = async (title: string) => {
  const result = await orders.findOne({ title: title });
  return result;
};

export const updateOrder = async (title: string, data: Order) => {
  const result = await orders.updateOne({ title }, data);
  return result;
};

export const deleteOrder = async (title: string) => {
  const result = await orders.deleteOne({ title });
  return result;
};
