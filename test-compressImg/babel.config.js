// 配置babel
module.exports = {
	// presets:["@babel/preset-env"],//方式一：直接使用
	// presets:[
	//方式二：配置目标浏览器
	// 	["@babel/preset-env",{
	// 		targets:["chrome 88"],
	// 	}]
	// ]
	presets: [
		["@babel/preset-env", {
			// 设置polyfill方式----------
			// 注意可选值有三个：
			// false:不用任何的polyfill相关的代码;
			// usage:代码中需要哪些polyfill，就引入相关的polyfill;
			//entry:需手动在入口文件index.js导入core-js 和regenerator-runtime，就会根据目标浏览器引入对应的polyfill
			useBuiltIns: "usage",
			corejs: 3,//如果不设置，默认是使用2版本，但是我们安装的是3版本，就会报错，所以此处指定版本3
		}],
		// 使用解析react的jsx的babel插件预设
		// ["@babel/preset-react"],
		["@babel/preset-typescript"],
	],
	plugins: [
		// 使用babel的@babel/plugin-transform-runtime插件实现polyfill功能
		// ["@babel/plugin-transform-runtime", {
		// 	corejs: 3,//注意默认是2版本，由于我们是3所以此处改成3，并且如果是3版本必须再安装一个库：npm i @babel/runtime-corejs3 --save
		// }]
	]
}