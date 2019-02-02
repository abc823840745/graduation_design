<template>
  <div class="containter">
    <div
      class="containter"
      v-if="curDirectory!==7"
    >

      <div class="header-bar">
        <MultipleChoice
          v-if="curDirectory===1||curDirectory===5||curDirectory===6"
          :semesterTip='selTip'
          :defaultValue='semester'
          :semesterList='curDirectory===1?semesterList:semesterList2'
          class="float-left"
        />

        <ProgressBar
          :completeProgress='90'
          class="float-right"
        />
      </div>

      <Table
        stripe
        :columns="showTable('columns',6)"
        :data="showTable('data',6)"
        class="table-con mar-top"
      ></Table>
      <Page
        :total="30"
        class="mar-top"
      />

      <Button
        v-if="curDirectory === 5"
        @click="submit"
        type="primary"
        class="mar-top"
        size='large'
        icon="ios-download-outline"
      >全部下载</Button>
    </div>

    <CheckOnlineHWDetail
      v-if="curDirectory===7"
      @goBack='goBack'
    />

  </div>

</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import ProgressBar from "@teaHomework/smart/progress-bar";
import CheckOnlineHWDetail from "@teaHomework/smart/check-online-homework-detail.vue";
import myMixin from "@teaHomework/mixin";

export default {
  name: "check-homework",

  mixins: [myMixin],

  components: {
    MultipleChoice,
    CheckOnlineHWDetail,
    ProgressBar
  },

  data() {
    return {
      curDirectory: 1,
      hwType: "", //作业类型
      selTip: "学期选择",
      semester: "2017-2018第二学期",
      semesterList: [
        {
          value: "2016-2017第一学期",
          label: "2016-2017第一学期"
        },
        {
          value: "2016-2017第二学期",
          label: "2016-2017第二学期"
        },
        {
          value: "2017-2018第一学期",
          label: "2017-2018第一学期"
        },
        {
          value: "2017-2018第二学期",
          label: "2017-2018第二学期"
        }
      ],
      semesterList2: [
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
              this.btnStyle("查看", h, () => (this.curDirectory = 2))
            ]);
          }
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
              this.btnStyle("查看", h, () => (this.curDirectory = 3)),
              this.btnStyle("返回", h, () => {
                // 返回一级目录
                this.curDirectory = 1;
                this.selTip = "学期选择";
              })
            ]);
          }
        }
      ],
      columns3: [
        {
          title: "周数",
          key: "weeksNum"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("查看", h, () => (this.curDirectory = 4)),
              this.btnStyle("返回", h, () => (this.curDirectory = 2))
            ]);
          }
        }
      ],
      columns4: [
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
                // TODO: 打开实验报告
                let { index } = params;
                if (index === 0) {
                  // index = 0时为课时作业
                  this.curDirectory = 5;
                } else {
                  this.curDirectory = 6;
                }
                this.selTip = "提交情况";
              }),
              this.btnStyle("返回", h, () => (this.curDirectory = 3))
            ]);
          }
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
              this.btnStyle("下载", h, () => {
                // TODO:打开实验报告
              }),
              this.btnStyle("返回", h, () => (this.curDirectory = 4))
            ]);
          }
        }
      ],
      columns6: [
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
              this.btnStyle("查看", h, () => (this.curDirectory = 7)),
              this.btnStyle("返回", h, () => (this.curDirectory = 4))
            ]);
          }
        }
      ],
      data1: [
        {
          courseName: "新媒体实训"
        }
      ],
      data2: [
        {
          className: "ATM"
        }
      ],
      data3: [
        {
          weeksNum: "第一周"
        },
        {
          weeksNum: "第二周"
        },
        {
          weeksNum: "第三周"
        }
      ],
      data4: [
        {
          hwType: "课时作业"
        },
        {
          hwType: "在线作业"
        }
      ],
      data5: [
        {
          studentId: "1540624158",
          name: "吕嘉俊",
          submission: "已完成",
          score: "",
          operation: ""
        }
      ],
      data6: [
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

    goBack() {
      this.curDirectory = 6;
    }
  }
};
</script>

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
.select-con {
  display: flex;
  align-self: flex-start;
  width: 100%;
}
.select-title {
  margin-right: 10px;
}
.select-list {
  width: 200px;
}
.select-list-con {
  display: flex;
  align-items: center;
  margin-right: 30px;
}
.header-bar {
  position: relative;
  width: 100%;
  .float-left {
    position: absolute;
    top: 50%;
    z-index: 999;
    transform: translateY(-50%);
    float: left;
  }
  .float-right {
    float: right;
  }
}
</style>