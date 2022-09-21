const path = require("path");
const { config } = require("test-dotenv");
config({ path: path.resolve(__dirname, "./.env.example") });
const { NAME, AGE, INTTEREST } = process.env;
console.log(NAME, AGE, INTTEREST);
