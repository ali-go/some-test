"use strict";
exports.__esModule = true;
exports.config = void 0;
var path = require("path");
var fs = require("fs");
var NEWLINES_MATCH = /\r\n|\r|\n/; //匹配换行和回车符号
var RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/; //匹配键=值对
// 处理env文件参数
function config(options) {
    if (options === void 0) { options = undefined; }
    var dotenvPath = path.resolve(process.cwd(), ".env");
    var debug = false;
    var encoding = "utf8";
    if (options === null || options === void 0 ? void 0 : options.path) {
        dotenvPath = options.path;
    }
    if (options === null || options === void 0 ? void 0 : options.isLog) {
        debug = options.isLog;
    }
    var error = null, parsed = {};
    try {
        parsed = parse(fs.readFileSync(dotenvPath, { encoding: encoding }), { debug: debug });
        Object.keys(parsed).forEach(function (key) {
            if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
                process.env[key] = parsed[key];
            }
            else if (debug) {
                console.log("".concat(key, " is already defined in process.env and will not be overwritten"));
            }
        });
    }
    catch (e) {
        error = e;
    }
    return error != null ? [error, null] : [null, parsed];
}
exports.config = config;
// 解析.env文件内容
function parse(src, options) {
    var obj = {};
    src.split(NEWLINES_MATCH).forEach(function (line, index) {
        var keyValArr = line.match(RE_INI_KEY_VAL);
        if (keyValArr != null) {
            var key = keyValArr[1];
            var val = keyValArr[2] || "";
            obj[key] = val.trim();
        }
        else if (options.debug) {
            console.log("did not match key and value when parsing line ".concat(index + 1));
        }
    });
    return obj;
}
// let res1 = config();
// console.log("res1:", res1);
// let res2 = config({ path: path.resolve(__dirname, "./.env.ali") });
// console.log("res2:", res2);
// console.log(process.env);
