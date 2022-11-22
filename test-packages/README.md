## 说明
测试部分npm插件及一些特殊方法模块。

**插件**
- chalk:文字显示指定的颜色（终端可log输出）；
- gradient-string：文字渐变色（终端可log输出）
- enquirer:终端交互的插件（如输入、选择...）
- nanospinner:给终端加执行状态动画（如开始、成功、失败、警告...）

**模块**
- path的join:拼接路径，注意resolve是获取绝对路径；
- path的parse:对文件地址解析，转成对象，包含文件名、后缀、目录地址等；
- import.meta.url：获取当前文件的file协议的地址；
- url的fileURLToPath：可以把file协议地址转成磁盘路径；
- fs的readFileSync:同步读取文件；
- fs的readdirSync:同步读取目录；
- 

**其他**
- JSON.stringify：第三个参数如果是字符串，则作为缩进对应的字符串，如果是数字则缩进对应数量空格；
- 
