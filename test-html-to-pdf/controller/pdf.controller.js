const open = async (ctx, next) => {
  ctx.body = {
    message: "成功了",
    status: 200,
  };
};

module.exports = {
  open,
};
