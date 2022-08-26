## 说明
根据用户上传的file图片文件，自定义尺寸的压缩图片（如果指定尺寸超过原图片尺寸，则返回原图片）。
**思路：**
1. 获取上传的file文件，使用FileReader读取文件，转成url；
2. 使用img加载这个url（因为后面会用canvas的drawImage绘制图片需要img对象）;
3. drawImage绘制图像，并指定尺寸（注意宽>高时，尺寸比以宽为基础，宽<高时，尺寸比以高为基础）；
4. 使用canvas.toBlob()拿到绘制图像后的blob对象（注意此处也可以设置blob对象类型type，和blob对象图片对象的质量quality）