<style lang="less" scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.mar-top {
  margin-top: 20px;
}
.table-con {
  width: 100%;
}

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
  <div class="containter">
    <home-work
      :selTip="selTip"
      :completeProgress="70"
      @onChangeSelVal="onChangeSelVal"
    />

    <Table
      stripe
      :columns="columns1"
      :data="data1"
      class="table-con mar-top"
    ></Table>
    <Page
      :total="30"
      class="mar-top"
    />

  </div>

</template>
<script>
import homeWork from "../smart/homework-info";
export default {
  name: "check-online-homework",
  data() {
    return {
      selTip: "学期选择",
      selValue: "",
      selList: [
        {
          value: "已完成",
          label: "已完成"
        },
        {
          value: "未完成",
          label: "未完成"
        }
      ],
      columns1: [
        {
          title: "学号",
          key: "studentId"
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "提交情况",
          key: "submission"
        },
        {
          title: "评分",
          key: "score"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "default"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      //   this.show(params.index);
                      this.$router.push({
                        name: "teacher-check-online-homework-detail"
                      });
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        }
      ],
      data1: [
        {
          studentId: "1540624158",
          name: "吕嘉俊",
          submission: "已完成",
          score: "100",
          operation: ""
        },
        {
          studentId: "1540624158",
          name: "吕嘉俊",
          submission: "已完成",
          score: "100",
          operation: ""
        },
        {
          studentId: "1540624158",
          name: "吕嘉俊",
          submission: "已完成",
          score: "100",
          operation: ""
        },
        {
          studentId: "1540624158",
          name: "吕嘉俊",
          submission: "已完成",
          score: "100",
          operation: ""
        },
        {
          studentId: "1540624158",
          name: "吕嘉俊",
          submission: "已完成",
          score: "100",
          operation: ""
        },
        {
          studentId: "1540624158",
          name: "吕嘉俊",
          submission: "已完成",
          score: "100",
          operation: ""
        }
      ]
    };
  },
  components: {
    homeWork
  },
  methods: {
    onChangeSelVal(data) {
      this.selValue = data.selValue;
    }
  },
  created() {},
  mounted() {}
};
</script>
