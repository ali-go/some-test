const path = require("path");
const fs = require("fs");

const Koa = require("koa");
const Router = require("koa-router");
const { koaBody } = require("koa-body");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const router = new Router();
// 处理body参数
app.use(bodyParser());
// 处理跨域
app.use(
  cors({
    origin: function (ctx) {
      console.log("url:", ctx);
      const whiteList = ["http://127.0.0.1:5173", "http://localhost:8081"]; //可跨域白名单
      let url = ctx.header.referer.substr(0, ctx.header.referer.length - 1);
      if (whiteList.includes(url)) {
        return url; // 注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了
      }
      //设置允许来自指定域名请求
      // if (ctx.url === "/upload") {
      //   return "*"; // 允许来自所有域名请求
      // }
      return "http://localhost:8081"; //只允许http://localhost:8081这个域名的请求
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
    allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], //设置获取其他自定义字段
  })
);
// 上传接口
const outputPath = path.join(__dirname, "resources");
let currChunk = null;
router.post(
  "/upload",
  // 处理文件
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: outputPath,
      onFileBegin: (name, file) => {
        console.log("name:", name, file);
        const [filename, fileHash, index] = name.split("-");
        const dir = path.join(outputPath, filename);
        console.log("dir", dir);
        // 保存当前 chunk 信息，发生错误时进行返回
        currChunk = {
          filename,
          fileHash,
          index,
        };
        // 检查文件夹是否存在如果不存在则新建文件夹
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        // 覆盖文件存放的完整路径
        file.filepath = path.join(dir, `${fileHash}-${index}`);
        console.log("file.path", file.filepath);
      },
      onError: (error) => {
        app.status = 400;
        app.body = { code: 400, msg: "上传失败", data: currChunk };
        return;
      },
    },
  }),
  // 处理响应
  async (ctx, next) => {
    ctx.set("Content-Type", "application/json");
    ctx.body = JSON.stringify({
      code: 200,
      message: "上传成功",
    });
  }
);

// 管道读写文件
const pipeStream = (path, writeStream) => {
  return new Promise((resolve) => {
    const readStream = fs.createReadStream(path);
    readStream.pipe(writeStream);
    readStream.on("end", () => {
      fs.unlinkSync(path); // 合并后删除该切片文件
      resolve();
    });
  });
};
// 合并chunk
const mergeFileChunk = async (filePath, filename, size) => {
  const chunkDir = path.join(outputPath, filename);
  const chunkPaths = fs.readdirSync(chunkDir);
  if (!chunkPaths.length) return;
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
  console.log("chunkPaths", chunkPaths);
  await Promise.all(
    chunkPaths.map((chunkPath, index) =>
      pipeStream(
        path.join(chunkDir, chunkPath),
        // 指定位置创建可写流
        fs.createWriteStream(filePath, {
          start: index * size,
          end: (index + 1) * size,
        })
      )
    )
  );
  // 合并后删除保存切片的目录
  fs.rmdirSync(chunkDir);
};

// 合并接口
router.post(
  "/mergeChunks",
  async (ctx, next) => {
    // console.log("ctx", ctx.request.body);
    const { filename, size } = ctx.request.body;
    // 合并chunk
    await mergeFileChunk(path.join(outputPath, "_" + filename), filename, size);
    next();
  },
  async (ctx, next) => {
    ctx.set("Content-Type", "application/json");
    ctx.body = JSON.stringify({
      code: 2000,
      message: "合并成功",
    });
  }
);

app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务
app.listen("3001", () => {
  console.log("3001服务启动成功");
});
