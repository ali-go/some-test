// 声明：处理所有的路由导入和使用

const fs = require("fs");

// 方式一：接收app为参数
// const allRoutes = (app) => {
//   fs.readdirSync(__dirname).forEach((file) => {
//     if (file === "index.js") return;
//     const router = require(`./${file}`);
//     app.use(router.routes());
//     app.use(router.allowedMethods());
//   });
// };

// 方式二：该方法会挂到app对象上，使用this加载中间件
const allRoutes = function () {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === "index.js") return;
    const router = require(`./${file}`);
    this.use(router.routes());
    this.use(router.allowedMethods());
  });
};
module.exports = allRoutes;
