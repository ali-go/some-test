const open = async (ctx, next) => {
  ctx.body = {
    message: "ζεδΊ",
    status: 200,
  };
};

module.exports = {
  open,
};
