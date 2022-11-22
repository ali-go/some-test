<template>
  <div class="app">
    <p>这是app组件</p>
    <div>
      <span class="count">当前数量是：{{ count }}</span>
      <button @click="handleCount">+1</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    handleCount() {
      this.count++;
    },
  },
};
</script>

<style>
.app{
	color: red;
}
</style>