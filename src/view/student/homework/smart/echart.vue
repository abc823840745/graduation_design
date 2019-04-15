<template>
  <div ref="main" class="echart-con"></div>
</template>

<script>
import echarts from "echarts";
import { mapState } from "vuex";

export default {
  props: {
    data: Array
  },

  computed: {
    courseList() {
      return this.data.map(item => item["course"]);
    },

    unfinishedData() {
      return this.data.map(item => item["unfinished"]);
    },

    totalData() {
      return this.data.map(item => item["count"]);
    }
  },

  watch: {
    data(newVal, oldVal) {
      this.setChartOption();
    }
  },

  methods: {
    setChartOption() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.main);
      let courseList = this.courseList;
      let option = {
        title: {
          text: "作业汇总图表"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["未完成作业数", "作业总数"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: courseList
          }
        ],
        yAxis: [
          {
            type: "value",
            max: value => {
              return value.max + 20;
            }
          }
        ],
        series: [
          {
            name: "未完成作业数",
            type: "bar",
            data: this.unfinishedData
          },
          {
            name: "作业总数",
            type: "bar",
            data: this.totalData
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>

<style lang='less' scoped>
.echart-con {
  width: 100%;
  height: 350px;
}
</style>