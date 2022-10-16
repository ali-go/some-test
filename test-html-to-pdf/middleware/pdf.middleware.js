const fs = require("fs");
const path = require("path");
const { launch } = require("puppeteer");

const create = async (ctx, next) => {
  const { filename, url } = ctx.query;
  console.log(filename, url);
  const startTime = Date.now();
  // 创建无头浏览器（回头查看option）
  const browser = await launch({
    timeout: 60 * 1000,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  console.log("browser is ready");
  // 创建tab页
  const page = await browser.newPage();
	// 回车
	await page.keyboard.press('Enter');
  console.log("page is ready");
  // 监听tab打开错误
  page.on("pageerror", (err) => {
    console.log(err);
  });
  console.log("ready to download");
  // 转义url并打开
  await page.goto(decodeURIComponent(url), { waitUntil: "load" });
  // 等待渲染完成（做几个判断）
  await page.waitForSelector("img", { timeout: 0 }); //等待img加载完成
  await page.waitForNetworkIdle(); //等待网络请求完成
  console.log("render is complete");

  // 创建打印预览pdf
  const pdf = await page.pdf({
    format: "A4",
    // displayHeaderFooter:true
    printBackground: true,
    margin: { top: "88px", right: "30px", bottom: "60px", left: "30px" },
    headerTemplate: ``,
    footerTemplate: ``,
  });

  console.log("create pdf:", Date.now() - startTime);
	// 保存下截图
	const img = await page.screenshot({
		fullPage: true,
		encoding: 'binary',
	});
  // 关闭tab页
  await browser.close();
	
  const pdfName = decodeURIComponent(filename);
  // console.log(pdfName, pdf);
  try {
		// 注意writeFileSync路径是相对终端执行路径，此处最好使用绝对路径处理，保证存储位置正确
		fs.writeFileSync(path.resolve(__dirname, `../img/${pdfName}.png`), img);
    fs.writeFileSync(path.resolve(__dirname, `../pdf/${pdfName}.pdf`), pdf);
    console.log("write complete");
    await next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  create,
};
