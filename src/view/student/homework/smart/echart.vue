<template>
  <div
    ref="main"
    class="echart-con"
  ></div>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {
      formatLesson: this.$tools.getSessionStorage("formatLesson")
    };
  },

  mounted() {
    let xAxisData = this.formatLesson.map((item, index) => item["courseName"]);

    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(this.$refs.main);

    // 指定图表的配置项和数据
    let option = {
      title: {
        text: "每周作业汇总图表"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      },
      legend: {
        data: ["未完成作业数量", "作业总数"]
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
          boundaryGap: true,
          data: xAxisData
        }
      ],
      yAxis: [
        {
          type: "value",
          max: "dataMax"
        }
      ],
      series: [
        {
          name: "未完成作业数量",
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: "作业总数",
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: [220, 182, 191, 234, 290, 330, 310]
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
};
</script>

<style lang='less' scoped>
@import "../../../global/public.less";

.echart-con {
  .w(100%);
  height: 350px;
}
</style>
