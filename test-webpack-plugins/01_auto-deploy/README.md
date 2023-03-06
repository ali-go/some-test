## 说明
基于webpack的插件，将打包后的文件部署到服务器指定的目录下。
## 使用
```js
// webpack.config.js文件
const AutoDeployServer = require("auto-deploy-server");

module.exports = {
	///...省略其他
	//...
	plugins:[
		//...省略其他
		new AutoDeployServer()
	]
};

```