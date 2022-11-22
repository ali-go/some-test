import { str } from "./moduleA.js";

const a = 1;
const b = 2;
console.log(a + b);
console.log(str);

import { createApp, h } from "vue";
// 模板方式
// const App = {
//   render() {
//     return h("div", null, h("div", null, "你好，阿离，这里是手写基础vite"));
//   },
// };
// 组件方式
import App from "./App.vue";
// console.log(App)
import "./index.css";

createApp(App).mount("#app");
