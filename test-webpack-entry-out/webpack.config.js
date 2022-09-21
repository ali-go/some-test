const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const { handleInFile, handleOutFile } = require("./src/utils/handleInOutFile");

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

// 开发环境配置
const devConfig = {
  devServer: {
    static: path.resolve(__dirname, "build"),
    compress: true,
    port: 3000,
  },
};

// 配置对象
const config = (isProd) => {
  let getConfig = {
    entry: {
      ...handleInFile(),
    },
    // 出口文件
    output: {
      publicPath: isProd ? "./" : "/",
      path: path.resolve(__dirname, "build"),
      filename: "[name].bundle.js",
      // chunkFilename为异步导入模块被打包的名称，如import()异步导入或者webpackChunkName魔法注释异步分包
      // 注意：异步导入和异步分包webpack会自动分别打包，下面只是定义名称，而这部分异步导入的运行环境代码，
      // 取决于下面的optimization.runtimeChunk是否设置了提取
      chunkFilename: "[id].chunk.js",
    },
    resolve: {
      extensions: [".ts", ".tsx", "..."],
      alias: {
        "@": resolve("src"),
      },
      // 告诉 webpack 优先 src 目录下查找需要解析的文件，会大大节省查找时间
      modules: [resolve("src"), "node_modules"],
    },
    plugins: [new CleanWebpackPlugin(), ...handleOutFile()],
  };
  if (isProd) {
    Object.assign(getConfig, devConfig, { devtool: "eval-cheap-module-source-map" });
  }
  return getConfig;
};
// 导出模块（此处采用函数形式，方便传参）
module.exports = (env, argv) => {
  let isProd = argv.mode === "production";
  return config(isProd);
};
