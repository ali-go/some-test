import fs from "fs";
import path from "path";
import url from "url";

let fileUrl = import.meta.url; //文件url路径，file://协议地址
let pathUrl = url.fileURLToPath(fileUrl); // 转成url磁盘地址
let __dirname = path.dirname(pathUrl); // 获取该文件文件夹地址
console.log(fileUrl, pathUrl, __dirname);

const projectDir = process.cwd();
console.log(projectDir);

const files = fs.readdirSync(path.join(__dirname, "template"));
files.forEach((template) => {
  let str = path.join(__dirname, "template", template);
  console.log(str);
  let data = path.parse(str);
  console.log(data);
});
console.log(files);
