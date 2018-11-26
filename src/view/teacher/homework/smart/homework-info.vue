<style lang="less" scoped>
.header-con {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: transparent;
  .homework-progress {
    display: flex;
    align-items: center;
    .homework-progress-text {
      margin-right: 10px;
    }
  }
}
</style>
<template>
  <div class="header-con">
    <div>
      {{selTip}}：
      <Select
        v-model="selValue"
        style="width:200px"
        @on-change="onChangeSelVal"
      >
        <Option
          v-for="item in (selTip === '学期选择' ? selList2 : selList)"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}</Option>
      </Select>
    </div>

    <div class="homework-progress">
      <p class="homework-progress-text">作业完成情况:</p>
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
  </div>

</template>
<script>
export default {
  name: 'homework-info',
  props: {
    selTip:String,
    completeProgress: Number,
  },
  data() {
    return {
      selValue: '',
      selList: [
        {
          value: '已完成',
          label: '已完成',
        },
        {
          value: '未完成',
          label: '未完成',
        },
      ],
      selList2: [
        {
          value: '2016-2017第一学期',
          label: '2016-2017第一学期',
        },
        {
          value: '2016-2017第二学期',
          label: '2016-2017第二学期',
        },
      ],
    };
  },
  methods: {
    onChangeSelVal() {
      this.$emit('onChangeSelVal', { selValue: this.selValue });
    },
  },
  created() {},
  mounted() {},
};
</script>
