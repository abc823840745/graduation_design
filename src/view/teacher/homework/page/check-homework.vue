<template>
  <div class="containter">
    <CourseSelect v-show="isSelectCourse" @goNext="goNext" />

    <div class="containter" v-show="!isSelectCourse && curDirectory !== 6">
      <div class="top_title">
        <h2 class="class_title">
          新媒体综合实训 <span class="course-code">[GT2004]</span>
        </h2>
        <Button
          class="return_btn"
          type="primary"
          shape="circle"
          @click="headerGoBack"
          icon="md-arrow-back"
          >返回</Button
        >
      </div>

      <div class="header-bar" v-show="curDirectory === 4 || curDirectory === 5">
        <MultipleChoice
          :semesterTip="selectInfo['tip']"
          :defaultValue.sync="selectInfo['value']"
          :semesterList="selectInfo['list']"
          class="float-left"
        />

        <ProgressBar :completeProgress="90" class="float-right" />
      </div>

      <Table
        border
        :columns="showTable('columns', 6)"
        :data="showTable('data', 6)"
        class="table-con mar-top"
      />

      <Page :total="30" class="mar-top page" />

      <div class="btn-ground">
        <Button
          v-show="curDirectory === 4"
          @click="submit"
          type="primary"
          class="mar-top"
          size="large"
          icon="ios-download-outline"
          >全部下载</Button
        >

        <Button
          v-show="curDirectory === 4"
          @click="submit"
          type="primary"
          class="mar-top"
          size="large"
          icon="ios-download-outline"
          >提交评分</Button
        >
      </div>
    </div>

    <Modal
      fullscreen
      title="作业评分"
      v-model="showModal"
      @on-ok="handleOk"
      @on-cancel="handleCancel"
    >
      <CheckOnlineHWDetail />
    </Modal>
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import ProgressBar from "@teaHomework/smart/progress-bar";
import CourseSelect from "@teaHomework/smart/course-select";
import CheckOnlineHWDetail from "@teaHomework/smart/check-online-homework-detail";
import myMixin from "@/view/global/mixin";

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
      showModal: false,
      curDirectory: 1,
      hwType: "", //作业类型
      selectInfo: {
        tip: "完成状态",
        value: "所有状态",
        list: this.getFinishList()
      },
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
              this.btnStyle("查看", h, () => (this.curDirectory = 2))
            ]);
          }
        }
      ],
      columns2: [
        {
          title: "课时名称",
          key: "classHour"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("查看", h, () => (this.curDirectory = 3))
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
              })
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
          title: "完成状态",
          key: "submission",
          render: (h, params) => {
            let text = params.row.submission;
            let btnColor = text === "已完成" ? "success" : "error";
            return h("div", [this.statusBtnStyle(text, h, btnColor)]);
          }
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
              })
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
          title: "完成状态",
          key: "submission",
          render: (h, params) => {
            let text = params.row.submission;
            let btnColor = text === "已完成" ? "success" : "error";
            return h("div", [this.statusBtnStyle(text, h, btnColor)]);
          }
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
                this.showModal = true;
                this.curDirectory = 6;
              })
            ]);
          }
        }
      ],
      data1: [
        {
          className: "ATM"
        },
        {
          className: "AAA"
        },
        {
          className: "BBB"
        },
        {
          className: "CCC"
        },
        {
          className: "DDD"
        },
        {
          className: "EEE"
        }
      ],
      data2: [
        {
          classHour: "第一课：课程介绍及环境配置安装详解"
        },
        {
          classHour: "第一课：课程介绍及环境配置安装详解"
        },
        {
          classHour: "第一课：课程介绍及环境配置安装详解"
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
          submission: "未完成",
          score: "",
          operation: ""
        },
        {
          studentId: "1540624158",
          name: "吕嘉俊",
          submission: "未完成",
          score: "",
          operation: ""
        },
        {
          studentId: "1540624158",
          name: "吕嘉俊",
          submission: "未完成",
          score: "",
          operation: ""
        },
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

    goNext() {
      this.isSelectCourse = false;
    },

    handleOk() {
      // TODO:提交评分
      this.curDirectory = 5;
    },

    handleCancel() {
      this.curDirectory = 5;
    },

    headerGoBack() {
      if (this.curDirectory === 1) {
        return (this.isSelectCourse = true);
      }
      if (this.curDirectory === 5) {
        return (this.curDirectory = 3);
      }
      this.curDirectory -= 1;
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
}

.top_title {
  // overflow: hidden;
  // padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: #fff;
  padding: 14px 20px;
  border-radius: 10px;
  color: #666;
  box-shadow: 2px 2px 2px #eee;
  .class_title {
    font-size: 18px;
    font-weight: 700;
    float: left;
    line-height: 32px;
    .course-code {
      font-weight: 500;
      color: #888;
      font-size: 14px;
    }
  }
  .return_btn {
    float: right;
  }
}

.mar-top {
  margin-top: 20px;
}

.table-con {
  width: 100%;
}

.page {
  align-self: flex-end;
}

.btn-ground {
  width: 22%;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  margin-top: 20px;

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