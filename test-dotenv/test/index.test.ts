const path = require("path");

const { config } = require("../index");
describe("测试dotenv", () => {
  it(".env文件不传参", () => {
    let res1 = config(undefined);
    expect(res1[1]).toBeNull();
  });
  it(".env文件传参", () => {
    let res2 = config({ path: path.resolve(__dirname, ".env") });
    expect(res2).toEqual([null, { NODE_ENV: "TEST", AGE: "18", NAME: "" }]);
  });
});
