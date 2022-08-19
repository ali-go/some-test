// 协商缓存：客户端根据第一次从服务端拿到的缓存标识去发送给服务器，服务器如果应答命中缓存，则客户端从本地缓存取，否则服务器返回数据；
// 注意：和强缓存不同，协商缓存后面依旧会发送请求到服务器，如果命中的是缓存则状态码是304，否则正常请求数据；
const Koa = require("koa");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

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

// 根据文件路径获取后缀名，匹配响应类型
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

// 获取文件的最新更新时间
function parseUpdateTime(dir) {
  // console.log(dir, "++++++==");
  return new Promise((resolve, reject) => {
    const res = fs.statSync(dir);
    // console.log(res)
    resolve(res.mtime);
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
    // 方式一：Last-Modified，If-Modified-Since
    // 此时我们要手动拿到对应文件最近更新日期,作为文件的缓存标识，并根据标识去匹配客户端传来的If-Modified-Since是否一致，来决定是返回304还是返回新数据
    // 注意：这里是后端手动处理这个是否命中缓存，而不是自执行的
    // const ifModifiedSince = ctx.request.headers["if-modified-since"]; // 获取客户端传来的上次更新时间
    // const updateTime = await parseUpdateTime(filePath); // 获取文件最新更新时间，下面需要转成gmt时间格式
    // ctx.set("Cache-Control", "no-cache"); // 一定要设置不走强缓存
    // // ctx.set("Last-Modified", updateTime.toGMTString()); // 其实这个可以直接写在下面没命中缓存里面
    // if (ifModifiedSince === updateTime.toGMTString()) {
    //   ctx.status = 304;
    // } else {
    //   ctx.set("Last-Modified", updateTime.toGMTString()); //更新最新的修改时间，保证下一次请求头的if-modified-since是最新的
    //   ctx.body = await parseStatic(filePath);
    // }

    // 方式二：Etag，If-None-Match
    // 注意由于需要根据文件内容去获取hash标识，因此需要插件加密文件获取标识，node内置模块crypto中有hash功能
    const fileBuffer = await parseStatic(filePath);
    const hash = crypto.createHash("md5");
    hash.update(fileBuffer);
    const etag = hash.digest("hex");
    const ifNoneMatch = ctx.request.headers["if-none-match"];
    // ctx.set("etag", etag); // 其实这个可以直接写在下面没命中缓存里面
    if (etag === ifNoneMatch) {
      ctx.status = 304;
    } else {
      ctx.set("etag", etag); // 更新最新的hash值，保证下一次的if-none-match是最新的
      ctx.body = fileBuffer;
    }
    console.log(etag, "++++++");
  }
});

app.listen("8100", () => {
  console.log("8100端口部署成功");
});

// 补充说明：
// 1.经测试发现，不论是Last-Modified，If-Modified-Since还是Etag，If-None-Match方式的协商缓存，有时候命中了缓存，依旧可能返回200状态码；
// 2.经测试发现，有时候交互的请求，请求头信息中出现【Provisional headers are shown】信息，导致请求头信息不全；
// 3.当出现200状态码，光看响应头，有我们上面设置的标识，但是依旧不确定是否命中缓存时，可以对【Disabled cache】勾上看size请求的数据包大小和去掉时
// 差异，如果从这里看出差异很大，确定命中了缓存；
