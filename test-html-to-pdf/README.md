## 说明
将打开的html页面转换成pdf文件，并下载（部分功能待扩展），本实例只阐述node中的使用，其余情况环境可参考附录中文档说明。

- 使用的puppeteer插件创建谷歌无头浏览器；
- 创建浏览器的tab页；
- 跳到指定的网页地址；
- 设置条件等待，比如网络请求完成、img资源文件加载完成、dom元素加载完成等等；
- 调用打印pdf的api，把页面资源转换成pdf；
- 下载；

**附录**
- https://pptr.dev/api/puppeteer.puppeteernode/