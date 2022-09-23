## 说明
根据IntersectionObserver实现图片懒加载的封装

## 提示
- 主要针对长列表形式的图片懒加载，img元素需用数组传递；
- img原图片地址取自dom上data-src属性；
- 支持选择是否启用懒加载

## 使用
1、视口+不懒加载
```js
const imgs = document.getElementsByTagName("img");
let options = {};
let newImage = new ImgLoad([...imgs], options, (flag) => {
	console.log("成功了", flag);
});
newImage.lazyLoad();
```
2、视口+懒加载
```js
const imgs = document.getElementsByTagName("img");
let options = { lazy: true };
let newImage = new ImgLoad([...imgs], options, (flag) => {
	console.log("成功了", flag);
});
newImage.lazyLoad();
```
3、指定祖先元素+懒加载
```js
const imgs = document.getElementsByTagName("img");
let options = { root: document.querySelector(".box"), lazy: true };
let newImage = new ImgLoad([...imgs], options, (flag) => {
	console.log("成功了", flag);
});
newImage.lazyLoad();
```
4、视口+懒加载+距离视口100px
```js
const imgs = document.getElementsByTagName("img");
let options = { lazy: true, rootMargin: "100px" };
let newImage = new ImgLoad([...imgs], options, (flag) => {
	console.log("成功了", flag);
});
newImage.lazyLoad();
```
5、Vue组件中使用
```js
# template：部分代码省略
<img :data-src="require('@/assets/1.jpg')" alt="" />
<img :data-src="require('@/assets/2.jpg')" alt="" />
<img :data-src="require('@/assets/3.jpg')" alt="" />
<img :data-src="require('@/assets/4.jpg')" alt="" />

# js：部分代码省略
this.$nextTick(() => {
  const imgs = document.getElementsByTagName("img");
  let options = { lazy: true, rootMargin: "100px" };
  let newImage = new ImgLoad([...imgs], options, (flag) => {
    console.log("成功了", flag);
  });
  newImage.lazyLoad();
});
```