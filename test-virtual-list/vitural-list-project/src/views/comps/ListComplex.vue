<template>
  <div class="infinite-list-container" ref="listRef" @scroll="handleScorll">
    <div
      class="infinite-list-phantom"
      :style="{ height: listHeight + 'px' }"
    ></div>
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div
        ref="itemRef"
        class="infinite-list-item"
        v-for="item in visibleData"
        :key="item.id"
        :id="item._index"
        :style="{ height: item.height + 'px', lineHeight: item.height + 'px' }"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  nextTick,
  defineProps,
  reactive,
  watch,
} from "vue";

const props = defineProps({
  //列表dom预估高度(只是为了初始化能渲染出dom，后续会更新实际元素高度)
  estimatedItemSize: {
    type: Number,
    default: 50,
  },
  //所有列表数据
  listData: {
    type: Array,
    default: () => [],
  },
  //缓冲区比例
  bufferScale: {
    type: Number,
    default: 1,
  },
});

// 外层滚动的dom：后面获取实际可视区高度
const listRef = ref(null);
// 渲染数据dom：利用dom集原生getBoundingClientRect方法获取dom尺寸信息
// 注意：笔者没有给渲染dom写过多的测试文字来撑开不同的高度，因此在itemRef上面的元素使用了行内样式设置dom的高度和行高，
// 是为了测试数据显示不同高度，方便看的时候区分，因此在造数据时
const itemRef = ref(null);

//可视区域高度(这个数据一般是固定的，可以css写死，后面用js获取这个数值)
let screenHeight = ref(0);
//偏移量（默认列表渲染的盒子会随外面滚动条自动滚动，因此计算偏移量让其往下移动，保证渲染的dom始终处于可视区，只更新数据）
let startOffset = ref(0);
//起始索引(此处未包含缓冲索引，后面计算单独加)
let start = ref(0);
//结束索引
let end = ref(10); // 提供一个默认值10，保证初始化有数据展示
// 列表高度
let listHeight = ref(0);

onMounted(() => {
  // 获取可视区盒子高度
  nextTick(() => {
    screenHeight.value = listRef.value.clientHeight; // 获取实际的可视区盒子高度
  });
});
// 处理后的响应式列表数据
let positions = reactive([]);
// 初始化处理数据
const initPosition = () => {
  console.log("props.listData", props.listData);
  return props.listData.map((item, index) => {
    // 获取索引、实际dom的高度、top和bottom为实际离顶部的距离，后面更新实际数据
    return {
      index,
      height: props.estimatedItemSize,
      top: index * props.estimatedItemSize,
      bottom: (index + 1) * props.estimatedItemSize,
    };
  });
};
// 监听listData数据变化时更新页面
watch(
  () => props.listData,
  (newVal, oldVal) => {
    positions = initPosition();
    nextTick(() => {
      listHeight.value = positions[positions.length - 1].bottom || 0; // 获取总的列表高度，使的可视区盒子出现滚动条
      handleScorll();
    });
  }
);
//可显示的列表项数（该数据准确性意义不大，因为dom高度不定，此处也可以单独写个适中的自定义数据，实际以start和end为准）
const visibleCount = computed(() => {
  // return Math.ceil(screenHeight.value / props.estimatedItemSize);
  return Math.ceil(screenHeight.value / props.estimatedItemSize);
});
//偏移量对应的style： 保证infinite-list元素不会被滚动上去
const getTransform = computed(() => {
  return `translate3d(0, ${startOffset.value}px, 0)`;
});
// 给数据加索引(在visibleData前给数据加索引，为后面滚动拿到数据时带有索引，好比较数值)
const _listData = computed(() => {
  return props.listData.map((item, index) => {
    return {
      _index: `_${index}`,
      ...item,
    };
  });
});
// 可视区上方的缓冲数据（取开始索引和自定义缓冲的最小值）
const aboveCount = computed(() => {
  return Math.min(start.value, props.bufferScale * visibleCount.value);
});
// 可视区下方的缓冲数据（取自定义缓冲索引和结束索引与列表长度索引的）
const belowCount = computed(() => {
  return Math.min(
    props.listData.length > end.value ? props.listData.length - end.value : 0,
    props.bufferScale * visibleCount.value
  );
});
//获取真实显示列表数据
// 1、此处在计算的start和end基础上加了部分上下的缓冲列表，防止滚动过快白屏；
// 2、注意此处加了缓冲数据，即实际开始和结束都是以缓冲的索引为准，那么后面的偏移量计算同样以缓冲索引为准；
const visibleData = computed(() => {
  let startIndex = start.value - aboveCount.value;
  let endIndex = end.value + belowCount.value;
  return _listData.value.slice(startIndex, endIndex);
});

// 更新position中数据：每条数据填充对应dom的真是数据
const updatePosition = () => {
  if (positions.length <= 0) return;
  itemRef.value.forEach((node) => {
    const rect = node.getBoundingClientRect();
    const index = +node.id.slice(1); // +是为了转成数值型
    const height = rect.height;
    const curItem = positions[index];
    const oldHeight = curItem.height;
    const dValue = oldHeight - height;
    if (dValue) {
      // 更新当前项的实际数据
      curItem.height = height;
      curItem.bottom = curItem.bottom - dValue;
      // 遍历更新后面的所有数据（如果该元素未更新数据，则该数据及之后数据都需要更新）
      for (let k = index + 1; k < positions.length; k++) {
        positions[k].top = positions[k - 1].bottom;
        positions[k].bottom = positions[k].bottom - dValue;
      }
    }
  });
};
// 获取开始索引
const getStartIndex = (scrollTop) => {
  // 使用二分法查找
  return binarySearch(positions, scrollTop);
};
// 二分法查找start索引
// 1、某个索引对应值刚好等于scrollTop，则start为该索引+1；
// 2某个索引对应值刚好大于scrollTop，注意是按顺序的第一个，则start为该索引；
const binarySearch = (list, scrollTop) => {
  let start = 0;
  let end = list.length - 1;
  let tempIndex = null; // 实际索引
  while (start <= end) {
    let midIndex = parseInt((start + end) / 2);
    let midValue = list[midIndex].bottom; // 注意这里是bottom，因此如果刚好数值相等则索引需要+1取值
    if (midValue === scrollTop) {
      // 如果刚好找到相等时
      return midIndex + 1;
    } else if (midValue < scrollTop) {
      // 如果二分数据比滚动的小，则更新start继续二分查找
      start = midIndex + 1;
    } else if (midValue > scrollTop) {
      // 如果二分数据比滚动的大，则更新end继续二分查找
      if (tempIndex === null || tempIndex > midIndex) {
        // 1、tempIndex为null表示第一次，因此直接赋值更新tempIndex；
        // 2、tempIndex > midIndex表示下次二分的索引midIndex必须比第一次的索引小才更新tempIndex，因为我们取的是最小的索引
        tempIndex = midIndex;
      }
      end = end - 1;
    }
  }
  return tempIndex;
};
// 滚动事件
const handleScorll = () => {
  updatePosition(); // 更新dom数据
  const scrollTop = listRef.value.scrollTop;
  // 获取到列表开始的start索引
  start.value = getStartIndex(scrollTop);
  // 结束的end索引：开始索引加可视索引个数（当然前面提到了visibleCount是不准确的，可以自定义适中即可）
  end.value = start.value + visibleCount.value;
  // 获取偏移量（为了保证渲染的dom一直处于可视区，就需要因为默认滚动上去时下移回来，此处加了缓冲索引）
  if (start.value >= 1) {
    startOffset.value = positions[start.value - aboveCount.value].top;
  } else {
    startOffset.value = 0;
  }
  // 更新列表高度（为了保证滚动条本身滑块准确及列表总高度准确）
  listHeight.value = positions[positions.length - 1].bottom || 0;
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
