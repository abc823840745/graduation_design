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
      :columns="showTable(currentLevel , 'columns')"
      :data="showTable(currentLevel , 'data')"
      class="table-con mar-top"
    ></Table>
    <Page
      :total="30"
      class="mar-top"
    />

    <Button
      v-if="currentLevel === 4"
      type="primary"
      @click="submit"
      class="mar-top"
      size='large'
    >全部下载</Button>
  </div>

</template>
<script>
import homeWork from "../smart/homework-info";
export default {
  name: "check-homework",
  components: {
    homeWork
  },
  data() {
    return {
      currentLevel: 1,
      selTip: "学期选择",
      selValue: "",
      hwType: "", //作业类型
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
          title: "课程",
          key: "courseName"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("查看", h, () => {
                //   this.show(params.index);
                // 打开二级目录
                this.currentLevel = 2;
                // this.selTip = "";
              })
            ]);
          }
        }
      ],
      data1: [
        {
          courseName: "新媒体实训"
        }
      ],

      columns2: [
        {
          title: "班级",
          key: "className"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("查看", h, () => {
                // 打开三级目录
                this.currentLevel = 3;
              }),
              this.btnStyle("返回", h, () => {
                // 返回一级目录
                this.currentLevel = 1;
                this.selTip = "学期选择";
              })
            ]);
          }
        }
      ],
      data2: [
        {
          className: "ATM"
        }
      ],

      columns3: [
        {
          title: "作业类型",
          key: "hwType"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("查看", h, () => {
                // TODO:打开实验报告
                let { index } = params;
                if (index === 0) {
                  this.currentLevel = 4;
                } else {
                  this.currentLevel = 5;
                }
                this.selTip = "作业情况";
              }),
              this.btnStyle("返回", h, () => {
                // 返回上一步
                this.currentLevel = 2;
                // this.selTip = '学期选择';
              })
            ]);
          }
        }
      ],
      data3: [
        {
          hwType: "课时作业"
        },
        {
          hwType: "在线作业"
        }
      ],

      columns4: [
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
          key: "score",
          render: (h, params) => {
            return h("div", [
              h("Rate", {
                props: {
                  value: 3
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    // 评分
                  }
                }
              })
            ]);
          }
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("下载并打开", h, () => {
                // TODO:打开实验报告
              }),
              this.btnStyle("返回", h, () => {
                // 返回上一步
                this.currentLevel = 3;
                // this.selTip = '学期选择';
              })
            ]);
          }
        }
      ],
      data4: [
        {
          studentId: "1540624158",
          name: "吕嘉俊",
          submission: "已完成",
          score: "",
          operation: ""
        }
      ],

      columns5: [
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
              this.btnStyle("查看", h, () => {
                this.$router.push({
                  name: "teacher-check-online-homework-detail"
                });
              }),
              this.btnStyle("返回", h, () => {
                // 返回上一步
                this.currentLevel = 2;
                // this.selTip = '学期选择';
              })
            ]);
          }
        }
      ],
      data5: [
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
  methods: {
    submit() {
      console.log("submit");
    },
    onChangeSelVal(data) {
      this.selValue = data.selValue;
    },
    btnStyle(btnTitle, h, onclick) {
      return h(
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
            click: onclick
          }
        },
        btnTitle
      );
    },
    showTable(condition, data) {
      // console.warn(condition, data);
      switch (condition) {
        case 1:
          return this[`${data}1`];
          break;
        case 2:
          return this[`${data}2`];
          break;
        case 3:
          return this[`${data}3`];
          break;
        case 4:
          return this[`${data}4`];
          break;
        default:
          return this[`${data}5`];
          break;
      }
    }
  }
};
</script>
