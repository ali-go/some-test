// 从node中导入获取绝对路径的方法
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); //导入插件
const HtmlWebpackPlugin = require("html-webpack-plugin"); //导入插件
// 导出模块
module.exports = {
  mode: "development", //默认是production
  devtool: "source-map",
  entry: "./index.ts", //配置打包入口
  output: {
    filename: "js/bundle.js", //设置打包后的文件名
    path: path.resolve(__dirname, "./build"), //设置拼接打包路径,
    // assetModuleFilename:"image/[name].[hash:6][ext]"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        // use: "ts-loader",//1、使用ts-loader解析typescript
        use: "babel-loader", //2、使用babel-loader解析typescript（但是得安装typescript的预设插件）
      },
    ],
  },
  // 配置插件
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "阿离 Webpack",
      template: "./index.html",
    }),
  ],
  devServer: {
    host: "127.0.0.1",
    port: "8081",
  },
};
