const path = require("path");
const fs = require("fs");

// 带有env文件地址的类型
interface OptionType {
  path?: string; // 注意是绝对路径
  isLog?: boolean;
}
// 参数类型
type argType = undefined | OptionType;

const NEWLINES_MATCH = /\r\n|\r|\n/; //匹配换行和回车符号
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/; //匹配键=值对

// 处理env文件参数
function config(options: argType = undefined) {
  let dotenvPath = path.resolve(process.cwd(), ".env");
  let debug = false;
  let encoding = "utf8";

  if (options?.path) {
    dotenvPath = options.path;
  }
  if (options?.isLog) {
    debug = options.isLog;
  }

  let error = null,
    parsed: any = {};
  try {
    parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug });
    Object.keys(parsed).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key];
      } else if (debug) {
        console.log(`${key} is already defined in process.env and will not be overwritten`);
      }
    });
  } catch (e) {
    error = e;
  }

  return error != null ? [error, null] : [null, parsed];
}

interface debugType {
  debug: boolean;
}
// 解析.env文件内容
function parse(src: string, options: debugType) {
  let obj: any = {};
  src.split(NEWLINES_MATCH).forEach((line, index) => {
    let keyValArr = line.match(RE_INI_KEY_VAL);
    if (keyValArr != null) {
      const key = keyValArr[1];
      const val = keyValArr[2] || "";
      obj[key] = val.trim();
    } else if (options.debug) {
      console.log(`did not match key and value when parsing line ${index + 1}`);
    }
  });
  return obj;
}

export { config };

// let res1 = config();
// console.log("res1:", res1);
// let res2 = config({ path: path.resolve(__dirname, "./.env.ali") });
// console.log("res2:", res2);
// console.log(process.env);
