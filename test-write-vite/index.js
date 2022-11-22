// 部署静态服务器，访问静态服务器地址，手动读取html、js、vue、第三方模块文件
const fs = require("fs");
const path = require("path");

const Koa = require("koa");
const compilerSfc = require("@vue/compiler-sfc");
const compilerDom = require("@vue/compiler-dom");

const app = new Koa();

app.use(async (ctx) => {
  const { url, query } = ctx.request;
  console.log("url:", url);
  //1. / => html
  if (url === "/") {
    ctx.type = "text/html";
    let content = fs.readFileSync("./index.html", "utf-8");
    // 手动插入假的环境变量，防止使用vue报错
    content = content.replace(
      "<script",
      `
			<script>
			window.process = {
				env: {
					NODE_ENV: 'development'
				}
			}
			</script>
			<script`
    );
    ctx.body = content;
  }
  // 2. *.js => src/*.js
  if (url.endsWith(".js")) {
    const p = path.resolve(__dirname, url.slice(1));
    ctx.type = "application/javascript";
    const content = fs.readFileSync(p, "utf-8");
    ctx.body = writeImport(content);
  }

  // 3.支持第三方库（处理重写后的/@modules路径，指向node_modules）
  else if (url.startsWith("/@modules")) {
    const prefix = path.resolve(__dirname, "node_modules", url.replace("/@modules/", ""));
    const module = require(prefix + "/package.json").module;
    const p = path.resolve(prefix, module);
    const ret = fs.readFileSync(p, "utf-8");
    ctx.type = "application/javascript";
    // 注意：vue内部使用了process.env.NODE_ENV，此处我们需要手动创建假的这个环境变量
    // 我们加在上面读取html文件的地方，手动加一个script脚本
    ctx.body = writeImport(ret);
  }

  // 4.处理.vue文件
  // 需要使用@vue/compiler-sfc插件编译vue文件成script + template;
  // 需要使用@vue/compiler-dom插件编译template成render函数;
  else if (url.indexOf(".vue") > -1) {
    const p = path.resolve(__dirname, url.split("?")[0].slice(1));
    const { descriptor } = compilerSfc.parse(fs.readFileSync(p, "utf-8"));
    // 处理script：并把二次请求的template处理后render函数作为__script对象的属性
    // console.log(descriptor);
    if (!query.type) {
      const scriptRes = descriptor.script.content.replace("export default", "const __script =");
      // console.log(scriptRes);
      ctx.type = "application/javascript";
      ctx.body = `
			${writeImport(scriptRes)}
			import { render as __render} from "${url}?type=template"
			__script.render = __render;
			export default __script;
			`;
    } else {
      // 处理template：当做二次请求，不直接处理
      const template = descriptor.template;
      const render = compilerDom.compile(template.content, { mode: "module" });
      // console.log('render',render)
      ctx.type = "application/javascript";
      ctx.body = writeImport(render.code);
    }
  }

  // 5.处理css文件：转成js，插入css文件内容到link，并插入到head
  else if (url.endsWith(".css")) {
    const p = path.resolve(__dirname, url.slice(1));
    const file = fs.readFileSync(p, "utf-8");

    // 转js(下面需要把css内容用\s去掉所有换行制表符，否则转字符串带换行的会报错)
    const content = `
		const css =  "${file.replace(/[\s]/g, '')}";
		const link = document.createElement('style');
		link.setAttribute('type','text/css');
		document.head.appendChild(link);
		link.innerHTML = css;
		`;
    ctx.type = "application/javascript";
    ctx.body = content;
  }

  // 改写函数：重写import导入，对内容处理导入的代码。如果是模块导入拼接/@modules/***，否则./或者/则直接返回该导入代码
  // from "***" => from "/@modules/***"
  function writeImport(content) {
    return content.replace(/ from ['"]([^'"]+)['"]/g, (s0, s1) => {
      if (s1[0] !== "." && s1[0] !== "/") {
        return ` from '/@modules/${s1}'`;
      } else {
        return s0;
      }
    });
  }
});

app.listen(3000, () => {
  console.log("3000端口服务启动成功");
});
