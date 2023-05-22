const captureWebData = require("../lib.js");
// 抓包
captureWebData(
  // { headless: false, devtools: true },
  // { headless: true, args: ["--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure,InterestCohort"] },
  { headless: true },
  {
    url: "https://pixabay.com/",
    waitDom: ".column--ly2DC",
    isScreenshot: true,
    evaluateFn: function () {
      let arrData = [];
      const contents = document.querySelector(".column--ly2DC");
      const items = contents.querySelectorAll(".cell--B7yKd");
      for (let i = 0; i < items.length; i++) {
        const item = items[i].querySelector(".container--MwyXl");
        const a = item.querySelector("a");
        const imgWrap = a.querySelector(".link--WHWzm");
        // const infoWrap = a.querySelector(".info-wrapper");
        const pic = imgWrap.querySelector("img").src;
        // const title = infoWrap.querySelector(".title").innerText;
        arrData.push({ pic, id: i + 1 });
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
