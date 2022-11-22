import gradient from "gradient-string";
console.log(gradient.morning('\n 这是gradient-string的渐变色插件文本\n'))
console.log(gradient.rainbow('\n 这是gradient-string的渐变色插件文本\n'))

let str = gradient('red','green')('\n这是gradient-string的渐变色插件文本\n');
console.log(str)