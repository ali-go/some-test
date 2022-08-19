// 默认情况：
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
    const filePath = path.resolve(__dirname, `.${url}`); // 注意此处必须前面加.或./因为拿到的url是绝对路径，不转成相对路径则不会拼上__diename
    ctx.set("Content-type", parseMineType(url));
    ctx.body = await parseStatic(filePath);
  }
});

app.listen("8100", () => {
  console.log("8100端口部署成功");
});
