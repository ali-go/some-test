// 本文件对请求设置强缓存：考虑到html文件不应该缓存，只对静态文件强缓存
// 注意：强缓存只要没过期，都会从缓存取，缓存的数据请求时不会和服务器交互，且状态码是200；

const Koa = require("koa");
const path = require("path");
const fs = require("fs");

// 设置不同文件类型对应的响应数据类型
const mimes = {
  css: "text/css",
  less: "text/css",
  gif: "image/gif",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  pdf: "application/pdf",
  png: "image/png",
  svg: "image/svg+xml",
  swf: "application/x-shockwave-flash",
  tiff: "image/tiff",
  txt: "text/plain",
  wav: "audio/x-wav",
  wma: "audio/x-ms-wma",
  wmv: "video/x-ms-wmv",
  xml: "text/xml",
};

// 根据文件路径获取后缀名，获取响应类型
function parseMineType(url) {
  let extName = path.extname(url);
  extName = extName ? extName.slice(1) : "unknown";
  return mimes[extName];
}

// 根据J静态文件路径获取文件，并返回给前端
function parseStatic(dir) {
  console.log(dir);
  return new Promise((resolve, reject) => {
    const res = fs.readFileSync(dir);
    // resolve(res, "binary");
    resolve(res);
  });
}

const app = new Koa();

// 注册中间件
app.use(async (ctx, next) => {
  const url = ctx.request.url;
  // 默认返回html文件
  if (url === "/") {
    ctx.set("Content-type", "text/html");
    ctx.body = await parseStatic("./index.html");
  } else {
    const filePath = path.resolve(__dirname, `./${url}`); // 注意此处必须前面加.或./因为拿到的url是绝对路径，不转成相对路径则不会拼上__diename
    ctx.set("Content-type", parseMineType(url));
    // 方式一：使用expires，注意时间是gmt时间。此处设置10秒过期，10秒内怎么刷新都取缓存，过了请求服务器
    // const time = new Date(Date.now() + 10000).toGMTString();
    // ctx.set("Expires", time);

    // 方式二：cache-control设置max-age，这里设置10秒钟。
    ctx.set("cache-control", "max-age=10");
    ctx.body = await parseStatic(filePath);
  }
});

app.listen("8100", () => {
  console.log("8100端口部署成功");
});
