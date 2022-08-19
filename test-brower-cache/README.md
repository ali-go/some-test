## 说明

本文是测试浏览器缓存的方式，包括强缓存和协商缓存和不使用缓存；
本文是通过后端设置响应头的方式去指定缓存方式，本案例采用的是node + koa；
本文html/css/js等文件都是由服务器返回；

1. 强缓存：设置一个缓存时间，在这个时间范围内，除了第一次，后面都不会请求服务器，而直接取本地缓存的数据；
- 方式一：expires
这是 http1.0 时的规范；它的值为一个绝对时间的GMT格式的时间字符串，如Mon, 10 Jun 2015 21:31:12 GMT，如果发送请求的时间在expires之前，那么本地缓存始终有效，否则就会发送请求到服务器来获取资源。
例如：
```js
// ctx.set('Expires', 'Mon, 10 Jun 2015 21:31:12 GMT');
const time = new Date(Date.now() + 30000).toGMTString()
ctx.set('Expires', time)
```
- 方式二：使用cache-control
这是 http1.1 时出现的header信息，主要是利用该字段的max-age值来进行判断，它是一个相对值；资源第一次的请求时间和Cache-Control设定的有效期，计算出一个资源过期时间，再拿这个过期时间跟当前的请求时间比较，如果请求时间在过期时间之前，就能命中缓存，否则就不行；cache-control 的设置与否在于服务器，都是在服务器端设置的，前端不需要做任何事情。
解释:
max-age=100:缓存100秒后过期，资源缓存在本地
no-cache:	不使用本地缓存。使用协商缓存，先与服务器确认返回的响应是否被更改，如果之前的响应中存在ETag，那么请求的时候会与服务端验证，如果资源未被更改，则可以避免重新下载。
no-store:	所有内容都不会被缓存，既不使用强制缓存也不适用协商缓存，每次用户请求该资源，都会向服务器发送一个请求，服务器再返回资源
public:	可以被所有的用户缓存，包括客户端和代理服务器
private:	只能被客户端缓存，不允许CDN等中继缓存服务器对其缓存
s-maxage:	覆盖 max-age，作用与max-age一样，但只用于代理服务器中缓存

例如：
```js
ctx.set('Cache-Control', 'max-age=30')
```

**注意：如果 cache-control 与 expires 同时存在的话，cache-control 的优先级高于 expires**
另外如果要使用协商缓存，则cache-control要先设置成no-cache。


2. 协商缓存：协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程

当浏览器再次请求该资源时，浏览器向服务器发送请求和资源标识，服务器这时就会去判断当前请求的资源浏览器本次缓存的版本跟服务器里面资源最新的版本是否一致：
如果版本一致，服务器返回 304 状态码，重定向让浏览器直接在本地缓存里拿资源；
如果版本不一致，服务器返回 200 状态码、最新的资源以及新的资源标识，浏览器更新本地缓存。


有两种方式可以实现协商缓存：二选一
- Last-Modified/If-Modified-Since：指资源上一次修改的时间
- Etag/If-None-Match：资源对应的唯一字符串

If-Modified-Since能检查到的精度是s级的，某些服务器不能精确的得到文件的最后修改时间。
Etag检测文件内容。
Last-Modified与ETag是可以一起使用的，服务器会优先验证ETag，一致的情况下，才会继续比对Last-Modified，最后才决定是否返回304。

- 方式一：Last-Modified/If-Modified-Since
例如：
```js
ctx.set('Cache-Control', 'no-cache')
const time = new Date(Date.now() + 30000).toGMTString(); // 注意实际开发肯定不是这么拿时间，会拿到文件的更新事件
ctx.set('Last-Modified', time)
```

- 方式二：Etag/If-None-Match

例如：
```js
ctx.set('Cache-Control', 'no-cache')
ctx.set('etag', etag); // 注意这个etag变量其实是根据文件内容使用md5加密的hash值，这样就保证文件内容标识唯一了
```

具体操作可以参考该项目实际内容。


引用申明：
————————————————
版权声明：本文为CSDN博主「Martian_小小」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/weixin_45950819/article/details/123087074