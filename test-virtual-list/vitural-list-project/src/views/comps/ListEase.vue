<template>
  <div class="infinite-list-container" ref="listRef" @scroll="handleScorll">
    <div
      class="infinite-list-phantom"
      :style="{ height: listHeight + 'px' }"
    ></div>
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div
        ref="items"
        class="infinite-list-item"
        v-for="item in visibleData"
        :key="item.id"
        :style="{
          height: props.itemSize + 'px',
          lineHeight: props.itemSize + 'px',
        }"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, defineProps } from "vue";

const props = defineProps({
  //每项高度
  itemSize: {
    type: Number,
    default: 50,
  },
  //所有列表数据
  listData: {
    type: Array,
    default: () => [],
  },
});

const listRef = ref(null);

//可视区域高度
let screenHeight = 0;
//偏移量
let startOffset = ref(0);
//起始索引
let start = ref(0);
//结束索引
let end = ref(0);

onMounted(() => {
  // 获取可视区盒子高度
  nextTick(() => {
    screenHeight = listRef.value.clientHeight || 0;
    handleScorll();
  });
});

// 计算属性
//列表总高度
const listHeight = computed(() => {
  return props.itemSize * props.listData.length;
});
//可显示的列表项数
const visibleCount = computed(() => {
  return Math.ceil(screenHeight / props.itemSize) + 1;
});
//偏移量对应的style： 保证infinite-list元素不会被滚动上去
const getTransform = computed(() => {
  return `translate3d(0, ${startOffset.value}px, 0)`;
});
//获取真实显示列表数据
const visibleData = computed(() => {
  return props.listData.slice(
    start.value,
    Math.min(end.value, props.listData.length)
  );
});

// 滚动事件
const handleScorll = () => {
  //当前滚动位置
  const scrollTop = listRef.value.scrollTop;
  //此时的偏移量(不设置偏移量时会滚动上去)
  startOffset.value = scrollTop - (scrollTop % props.itemSize); // 保证infinite-list处于原地
	// console.log(startOffset.value)
  //此时的开始索引
  start.value = Math.floor(scrollTop / props.itemSize);
  //此时的结束索引
  end.value = start.value + visibleCount.value;
};
</script>

<style lang="less" scoped>
.infinite-list-container {
  position: relative;
  height: 300px;
	width: 100%;
	margin-left: 20px;
  overflow: auto;
  .infinite-list-phantom {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  .infinite-list {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    .infinite-list-item {
      border: 1px solid pink;
      box-sizing: border-box;
    }
  }
}
</style>>
