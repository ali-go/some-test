const Router = require("koa-router");

const { create } = require("../middleware/pdf.middleware.js");
const { open } = require("../controller/pdf.controller.js");
const pdfRouter = new Router();

pdfRouter.get("/createPdf", create, open);

module.exports = pdfRouter;
