<template>
  <div class="containter">
    <CourseSelect v-show="isSelectCourse" @goNext="goNext" />

    <div class="containter" v-show="!isSelectCourse && curDirectory !== 6">
      <div class="top_title">
        <h2 class="class_title">
          {{ curCourseInfo["name"] }}
          <span class="course-code">[{{ curCourseInfo["code"] }}]</span>
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

      <Table
        border
        :loading="loading"
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
import CourseSelect from "@teaHomework/smart/course-select";
import CheckOnlineHWDetail from "@teaHomework/smart/check-online-homework-detail";
import myMixin from "@/view/global/mixin";
import { mapActions, mapState, mapMutations } from "vuex";
import { getCourseClassList } from "@/api/course";

export default {
  name: "check-homework",

  mixins: [myMixin],

  components: { CheckOnlineHWDetail, CourseSelect },

  computed: {
    ...mapState({
      userName: state => state.user.userName,
      inputInfo: state => state.homework.inputInfo
    })
  },

  data() {
    return {
      isSelectCourse: true,
      showModal: false,
      loading: false,
      subjectList: [],
      curClassHour: "",
      curCourseInfo: {},
      curDirectory: 1,
      stuHwInfo: {},
      stuHWId: 0,
      columns1: [
        {
          title: "课时名称",
          key: "name"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("查看", h, () => {
                this.curDirectory = 2;
                this.curClassHour = params.row.name;
              })
            ]);
          }
        }
      ],
      columns2: [
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
                  this.curDirectory = 3;
                  this.getClassHW();
                } else {
                  this.curDirectory = 3;
                  this.getOnlineHW();
                }
              })
            ]);
          }
        }
      ],
      columns3: [
        {
          title: "作业名称",
          key: "name"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("查看", h, async () => {
                let { id, questions } = params.row;
                this.stuHWId = id;
                if (!questions) {
                  // params.questions不存在时为课时作业
                  this.curDirectory = 4;
                  await this.getStuClassHW(id);
                } else {
                  this.curDirectory = 5;
                  await this.getStuOnlineHW(id);
                }
              })
            ]);
          }
        }
      ],
      columns4: [
        {
          title: "学号",
          key: "stu_id"
        },
        {
          title: "姓名",
          key: "student"
        },
        {
          title: "完成状态",
          key: "status",
          sortable: true,
          render: (h, params) => {
            let text = params.row.status;
            let btnColor = text === "已完成" ? "success" : "error";
            return h("div", [this.statusBtnStyle(text, h, btnColor)]);
          }
        },
        {
          title: "评分",
          key: "grade",
          render: (h, params) => {
            let _this = this;
            let { webpath, grade, id } = params.row;
            if (webpath === "待上传") {
              return h("div", [
                h("Rate", {
                  props: {
                    value: 3,
                    disabled: true
                  },
                  style: {
                    marginRight: "5px"
                  }
                })
              ]);
            }
            return h("Rate", {
              props: {
                value: grade === "待评分" ? 3 : parseInt(grade, 10)
              },
              on: {
                async input(value) {
                  await _this.scoreHw(id, value);
                }
              }
            });
          }
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            let webpath = params.row.webpath;
            if (webpath === "待上传") {
              return h("div", [this.disableBtnStyle("下载", h)]);
            }
            return h("div", [
              this.btnStyle("下载", h, () => {
                window.open(params.row.webpath);
              })
            ]);
          }
        }
      ],
      columns5: [
        {
          title: "学号",
          key: "stu_id"
        },
        {
          title: "姓名",
          key: "student"
        },
        {
          title: "完成状态",
          key: "status",
          render: (h, params) => {
            let text = params.row.status;
            let btnColor = text === "已评分" ? "success" : "error";
            return h("div", [this.statusBtnStyle(text, h, btnColor)]);
          }
        },
        {
          title: "评分",
          key: "grade"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            let { status, questions, id } = params.row;
            if (status === "待上传") {
              return h("div", [this.disableBtnStyle("查看", h)]);
            }
            return h("div", [
              this.btnStyle("查看", h, async () => {
                this.stuHwInfo = params.row;
                this.showModal = true;
                this.curDirectory = 6;
                console.log(questions);
                await this.getStuSubjectList(questions);
              })
            ]);
          }
        }
      ],
      data1: [],
      data2: [
        {
          hwType: "课时作业"
        },
        {
          hwType: "在线作业"
        }
      ],
      data3: [],
      data4: [],
      data5: []
    };
  },

  methods: {
    ...mapActions([
      "teaScoreHW",
      "getTeaClassHW",
      "getTeaOnlineHW",
      "getStuHWList",
      "getStuOnlineHWList",
      "scoreOnlineHW"
    ]),

    ...mapMutations(["setInputInfo"]),

    submit() {
      console.log("submit");
    },

    // 评分
    async scoreHw(id, value) {
      let res = await this.teaScoreHW({
        id,
        grade: value
      });
      if (res["status"] === 1) {
        this.$Notice.success({
          title: "评分成功！"
        });
      }
    },

    async goNext(info) {
      this.loading = true;
      this.curCourseInfo = info;
      // 获取课程的课时列表
      let res = await getCourseClassList({
        course_id: info["id"]
      });
      this.data1 = res.data.courseTimeList;
      this.isSelectCourse = false;
      this.loading = false;
    },

    // 教师查看课时作业
    async getClassHW() {
      this.loading = true;
      let { name, semester } = this.curCourseInfo;
      let res = await this.getTeaClassHW({
        course: name,
        teacher: this.userName,
        semester,
        classHour: this.curClassHour
      });
      this.data3 = res;
      this.loading = false;
    },

    // 教师查看在线作业
    async getOnlineHW() {
      this.loading = true;
      let { name, semester } = this.curCourseInfo;
      let res = await this.getTeaOnlineHW({
        course: name,
        teacher: this.userName,
        semester,
        classHour: this.curClassHour
      });
      this.data3 = res;
      this.loading = false;
    },

    // 获取学生课时作业列表(用于评分)
    async getStuClassHW(id) {
      this.loading = true;
      let { name, semester, classes } = this.curCourseInfo;
      let res = await this.getStuHWList({
        exper_id: id,
        course: name,
        semester,
        teacher: this.userName,
        stuclass: classes
      });
      this.data4 = res;
      this.loading = false;
    },

    // 获取学生在线作业作业列表(用于评分)
    async getStuOnlineHW(id) {
      this.loading = true;
      let { name, semester, classes } = this.curCourseInfo;
      let res = await this.getStuOnlineHWList({
        exper_id: id,
        course: name,
        semester,
        teacher: this.userName,
        stuclass: classes
      });
      this.data5 = res;
      this.loading = false;
    },

    async getStuSubjectList(questions) {
      let subjectLength = 0;
      let executeOnce = true;
      let inputInfo = questions.reduce((arr, item, index) => {
        let optionList = [
          {
            label: "A",
            option: item["first_option"]
          },
          {
            label: "B",
            option: item["sec_option"]
          },
          {
            label: "C",
            option: item["third_option"]
          },
          {
            label: "D",
            option: item["fourth_option"]
          }
        ];
        if (item["type"] !== "填空题") {
          arr.push({
            id: item["id"],
            subject: item["context"],
            subjectType: item["type"],
            title: `${index + 1}、${item["type"]}`,
            choice:
              item["type"] === "多选题" && item["stuanswer"]["answer"]
                ? item["stuanswer"]["answer"].split(",")
                : item["stuanswer"]["answer"],
            optionList,
            weighting: item["grade"],
            referenceAnswer: item["answer"]
          });
        } else {
          if (executeOnce) {
            // 填空题只有一条大题，所以只执行一次
            executeOnce = false;
            let subject = questions.reduce((arr, item) => {
              if (item["type"] === "填空题") {
                subjectLength += 1;
                arr.push({
                  id: item["id"],
                  subject: item["context"],
                  answer: item["stuanswer"]["answer"],
                  referenceAnswer: item["answer"],
                  showCreSubjectBtn: true
                });
              }
              return arr;
            }, []);
            arr.push({
              subject,
              subjectType: item["type"],
              title: `${index + 1}、${item["type"]}`,
              choice: "",
              optionList,
              weighting: item["grade"]
            });
          }
        }
        return arr;
      }, []);
      this.subjectList = questions;
      this.setInputInfo(inputInfo);
    },

    // 教师对在线作业评分
    async scoreSubject() {
      let obj = [];
      let { id } = this.stuHwInfo;
      this.inputInfo.map(item => {
        if (item["subjectType"] !== "填空题") {
          obj.push({
            id: item["id"],
            grade: item["score"] || 1
          });
        } else {
          let score = item["score"];
          item["subject"].forEach((item, index, arr) => {
            obj.push({
              id: item["id"],
              grade: score / arr.length || 1
            });
          });
        }
      });
      let grade = obj.reduce((num, item) => {
        num += item["grade"];
        return num;
      }, 0);
      if (grade > 100) {
        return this.$Notice.error({
          title: "总分不能超过100"
        });
      }
      let res = await this.scoreOnlineHW({
        id,
        grade,
        obj
      });
      await this.getStuOnlineHW(this.stuHWId);
      this.$Notice.success({
        title: "评分成功！"
      });
    },

    async handleOk() {
      // TODO:提交评分
      this.curDirectory = 5;
      await this.scoreSubject();
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