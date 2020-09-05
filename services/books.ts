import db from "../config/db.ts";
import Book from "../models/Book.ts";
const books = db.collection("orders");

export const createBooks = async (data: Book[]) => {
  const insertedBook = await books.insertMany(data);
  return { ...data, ...insertedBook };
};

export const getBooks = async () => {
  const result = await books.find();
  return result;
};

export const getBookDetails = async (title: string) => {
  const result = await books.findOne({ title: title });
  return result;
};

export const updateBook = async (title: string, data: Book) => {
  const result = await books.updateOne({ title }, data);
  return result;
};

export const deleteBook = async (title: string) => {
  const result = await books.deleteOne({ title });
  return result;
};
