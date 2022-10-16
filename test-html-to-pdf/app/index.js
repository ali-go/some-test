const Koa = require("koa");
const allRoutes = require("../router");
const errorHandler = require("./error-handle.js");

const app = new Koa();
app.allRoutes = allRoutes;
app.allRoutes();

app.on("error", errorHandler);

module.exports = app;
