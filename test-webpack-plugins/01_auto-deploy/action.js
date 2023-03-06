const enquirer = require("enquirer");
const path = require("path");
const question = [
  {
    type: "input",
    name: "host",
    message: "请输入服务器域名：",
  },
  {
    type: "input",
    name: "dirPath",
    message: "请输入服务器部署路径(如：root/test)：",
  },
  {
    type: "input",
    name: "username",
    message: "请输入用户名：",
  },
  {
    type: "password",
    name: "password",
    message: "请输入密码：",
  },
];

async function getPromptInfo() {
  const data = await enquirer.prompt(question);
  const dirPath = path.join("/", data.dirPath);
  return { ...data, dirPath };
}

module.exports = getPromptInfo;
