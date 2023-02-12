<template>
  <div class="vitural-list">
    <div class="btn">
      <h3>左边高度固定</h3>
      <button @click="changeData">确定</button>
      <h3>右边高度不固定</h3>
    </div>
    <div class="kind-box">
      <list-ease :itemSize="40" :listData="listEasyData"></list-ease>
      <list-complex
        :estimatedItemSize="40"
        :listData="listComplexData"
      ></list-complex>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import ListEase from "./comps/ListEase.vue";
import ListComplex from "./comps/ListComplex.vue";

import { handleData } from "./config/test";

let listEasyData = ref([]);
let listComplexData = ref([]);
onMounted(() => {
  listEasyData.value = handleData(10000);
  listComplexData.value = handleData(10000, true);
});
// 改变数据
const changeData = () => {
  listEasyData.value = handleData(100);
  listComplexData.value = handleData(100, true);
};
</script>

<style lang="less" scoped>
.vitural-list {
  width: 600px;
  // margin: auto;
  // width: 100%;
  text-align: center;
  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      margin: 20px;
    }
  }
  .kind-box {
    display: flex;
    // width: 100%;
    flex: 1;
    justify-content: space-between;
  }
}
</style>