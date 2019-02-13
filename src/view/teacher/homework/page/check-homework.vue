<template>
  <div class="containter">
    <CourseSelect
      v-show="isSelectCourse"
      @goNext='goNext'
    />

    <div
      class="containter"
      v-show="!isSelectCourse && curDirectory !== 6"
    >
      <div
        class="header-bar"
        v-show="curDirectory === 4 || curDirectory === 5"
      >
        <MultipleChoice
          :semesterTip='selTip'
          :defaultValue='semester'
          :semesterList='semesterList'
          class="float-left"
        />

        <ProgressBar
          :completeProgress='90'
          class="float-right"
        />
      </div>

      <Table
        border
        :columns="showTable('columns',5)"
        :data="showTable('data',5)"
        class="table-con mar-top"
      />

      <Page
        :total="30"
        class="mar-top"
      />

      <Button
        v-if="curDirectory === 4"
        @click="submit"
        type="primary"
        class="mar-top"
        size='large'
        icon="ios-download-outline"
      >全部下载</Button>
    </div>

    <CheckOnlineHWDetail
      v-if="curDirectory === 6"
      @goBack='goBack'
    />

  </div>

</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import ProgressBar from "@teaHomework/smart/progress-bar";
import CourseSelect from "@teaHomework/smart/course-select";
import CheckOnlineHWDetail from "@teaHomework/smart/check-online-homework-detail.vue";
import myMixin from "@teaHomework/mixin";

export default {
  name: "check-homework",

  mixins: [myMixin],

  components: {
    MultipleChoice,
    CheckOnlineHWDetail,
    ProgressBar,
    CourseSelect
  },

  data() {
    return {
      isSelectCourse: true,
      curDirectory: 1,
      hwType: "", //作业类型
      selTip: "提交情况",
      semester: "",
      semesterList: [
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
          title: "班级",
          key: "className"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("查看", h, () => (this.curDirectory = 2)),
              this.btnStyle("返回", h, () => {
                this.isSelectCourse = true;
                this.curDirectory = 1;
              })
            ]);
          }
        }
      ],
      columns2: [
        {
          title: "周数",
          key: "weeksNum"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("查看", h, () => (this.curDirectory = 3)),
              this.btnStyle("返回", h, () => (this.curDirectory = 1))
            ]);
          }
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
                // TODO: 打开实验报告
                let { index } = params;
                if (index === 0) {
                  // index = 0时为课时作业
                  return (this.curDirectory = 4);
                }
                this.curDirectory = 5;
              }),
              this.btnStyle("返回", h, () => (this.curDirectory = 2))
            ]);
          }
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
              this.btnStyle("下载", h, () => {
                // TODO:打开实验报告
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
          key: "score"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("查看", h, () => (this.curDirectory = 6)),
              this.btnStyle("返回", h, () => (this.curDirectory = 3))
            ]);
          }
        }
      ],
      data1: [
        {
          className: "ATM"
        }
      ],
      data2: [
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
      data3: [
        {
          hwType: "课时作业"
        },
        {
          hwType: "在线作业"
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

    goBack() {
      this.curDirectory = 5;
    },

    goNext() {
      this.isSelectCourse = false;
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