<template>
  <div class="homework-progress">
    <h3 class="homework-progress-text">作业完成情况:</h3>
    <i-circle
      :percent="completeProgress"
      :size="80"
    >
      <span
        class="demo-Circle-inner"
        style="font-size:24px"
      >{{completeProgress}}%</span>
    </i-circle>
  </div>
</template>

<script>
export default {
  props: {
    completeProgress: Number
  }
};
</script>

<style lang='less' scoped>
.homework-progress {
  width: 20%;
  display: flex;
  align-items: center;
  .homework-progress-text {
    margin-right: 10px;
  }
}
</style>
