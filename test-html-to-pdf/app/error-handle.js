// 声明：koa中间件抛出的错误统一处理

const errorHandler = (error, ctx) => {
  let status, message;

  switch (error.message) {
    case 'fail':
      status = 400;
      message = "下载失败";
      break;
    default:
      status = 404;
      message = "NOT FOUND~";
  }
  ctx.status = status;
  ctx.body = message;
};

module.exports = errorHandler;
