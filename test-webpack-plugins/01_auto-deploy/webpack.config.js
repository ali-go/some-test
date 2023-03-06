const path = require("path");
const NodePolyfilWwebpackPlugin = require("node-polyfill-webpack-plugin");
module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index.js",
  },
  plugins: [new NodePolyfilWwebpackPlugin()],
  // externals: {
  //   chalk: "chalk",
  //   enquirer: "enquirer",
  //   nanospinner: "nanospinner",
  //   "node-ssh": "node-ssh",
  // },
};
