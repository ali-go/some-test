## 说明
基于vue3 + ts的项目demo形式去实现虚拟列表。

## 文件
- `views/VituralList.vue`文件是虚拟列表的路由组件；
- `views/copms/ListEase.vue`文件是虚拟列表的实际实现文件，每一项固定高度，支持自定义；
- `views/copms/ListComplex.vue`文件是虚拟列表的实际实现文件，每一项不固定；
- `views/config/test.ts`文件是自定义创建列表数据的测试文件；

## 摘要
本文的实现参考掘金文章：https://juejin.cn/post/6844903982742110216


## 补充
虚拟列表主要用于解决特定场景的dom列表：
- 知道具体高度的简单的非常多个的dom列表；
- 不知道具体高度，但是每一个dom高度统一，且内部结构一致，可用v-for遍历的dom列表；
- 不知道具体高度，且内部dom比较简单但是高度又不一致的dom列表，可用v-for遍历的dom列表；

