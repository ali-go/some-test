import enquirer from "enquirer";
const question = [
  {
    type: "input",
    name: "username",
    message: "请输入你的账户:",
  },
  {
    type: "password",
    name: "password",
    message: "请输入密码：",
  },
  {
    type: "select",
    name: "color",
    message: "Favorite color?",
    initial: 1,
    choices: [
      { name: "red", message: "红色", value: "#ff0000" }, //<= choice object
      { name: "green", message: "绿色", value: "#00ff00" }, //<= choice object
      { name: "blue", message: "蓝色", value: "#0000ff" }, //<= choice object
    ],
  },
];
let data = await enquirer.prompt(question);
console.log(data);
