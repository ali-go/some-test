const cheerio = require("cheerio");
const https = require("https");
const fs = require("fs");
let dataArr = [];
// 获取分页数据
function getPageData(startNum) {
  let htmlStr = "";
  return new Promise((resolve, reject) => {
    https.get(`https://movie.douban.com/top250?start=${startNum}`, (res) => {
			// 监听请求到的数据
      res.on("data", (chunk) => {
        // 获取html结构
        htmlStr += chunk;
      });
			// 监听结束
      res.on("end", () => {
        // 获取html中的数据
        const $ = cheerio.load(htmlStr);
        let allFiles = [];
        // 获取每一个item的数据
        $("li .item").each(function (index) {
          const title = $(".title", this).text();
          const star = $(".info .bd .star .rating_num", this).text();
          const pic = $(".pic img", this).attr("src");
          allFiles.push({
            title,
            star,
            pic,
            id: dataArr.length + index + 1 + "",
          });
        });
        resolve(allFiles);
      });
    });
  });
}
let step = 25; // 豆瓣每页获取条数固定的25条，因此此处步数按25来
// 递归获取所有页数据
async function recuseGetData() {
  let startNum = 0;
  let resArr = [];
  do {
    resArr = [];
    resArr = await getPageData(startNum);
    dataArr = dataArr.concat(resArr);
    startNum += step;
  } while (resArr.length > 0);
}
(async function () {
  await recuseGetData();
  // 写入文件
  fs.writeFile("./files.json", JSON.stringify(dataArr), (err, data) => {
    if (err) {
      throw err;
    }
    console.log("文件保存成功");
  });
})();
