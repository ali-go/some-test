const captureWebData = require("../lib.js");
// 抓包
captureWebData(
  // { headless: false, devtools: true },
  { headless: true },
  {
    url: "https://www.taobao.com/",
    waitDom: ".tb-recommend-content",
    isScreenshot: true,
    evaluateFn: function() {
      let arrData = [];
      const contents = document.querySelector(".tb-recommend-content");
      const items = contents.querySelectorAll(".tb-recommend-content-item");
      for (let i = 0; i < items.length; i++) {
        const a = items[i].querySelector("a");
        const imgWrap = a.querySelector(".img-wrapper");
        const infoWrap = a.querySelector(".info-wrapper");
        const pic = imgWrap.querySelector("img").src;
        const title = infoWrap.querySelector(".title").innerText;
        arrData.push({ pic, title });
      }
      console.log("arrData：", arrData);
      return arrData;
    },
    isLazyLoad: true,
    lazyloadOption: {
      distance: 500,
      delay: 900,
      waitGetDataTime: 10000,
    },
    filename: "./taobao.json",
  }
);
