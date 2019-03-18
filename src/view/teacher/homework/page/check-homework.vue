<template>
  <div class="containter">
    <CourseSelect v-show="isSelectCourse" @goNext="goNext" />

    <div class="containter" v-show="!isSelectCourse && curDirectory !== 6">
      <div class="top_title">
        <h2 class="class_title">
          {{ curCourseInfo["name"] }}
          <span class="course-code">[{{ curCourseInfo["code"] }}]</span>
        </h2>

        <div class="return_btn">
          <Button
            v-show="curDirectory === 4 || curDirectory === 5"
            type="primary"
            shape="circle"
            @click="searchOpen"
            icon="ios-search"
          >
            搜索</Button
          >

          <Button
            class="ml-10"
            type="primary"
            shape="circle"
            @click="headerGoBack"
            icon="md-arrow-back"
            >返回</Button
          >
        </div>
      </div>

      <Table
        border
        :loading="loading"
        :columns="showTable('columns', 6)"
        :data="showTable('data', 6)"
        class="table-con mar-top"
      />

      <Page :total="30" class="mar-top page" />

      <!-- <div class="btn-ground"> -->
      <Button
        v-show="curDirectory === 4"
        @click="allDownload"
        type="primary"
        class="mar-top"
        size="large"
        icon="ios-download-outline"
        >全部下载</Button
      >
      <!-- </div> -->
    </div>

    <Modal
      fullscreen
      title="作业评分"
      v-model="showModal"
      @on-cancel="handleCancel"
    >
      <CheckOnlineHWDetail />
      <div slot="footer">
        <Button
          type="primary"
          size="large"
          :loading="modalLoading"
          @click="handleOk"
          >确定评分</Button
        >
      </div>
    </Modal>

    <Modal fullscreen title="搜索" v-model="modalOpen" @on-ok="searchClose">
      <SearchView
        :columns="curDirectory === 4 ? columns4 : columns5"
        :tableData="searchTableData"
        :total="searchCount"
        @search="getSearchResult"
        @changePage="changePage"
      />
      <div slot="footer">
        <Button type="primary" size="large" @click="searchClose">
          返回
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import CourseSelect from "@teaHomework/smart/course-select";
import CheckOnlineHWDetail from "@teaHomework/smart/check-online-homework-detail";
import SearchView from "@/view/global/component/search-view";
import myMixin from "@/view/global/mixin";
import { mapActions, mapState, mapMutations } from "vuex";
import { getCourseClassList } from "@/api/course";
import { debounce } from "@tools";
import axios from "axios";
import config from "@/config";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;

export default {
  name: "check-homework",

  mixins: [myMixin],

  components: { CheckOnlineHWDetail, CourseSelect, SearchView },

  computed: {
    ...mapState({
      userName: state => state.user.userName,
      inputInfo: state => state.homework.inputInfo,
      teaId: state => state.user.stu_nmuber
    })
  },

  data() {
    return {
      // searchColumns: [],
      searchCount: 1,
      searchTableData: [],
      isSelectCourse: true,
      showModal: false,
      modalOpen: false,
      loading: false,
      subjectList: [],
      modalLoading: false,
      score: 0,
      curClassHour: "",
      curCourseInfo: {},
      curDirectory: 1,
      curHWtype: "",
      stuHwInfo: {},
      stuHWId: 0,
      allStuClassHW: [],
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
                let { index } = params;
                this.curHWtype = params.row.hwType;
                if (index === 0) {
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
                  // 课时作业
                  this.curDirectory = 4;
                  await this.getStuClassHW();
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
              return h("InputNumber", {
                props: {
                  max: 100,
                  min: 1,
                  disabled: true
                },
                style: {
                  marginRight: "5px"
                }
              });
            }
            return h("InputNumber", {
              props: {
                max: 100,
                min: 1,
                value: grade !== "待评分" ? parseInt(grade, 10) : 1
              },
              style: {
                marginRight: "5px"
              },
              on: {
                input(value) {
                  _this.score = value;
                },
                async "on-blur"() {
                  await _this.scoreHw(id, _this.score);
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
            let btnColor = text === "已完成" ? "success" : "error";
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
                localStorage.removeItem("subjectList");
                // localStorage.removeItem("remainTime");
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
      "scoreOnlineHW",
      "setInputInfo",
      "searchStudentHW",
      "downloadAllHW"
    ]),

    ...mapMutations(["setInputInfo"]),

    // 全部下载
    async allDownload() {
      let res = await axios({
        url: `${baseUrl}/download/teacher/stuexperStream`,
        method: "post",
        data: {
          arr: this.allStuClassHW
        },
        responseType: "blob"
      });
      let blob = new Blob([res.data], {
        type: "application/octet-stream;charset=utf-8"
      });
      const elink = document.createElement("a");
      const filename = res.headers["content-disposition"].substring(
        22,
        res.headers["content-disposition"].length - 1
      );
      elink.download = filename;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
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
    async getStuClassHW() {
      this.loading = true;
      let { name, semester, classes } = this.curCourseInfo;
      let res = await this.getStuHWList({
        exper_id: this.stuHWId,
        course: name,
        semester,
        teacher: this.userName,
        stuclass: classes,
        classHour: this.curClassHour
      });
      this.data4 = res.data;
      this.allStuClassHW = res.alldata.map(item => {
        return {
          localname: item["localname"],
          name: `${item["name"]}.docx`
        };
      });
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
        stuclass: classes,
        classHour: this.curClassHour
      });
      this.data5 = res;
      this.loading = false;
    },

    async getStuSubjectList(questions = []) {
      let subjectLength = 0;
      let executeOnce = true;
      let inputInfo = questions.reduce((arr, item, index) => {
        let { grade, answer, id } = item["stuanswer"];
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
            id: id,
            subject: item["context"],
            subjectType: item["type"],
            title: `${index + 1}、${item["type"]}`,
            choice:
              item["type"] === "多选题" && answer ? answer.split(",") : answer,
            optionList,
            weighting: item["grade"],
            referenceAnswer: item["answer"],
            score: grade === "未评分" ? 1 : grade
          });
        } else {
          if (executeOnce) {
            // 填空题只有一条大题，所以只执行一次
            executeOnce = false;
            let subject = questions.reduce((arr, item) => {
              if (item["type"] === "填空题") {
                subjectLength += 1;
                arr.push({
                  id: id,
                  subject: item["context"],
                  answer: answer,
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
              weighting: item["grade"],
              score: grade === "未评分" ? 1 : grade
            });
          }
        }
        return arr;
      }, []);
      this.subjectList = questions;
      this.setInputInfo(inputInfo);
    },

    // 教师对在线作业评分
    async handleOk() {
      this.modalLoading = true;
      let obj = [];
      let { id } = this.stuHwInfo;
      this.inputInfo.map(item => {
        if (item["subjectType"] !== "填空题") {
          obj.push({
            id: item["id"],
            grade: item["score"] || 0
          });
        } else {
          let score = item["score"];
          item["subject"].forEach((item, index, arr) => {
            obj.push({
              id: item["id"],
              grade: score || 0
            });
          });
        }
      });
      let grade = obj.reduce((num, item) => {
        num += parseInt(item["grade"], 10);
        return num;
      }, 0);
      if (grade > 100) {
        this.$Notice.error({
          title: "总分不能超过100"
        });
        this.modalLoading = false;
        return;
      }
      let res = await this.scoreOnlineHW({
        id,
        grade,
        obj
      });
      await this.getStuOnlineHW(this.stuHWId);
      this.curDirectory = 5;
      this.setInputInfo([]);
      this.$Notice.success({
        title: "评分成功！"
      });
      this.showModal = false;
      this.modalLoading = false;
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
    },

    searchOpen() {
      this.modalOpen = true;
      this.searchTableData = [];
    },

    searchClose() {
      this.modalOpen = false;
      this.searchTableData = [];
    },

    // 搜索结果
    async searchResult(searchText, page = 1) {
      this.searchText = searchText;
      let { name, classes, semester } = this.curCourseInfo;
      let type = this.curHWtype === "课时作业" ? "offline" : "online";
      let res = await this.searchStudentHW({
        page,
        semester,
        condition: searchText,
        teach_id: this.teaId,
        teacher: this.userName,
        type,
        week: this.curClassHour,
        exper_id: this.stuHWId,
        course: name,
        stuclass: classes
      });
      this.searchCount = res.count;
      this.searchTableData = res.data;
    },

    // 获取搜索结果
    async getSearchResult(searchText) {
      await this.searchResult(searchText);
    },

    // 搜索表格分页
    async changePage(page) {
      await this.searchResult(this.searchText, page);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../global/public.less";

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