const puppeteer = require("puppeteer");
const fs = require("fs");
// 封装爬数据方法
let puppeteerOption = {
  // headless: true, // 无头
  headless: false, // 采用有头浏览器，会打开浏览器
  // slowMo: 3000, // 每个步骤耗时3秒
  devtools: true, // 打开浏览器控制塔
};
let pageLoadOption = {
  url: "", // 目标地址
  waitDom: "", // 等待渲染的dom
  isScreenshot: false, //是否需要截取快照图片（暂时限定保存图片的名称和格式，有需求可扩展自定义）
  evaluateFn: () => "", // 自定义evaluate处理dom数据的回调函数
  isLazyLoad: false, //目标网页加载的图片是否是懒加载的
  // 懒加载时，自定义加载的参数
  lazyloadOption: {
    distance: 700, // 每次浏览器滚动距离
    delay: 1000, //滚动间隔时间，避免滚动过快，未触发图片懒加载
    waitGetDataTime: 120000, // 滚动到底后，过多久获取数据，该数据不固定，用户可自行测试，只要保证触底后该时间之后数据能拿到即可
  },
  filename: "./file.json", //文件存储地址
};
async function captureWebData(launchOption = puppeteerOption, pageOption = pageLoadOption) {
  // 创建浏览器：有无头自定义，默认有头，且打开浏览器控制台
  const browser = await puppeteer.launch(launchOption);
  // 打开新页面
  const page = await browser.newPage();
  // 覆盖浏览器的 user-agent
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36");
  // 监听console的输出:page.evaluate中运行在浏览器中的日志输出，可以通过监听在node终端输出
  page.on("console", async (message) => {
    console.log("message:", message.text());
  });
  const { url, waitDom, isScreenshot, isLazyLoad, evaluateFn, lazyloadOption, filename } = pageOption;
  // 导航到目标页
  await page.goto(url);
  // 保存页面截图：注意这个快照截图并不准确，只是一瞬间的截图，截取不到滚动部分
  await (isScreenshot && page.screenshot({ path: "screenshot.png" }));
  // 阻塞：指定页面某元素加载完成，避免page.evaluate获取元素时还没加载完
  // (该bodyHandle元素可传进page.evaluate中，作为回调函数的参数)
  const bodyHandle = await page.waitForSelector(waitDom);
  // 浏览器处理dom及数据：注意此内部回调是在浏览器执行，无法使用node模块和上文的变量。只能通过额外参数传进去
  const resData = await page.evaluate(
    async (bodyHandleDom, { isLazyLoad, evaluateFnStr }, { distance, delay, waitGetDataTime }) => {
      // resData：此处通过返回值方式把浏览器运行处理后的结果传到外部node环境中
      // 特殊说明：传递进来得参数必须是可序列化的，否则都会被处理成undefined，因此采用toString+Function的方式去序列化和反序列化拿到自定义的操作函数
      let evalStr = evaluateFnStr.substring(evaluateFnStr.indexOf("{") + 1, evaluateFnStr.lastIndexOf("}"));
      let evalFn = new Function(evalStr);
      return new Promise((resolve, reject) => {
        if (!isLazyLoad) {
          // 不需要处理页面懒加载图片时
          resolve(evalFn());
        } else {
          // 网页图片懒加载，需要特殊处理获取数据:
          // 1.手动滚动到底部，注意滚动的时间距离，保证所有图片都触发懒加载，并自定义获取指定时间后获取资源
          // 2.注意此处代码无法获取外部作用域的变量，因此如果需要自定义变量，可以通过evaluate的额外参数传递
          let totalHeight = 0;
          const timer = setInterval(() => {
            // 获取浏览器所有内容高度（每次都重新获取，因为下拉会加载更多元素）
            const scrollHeight = document.body.scrollHeight;
            // 手动滚动distance
            window.scrollBy(0, distance);
            // 滚动总高度
            totalHeight += distance;
            // 一直到滚动的总高度和浏览器高度一致时，表示滚动到底
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              let timer2 = setTimeout(() => {
                clearTimeout(timer2);
                resolve(evalFn());
              }, waitGetDataTime);
            }
          }, delay);
        }
      });
    },
    bodyHandle,
    {
      isLazyLoad,
      evaluateFnStr: evaluateFn.toString(), // 此处单独传函数会被处理成undefined， 传递的参数必须是可序列化的
    },
    lazyloadOption
  );
  console.log("resData：", resData);
  // 保存文件
  fs.writeFile(filename, JSON.stringify(resData), (err, data) => {
    if (err) {
      throw err;
    }
    console.log("文件保存成功");
  });
  // 关闭浏览器
  console.log("结束");
  await browser.close();
}

module.exports = captureWebData;
