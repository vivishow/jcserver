import { MongoClient, env } from "../deps.ts";

env({ export: true });

const DB_USER = Deno.env.get("DB_USER");
const DB_PASSWD = Deno.env.get("DB_PASSWD");

const DB_NAME = Deno.env.get("DB_NAME") || "";
const DB_URI =
  `mongodb+srv://${DB_USER}:${DB_PASSWD}@cluster0.cihwk.mongodb.net/retryWrites=true&w=majority`;
// 创建连接
const client = new MongoClient();
// 建立连接
client.connectWithUri(DB_URI);
// 连接数据库
const db = client.database(DB_NAME);

export default db;
