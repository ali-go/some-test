const { NodeSSH } = require("node-ssh");
const getPromptInfo = require("./action");
const { createSpinner } = require("nanospinner");
const chalk = require("chalk");
// 定义自动上传部署的插件
class AutoUploadPlugin {
  constructor() {
    this.ssh = new NodeSSH(); // 初始化服务器对象
  }
  // 主入口：
  apply(compiler) {
    // tapAsync异步方法
    compiler.hooks.afterEmit.tapAsync("AutoUploadPlugin", async (compilation, callback) => {
      // 获取用户输入的服务器信息：
      const info = await getPromptInfo();
      const spinner = createSpinner("run").start();
      spinner.success({ text: chalk.bold.cyan("服务器信息获取成功，正在建立连接...") });
      try {
        await this.connectServer(info);
        spinner.success({ text: chalk.bold.green("服务器链接成功！") });
        spinner.success({ text: chalk.bold.cyan("开始上传文件...") });
        // 获取本地打包目录
        const outputPath = compilation.outputOptions.path;
        // 设置服务器存储路径
        const serverPath = info.dirPath; //注意此处是自定义
        // 移除原路径下所有文件
        await this.ssh.execCommand(`rm -rf ${serverPath}/*`);
        try {
          await this.uploadFile(outputPath, serverPath);
          spinner.success({ text: chalk.bold.green("文件部署成功！") });
        } catch (error) {
          spinner.error({ text: chalk.bold.red("文件部署失败！") });
          console.log(error);
        }
      } catch (error) {
        spinner.error({ text: chalk.bold.red("服务器链接失败！") });
        console.log(error);
      }
      process.exit(0);
    });
  }
  // 连接服务器
  connectServer({ host, username, password }) {
    return this.ssh.connect({ host, username, password });
  }
  // 上传文件
  uploadFile(loaclPath, serverPath) {
    return this.ssh.putDirectory(loaclPath, serverPath, {
      recursive: true, // 递归上传
      concurrency: 10, //并发数
    });
  }
}

module.exports = AutoUploadPlugin;
