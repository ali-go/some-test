# 说明
使用html5的api：getUserMedia去获取媒体设备，并实现截取照片和视频；

# 注意事项
- getUserMedia具有兼容性，故需要兼容处理；
- 获取视频设备时，必须是https协议或者http下的回环服务127.0.0.1；
- 本案例是使用http-server插件来在本地启动的静态服务器，详情可以搜索该插件，下面附上一些命令；
```cmd
# 全局安装
npm install http-server -g

# 默认打开的是index.html
http-server

# 考虑到我们需要启动https，使用-S
http-server -S
# 正常上面会报错，因为我们没有https证书，故启动不了，我们需要在当前目录添加证书
# 在该目录中，鼠标右键，选择Git Bash Here，用Bash打开终端，执行下面命令，加载完后一路按回车，就会生成cert.pem和key.pem；
 openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
# 再次执行http-server -S即可，就会启动https服务
http-server -S
```
- 代码中未使用async await阻塞，有兴趣可扩展实现；
- success拿到的stream是【实时】的媒体流，不是文件流，不可直接用URL.createObjectURL转成bloburl，会报错（网上有些教程这样写是不对的）；
- constraints约束可以指定获取音频还是视频，必须获取至少一个，以下几种配置：
```js
const constraints = { audio: true }; // 获取音频设备
const constraints = { video: true }; // 获取视频设备
const constraints = { video: true, audio: true  }; // 获取视频+音频设备
const constraints = { video: { facingMode: "user" } }; // 指定前置摄像头（手机端）
const constraints = { video: { exact: "environment" } }; // 后置摄像头（手机端），
const constraints = { video: { width: 480, height: 320 }, audio: true }; // 指定分辨率，不指定摄像头默认后置
```
- 使用vConsole进行手机调试控制台；
```js
// cdn方式
<script src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js"></script>
<script>
	const vConsole = new window.VConsole();
</script>

// npm方式
npm install vconsole

import VConsole from 'vconsole';
creatrd(){
const vConsole = new VConsole();
// 两种方法取其一
const vConsole = new VConsole({ theme: 'dark' });
// 打印测试
console.log('Hello world');
},
beforeDestroy() {
    vConsole.destroy();// 不需要用到时销毁
}
```
- MediaRecorder是媒体录制的api，我们获取到媒体流后，用该api进行录制（详情可看MDN）；

注意，经测试发现pc端设置约束constraints有效，移动端无效，视频两边会有白边，即用的默认的分辨率尺寸，没有用此处设置的，暂时不知道如何解决。
# 参考
- https://juejin.cn/post/7165886530324856863
- https://blog.csdn.net/RubyLinT/article/details/117281768
- https://www.cnblogs.com/echohye/p/16841643.html
- 《移动WEB前端高级开发实践》