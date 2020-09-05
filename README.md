---
title: 基于 Deno 构建 HTTP Server 实践指南
date: 2020-07-29 06:55:25
categories:
  - [Deno]
tags:
  - Deno
  - 掘金专栏
---

![](https://i.loli.net/2020/07/29/Vn7jhOu3Z2c6pTe.png)

<!--more-->

大家好，我是俊宁，这是一篇介绍如何使用 Deno 构建 HTTP Server 的实践指南，如果你还不了解Deno是什么，可以移步我的另一篇 [Deno入门文章](https://juejin.im/post/5f1d4065f265da22d8344dc6)。

本文还使用到了 Docker，如果不熟悉可以看一下 [一个前端工程师的Docker学习笔记【持续更新】](https://juejin.im/post/6844904111243001869)。

mongodb 入门可以看一下 [MongoDB 教程](https://www.runoob.com/mongodb/mongodb-tutorial.html)。

## 环境准备

- deno: 使用 `deno -V` 查看是否正确安装了 deno
- VSCode Deno插件: 支持 Deno 开发的 VSCode 插件
- VSCode REST Client插件: 直接在VSCode中进行接口测试的插件

## 基础体验

### 官方示例解析

```ts
import { serve } from "https://deno.land/std/http/server.ts";

const s = serve({ port: 8080 });
console.log("http://localhost:8080/");

// 一个会等待每一个请求的 for 循环
for await (const req of s) {
  console.log(req.url);
  req.respond({ body: "Hello World\n" });
}
```

让我们来看看上面这段代码做了什么:

1. 首先我们引入 server 模块: 这里使用了 ES 模块，第三方模块通过 URL 导入。

   > 注意：Deno 不支持 `require` 语法。模块也不是集中管理的，而是通过 URL 导入。
2. 使用 `serve` 函数初始化一个 HTTP 服务

3. 使用 [for-await-of](http://s0developer0mozilla0org.icopy.site/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) 语法监听请求，`for-await-of` 语句创建一个循环，循环遍历异步可迭代对象以及同步可迭代对象。

   > 注意：Deno不再捆绑在 async 函数之中，所以可以全局使用

### 解析请求体

```js
const decoder = new TextDecoder("utf-8");
const data: Uint8Array = await Deno.readAll(req.body);
const body = decoder.decode(data) ? JSON.parse(decoder.decode(data)) : {};
```

### 简易REST API

1、这个Demo提供了两个api，分别是从文件读取数据返回和从网络获取数据并返回。结合数据库的放到后面使用框架的部分讲解：

```js
import { serve } from "./deps.ts";

const s = serve({ port: 8080 });
console.log("http://localhost:8080/");

const juejin = "https://xiaoce-timeline-api-ms.juejin.im/v1/getListByLastTime?pageNum=1";

for await (const req of s) {
  if (req.url === "/books") {
    const body = await Deno.readFile("./books.json");
    req.respond({ body: body });
  } else if(req.url === "/juejin"){
    const response = await fetch(juejin);
    const jsonData = await response.json();
    req.respond({
      body: JSON.stringify(jsonData), // body 不能接受对象
    });
  }
}
```

2、执行 `deno run --allow-read --allow-net index.ts`

3、使用 VSCode  REST Client 访问一下试试：

> 注意：如果 localhost 请求失败，请使用 ip 的形式。4090ok

<img src="https://i.loli.net/2020/07/30/ibwyIrKvjJld5GQ.png" style="zoom:25%;" />

## 技术选型

截止2020年7月30日，GitHub比较热门的 HTTP Server 框架有5个，分别是 oak、servest、deno-drash、abc、pogo（排名分先后）。

起初我也和大家一样面对这么多框架不知如何选，直到使用了[Star History](https://star-history.t9t.io/) 对比了他们的star趋势后，毫无犹豫的选择了 oak。

但是本着技术探究的角度，我们还是分别体验一下这5个框架的 Hello World，然后再利用oak进行实战演习。

[<img src="https://i.loli.net/2020/08/01/w6FZXsfHQ4gydcK.png" style="zoom:45%;" />](https://star-history.t9t.io/#oakserver/oak&keroxp/servest&drashland/deno-drash&zhmushan/abc&sholladay/pogo)

### [Oak](https://github.com/oakserver/oak)

#### 介绍

Oak 是最有前景的 Deno HTTP server 中间件框架，包含一个 路由中间件，目前能找到的社区资源最多。这款框架的灵感来自 [Koa](https://github.com/koajs/koa)，路由中间件的灵感来自 [@koa/router](https://github.com/koajs/router/)。

#### Demo

创建一个 `server.ts` 文件并编写一个简单的 server：

```ts
import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello Oak!";
});

console.log(`🦕 oak server running at http://127.0.0.1:8001/ 🦕`)

await app.listen("127.0.0.1:8001");
```

执行 `deno run --allow-net server.ts`开启服务，并使用 VSCode REST Client 测试：

![](https://i.loli.net/2020/07/30/8q3AKy4EVLBb6Q1.png)

编写一个拥有两个自定义中间件的Demo:

```ts
import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Hello World!
app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

console.log(`🦕 oak server running at http://127.0.0.1:8889/ 🦕`);

await app.listen({ port: 8889 });
```

### [servest](https://github.com/keroxp/servest)

#### 介绍

> 用于Deno的渐进式http服务器

`Servest` 是一个适用于 Deno 的 http 模块，它由三个主要的 HTTP 协议的 API 组成

- App API: 通用HTTP路由服务器
- Server API: 处理的 HTTP/1.1 请求的低级的 HTTP API
- Agent API: 处理 HTTP/1.1 的 Keep-Alive 连接的低级API

为了实验和进步，`Servest` 在 [std/http](https://deno.land/std/http) 之外实现了自己的 HTTP/1.1 server。

#### Demo

与 std/http 高度兼容：

```ts
import { createApp } from "./deps.ts";
const app = createApp();
app.handle("/", async (req) => {
  await req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "text/plain",
    }),
    body: "Hello, Servest!",
  });
});
app.listen({ port: 8899 });
```

专为实际业务而设计：

```ts
import { createApp } from "https://servestjs.org/@v1.1.1/mod.ts";

const app = createApp();

app.post("/post", async (req) => {
  const body = await req.json();
  await req.respond({
    status: 200,
    body: JSON.stringify(body),
  });
});

app.listen({ port: 8888 });
```

支持websoket：

```ts
import { createApp } from "https://servestjs.org/@v1.1.1/mod.ts";

const app = createApp();

app.ws("/ws", async (sock) => {
  for await (const msg of sock) {
    if (typeof msg === "string") {
      console.log("[index]", msg);
      // handle messages...
    }
  }
});

app.listen({ port: 8888 });
```

内置 jsx/tsx 支持，无需任何配置：

> 默认情况下，JSX文件（`.jsx`，`.tsx`）将由 `React.createElement()`转换。因此，您必须在jsx/tsx文件的头上导入React。

```ts
// @deno-types="https://servestjs.org/@v1.1.1/types/react/index.d.ts"
import React from "https://dev.jspm.io/react/index.js";
// @deno-types="https://servestjs.org/@v1.1.1/types/react-dom/server/index.d.ts"
import ReactDOMServer from "https://dev.jspm.io/react-dom/server.js";
import { createApp } from "https://servestjs.org/@v1.1.1/mod.ts";

const app = createApp();

app.handle("/", async (req) => {
  await req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "text/html; charset=UTF-8",
    }),
    // @ts-ignore
    body: ReactDOMServer.renderToString(
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>servest</title>
        </head>
        <body>
          <h1>Hello Servest!</h1>
        </body>
      </html>,
    ),
  });
});

app.listen({ port: 8899 });
```

### [deno-drash](https://github.com/drashland/deno-drash)

A REST microframework for Deno's HTTP server with zero dependencies.

```ts
import { Drash } from "https://deno.land/x/drash@v1.x/mod.ts";

class HomeResource extends Drash.Http.Resource {
  static paths = ["/"];
  public GET() {
    this.response.body = "Hello World!";
    return this.response;
  }
}

const server = new Drash.Http.Server({
  response_output: "text/html",
  resources: [HomeResource],
});

server.run({
  hostname: "127.0.0.1",
  port: 8888,
});

console.log(`🦕 drash server running at http://127.0.0.1:8888/ 🦕`);
```

### [abc](https://github.com/zhmushan/abc)

A better Deno framework to create web application.

```ts
import { Application } from "https://deno.land/x/abc@v1/mod.ts";

const app = new Application();

app.get("/hello", () => {
  return "Hello, Abc!";
});

app.start({ port: 8888 });

console.log(`🦕 abc server running at http://127.0.0.1:8888/ 🦕`);
```

### [Pogo](https://github.com/sholladay/pogo)

Pogo是用于编写Web服务器和应用程序的易于使用，安全且富有表现力的框架，它的灵感来自 hapi。

```ts
import React from "https://dev.jspm.io/react";
import pogo from "https://deno.land/x/pogo/main.ts";

const server = pogo.server({ port: 8888 });

server.router.get("/", () => {
  return <h1>Hello, world!</h1>;
});

server.start();

console.log(`🦕 pogo server running at http://127.0.0.1:8888/ 🦕`);
```

## oak 实战

> 项目源码已同步开源: [youngjuning/deno-oak-mongo-demo](https://github.com/youngjuning/deno-oak-mongo-demo)，下文只对遇到的坑做介绍，具体代码请查看源码。

### 项目骨架

```shell
.
├── .env # 使用 denv 插件来获取
├── Dockerfile
├── config # 配置文件
│   └── db.ts
├── deps.ts # 官方推荐的依赖管理方式
├── controllers # 存放路由处理器
│   ├── createBooks.ts
│   ├── deleteBook.ts
│   ├── getBookDetails.ts
│   ├── getBooks.ts
│   ├── notFound.ts
│   └── updateBook.ts
├── middlewares # 存放中间件，用于处理每个请求
│   └── error.ts
├── models # 存放模型定义
│   └── Book.ts
├── publish.sh # 发布脚本
├── router.ts # 定义路由信息
├── server.ts # 服务入口文件
├── services # 存放模型定义
│   └── books.ts
├── test.http # VSCode REST Client 文件，用来调试接口
└── utils # 工具函数
    └── getParams.ts # 将 ctx.request.url.search 转成对象
```

### 遇到的坑

> 作为一个前端工程师，为了写这篇文章，专门学了 mongodb。由于第一次接触，遇到最多的坑也是关于它的。

#### 多容器链接

1、使用 `--link` 参数链接 mongo 容器，deno_mongo 是我们指定的映射到 juejin 容器内的数据库别名（这个很重要，连接数据库时要用）

```sh
docker run -d \
  --restart always \
  --name mongo \
  -v mongo_configdb:/data/configdb \
  -v mongo_data:/data/db \
  -p 27017:27017 \
  mongo \
  --auth
docker run -d \
  --restart always \
  --name juejin \
  -p 1998:1998 \
  --link mongo:deno_mongo \
  juejin
```

2、跨容器连接时不设置身份校验，开启服务端无法连接上mongo数据库，所以必须事先配置好 mongodb 的账号密码，并通过 `mongodb://root:123456@deno_mongo:27017/` 的形式连接。

3、虽然不开启 `--auth` 是可以使用 mongo 的，但是这样不安全，强烈建议启动容器的时候加上 `--auth` 参数。

#### deno_mongo

这个插件在 run 起来的时候依赖的文件在 github 上，我卡在这里一下午。docker 启动项目后，由于容器内访问不了 github，导致一直失败。

幸运的是，码云可以同步 github 上的项目，coding 可以上传单文件不超过 20M 的文件，我成功地完成了这篇文章最后的一步：docker 部署项目。

- [插件地址](https://gitee.com/yangjunning/deno_mongo/raw/master/mod.ts)
- [依赖的文件地址](https://younguning.coding.net/p/deno_mongo/d/deno_mongo/git/raw/master)

### 使用

其他部分就没什么好说了，clone 代码后，需要先配置一下 mongodb。然后再改代码，就是直接执行 `./publish.sh` 就可以应用更改。

#### mongodb 初始配置

```sh
# 不带权限校验的模式开启 mongo
$ docker run -d \
  --restart always \
  --name mongo \
  -v mongo_data:/data/db \
  -p 27017:27017 \
  mongo \
# mongodb 默认不开启验证，只要能访问服务器，即可直接登录，所以需要配置一下账号密码进行校验。
$ docker exec -it mongo mongo admin
# 创建超级管理员
> db.createUser({ user: "root" , pwd: "123456", roles: ["root"]});
Successfully added user: {
   "user" : "root",
   "roles" : ["root"]
}
# 尝试使用上面创建的用户信息进行连接。
> db.auth("root","123456")
1
# 创建一个名为 admin，密码为 123456 的用户。
> db.createUser({ user: "admin", pwd: "123456", roles:["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]});
Successfully added user: {
   "user": "admin",
   "roles": [
   {
      "role": "userAdminAnyDatabase",
      "db": "admin"
   }
  ]
}
# 尝试使用上面创建的用户信息进行连接。
> db.auth("admin","123456")
1
```

#### 脚本

> 完成了 mongodb 的初始化配置，之后就可以使用 `./publish.sh` 一键发布应用。

1. 给脚本赋予可执行权限：`chmod a+x ./publish.sh`
2. 构建镜像并发布容器：`./publish.sh`

## 参考

- [我为 VS Code 开发了一个 Deno 插件](https://juejin.im/post/5c81c1e8e51d45535c4fe5c2)
- [VScode中测试接口代替postman](https://blog.csdn.net/weixin_43363871/article/details/104058898)
- [Docker容器化部署尝试——多容器通信（node + mongoDB + nginx）](https://juejin.im/post/6844903741523492877)
- [了不起的 Deno 实战篇](https://juejin.im/post/6844904162321252360#heading-21)
- [Deno快速入门指南](https://www.bilibili.com/video/BV1A5411x7bg)
- [Write a small API using Deno](https://dev.to/kryz/write-a-small-api-using-deno-1cl0)
- [5 Ways to Build a HTTP Server With Deno](https://medium.com/@tomanagle/5-ways-to-build-a-http-server-with-deno-3169389118aa)
- [Create a server with deno and mongo.](https://dev.to/slimhmidi/create-a-server-with-deno-and-mongo-206l)
- [【译】Deno + MongoDB 构建 CRUD API](https://mp.weixin.qq.com/s/9lgdrAXA72__i2lkzj2GNA)

## 后续

后续，我想基于本文所述的架构，开发一个婚礼请柬小程序的后台，之前不会操作数据库，曾想使用 leancloud。奋战两天之后，妈妈再也不担心我不会写接口了。最后来放上一只喝奶茶的吉祥物：

![](https://i.loli.net/2020/08/03/4VM2kKtZS1Pazwo.png)

## Catch Me

> GitHub: [youngjuning](https://github.com/youngjuning) | 微信: `yang_jun_ning` | 公众号: `前端早茶馆` | 邮箱: youngjuning@aliyun.com

|                                     微信                                     |                                     投食                                     |                                    公众号                                    |
| :--------------------------------------------------------------------------: | :--------------------------------------------------------------------------: | :--------------------------------------------------------------------------: |
| <img src="https://i.loli.net/2020/02/22/q2tLiGYvhIxm3Fl.jpg" width="200px"/> | <img src="https://i.loli.net/2020/02/23/q56X1eYZuITQpsj.png" width="200px"/> | <img src="https://i.loli.net/2020/07/28/6AyutjZ1XI4aUDV.jpg" width="200px"/> |

本文首发于[杨俊宁的博客](https://youngjuning.js.org/)，创作不易，您的点赞👍是我坚持的动力！！！

[🏆 技术专题第一期 | 聊聊 Deno的一些事儿......](https://juejin.im/post/5f1d1d97f265da22b6495ed2)
