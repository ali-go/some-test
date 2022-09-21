const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 处理page目录下的多个入口文件
const handleInFile = () => {
  let obj = {};
  let inPath = path.resolve(__dirname, "../page/");
  const files = fs.readdirSync(inPath);
  files.forEach((file) => {
    let key = path.parse(file).name;
    obj[key] = path.resolve(inPath, file);
  });
  return obj;
};

// 处理template目录下多个出口html模板，并指定入口和出口匹配
const handleOutFile = () => {
	console.log(22)
  const obj = handleInFile();
  return Object.keys(obj).map((item) => {
    let name = path.parse(obj[item]).name;
    return new HtmlWebpackPlugin({
      template: path.join(obj[item], "../../../", `template/${name}.html`),
      chunks: [name],
      filename: `${name}.html`,
    });
  });
};

module.exports = {
  handleInFile,
  handleOutFile,
};
