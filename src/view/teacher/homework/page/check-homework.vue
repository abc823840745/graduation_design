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
        :columns="filterData('columns')"
        :data="filterData('data')"
        class="table-con mar-top"
      />

      <Page
        :total="filterData('total')"
        :current="filterData('page')"
        class="mar-top page"
        @on-change="changePage"
      />

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
        :columns="
          curDirectory === 4
            ? tableGround[3]['columns']
            : tableGround[4]['columns']
        "
        :tableData="searchTableData"
        :total="searchCount"
        @search="getSearchResult"
        @changePage="changeSearchPage"
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
import { mapActions, mapState, mapMutations } from "vuex";
import { getCourseClassList } from "@/api/course";
import { debounce } from "@tools";
import myMixin from "@/view/global/mixin";
import axios from "axios";
import config from "@/config";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;

export default {
  name: "check-homework",

  mixins: [myMixin],

  components: {
    CheckOnlineHWDetail: () =>
      import("@teaHomework/smart/check-online-homework-detail"),
    CourseSelect: () => import("@teaHomework/smart/course-select"),
    SearchView: () => import("@/view/global/component/search-view")
  },

  computed: {
    ...mapState({
      userName: state => state.user.userName,
      inputInfo: state => state.homework.inputInfo,
      teaId: state => state.user.stu_nmuber
    })
  },

  data() {
    return {
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
      tableGround: [
        {
          total: 1,
          page: 1,
          data: [],
          columns: [
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
                    this.goDirectoryTwo(params);
                  })
                ]);
              }
            }
          ]
        },
        {
          total: 1,
          page: 1,
          data: [
            {
              hwType: "课时作业"
            },
            {
              hwType: "在线作业"
            }
          ],
          columns: [
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
                    this.goDirectoryThree(params);
                  })
                ]);
              }
            }
          ]
        },
        {
          total: 1,
          page: 1,
          data: [],
          columns: [
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
                    this.goDirectoryFourth(params);
                  })
                ]);
              }
            }
          ]
        },
        {
          total: 1,
          page: 1,
          data: [],
          columns: [
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
                    this.goDownload(params);
                  })
                ]);
              }
            }
          ]
        },
        {
          total: 1,
          page: 1,
          data: [],
          columns: [
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
                let { status } = params.row;
                if (status === "待上传") {
                  return h("div", [this.disableBtnStyle("查看", h)]);
                }
                return h("div", [
                  this.btnStyle("查看", h, async () => {
                    this.goDetail(params);
                  })
                ]);
              }
            }
          ]
        }
      ]
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

    goDirectoryTwo(params) {
      this.curDirectory = 2;
      this.curClassHour = params.row.name;
    },

    async goDirectoryThree(params) {
      let { hwType } = params.row;
      this.curHWtype = hwType;
      if (hwType === "课时作业") {
        this.curDirectory = 3;
        await this.getClassHW();
      } else {
        this.curDirectory = 3;
        await this.getOnlineHW();
      }
    },

    async goDirectoryFourth(params) {
      let { id, questions } = params.row;
      this.stuHWId = id;
      if (!questions) {
        // 课时作业
        this.curDirectory = 4;
        await this.getStuClassHW();
      } else {
        this.curDirectory = 5;
        await this.getStuOnlineHW();
      }
    },

    goDownload(params) {
      window.open(params.row.webpath);
    },

    // 根据当前目录选择对应的数据
    filterData(parmasName) {
      switch (this.curDirectory) {
        case 1:
          return this.tableGround[0][parmasName];
        case 2:
          return this.tableGround[1][parmasName];
        case 3:
          return this.tableGround[2][parmasName];
        case 4:
          return this.tableGround[3][parmasName];
        case 5:
          return this.tableGround[4][parmasName];
      }
    },

    async goDetail(params) {
      let { questions } = params.row;
      this.stuHwInfo = params.row;
      this.showModal = true;
      this.curDirectory = 6;
      localStorage.removeItem("subjectList");
      await this.getStuSubjectList(questions);
    },

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
        await this.getStuClassHW();
        this.$Notice.success({
          title: "评分成功！"
        });
      }
    },

    async goNext(info) {
      this.curCourseInfo = info;
      await this.getClassHourList();
    },

    // 获取课程的课时列表
    async getClassHourList(page = 1) {
      this.loading = true;
      let res = await getCourseClassList({
        page,
        course_id: this.curCourseInfo["id"]
      });
      this.$set(this.tableGround[0], "data", res.data.courseTimeList);
      this.$set(this.tableGround[0], "total", res.data.count);
      this.isSelectCourse = false;
      this.loading = false;
    },

    // 教师查看课时作业
    async getClassHW(page) {
      this.loading = true;
      let { name, semester } = this.curCourseInfo;
      let res = await this.getTeaClassHW({
        page,
        course: name,
        teacher: this.userName,
        semester,
        classHour: this.curClassHour
      });
      this.$set(this.tableGround[2], "data", res.data);
      this.$set(this.tableGround[2], "total", res.count);
      this.loading = false;
    },

    // 教师查看在线作业
    async getOnlineHW(page) {
      this.loading = true;
      let { name, semester } = this.curCourseInfo;
      let res = await this.getTeaOnlineHW({
        page,
        course: name,
        teacher: this.userName,
        semester,
        classHour: this.curClassHour
      });
      this.$set(this.tableGround[2], "data", res.data);
      this.$set(this.tableGround[2], "total", res.count);
      this.loading = false;
    },

    // 获取学生课时作业列表(用于评分)
    async getStuClassHW(page = 1) {
      this.loading = true;
      let { name, semester, classes } = this.curCourseInfo;
      let res = await this.getStuHWList({
        page,
        exper_id: this.stuHWId,
        course: name,
        semester,
        teacher: this.userName,
        stuclass: classes,
        classHour: this.curClassHour
      });
      this.$set(this.tableGround[3], "data", res.data);
      this.$set(this.tableGround[3], "total", res.count);
      this.allStuClassHW =
        res.alldata &&
        res.alldata.map(item => {
          return {
            localname: item["localname"],
            name: `${item["name"]}.docx`
          };
        });
      this.loading = false;
    },

    // 获取学生在线作业作业列表(用于评分)
    async getStuOnlineHW(page = 1) {
      this.loading = true;
      let { name, semester, classes } = this.curCourseInfo;
      let res = await this.getStuOnlineHWList({
        page,
        exper_id: this.stuHWId,
        course: name,
        semester,
        teacher: this.userName,
        stuclass: classes,
        classHour: this.curClassHour
      });
      this.$set(this.tableGround[4], "data", res.data);
      this.$set(this.tableGround[4], "total", res.count);
      this.loading = false;
    },

    async getStuSubjectList(questions = []) {
      let subjectLength = 0;
      let executeOnce = true;
      let inputInfo =
        questions["length"] > 0 &&
        questions.reduce((arr, item, index) => {
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
                item["type"] === "多选题" && answer
                  ? answer.split(",")
                  : answer,
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
      await this.getStuOnlineHW();
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
    async changeSearchPage(page) {
      await this.searchResult(this.searchText, page);
    },

    // 表格分页
    async changePage(page) {
      switch (this.curDirectory) {
        case 1:
          await this.getClassHourList(page);
          this.$set(this.tableGround[0], "page", page);
          break;
        case 3:
          if (this.curHWtype === "课时作业") {
            await this.getClassHW(page);
          } else {
            await this.getOnlineHW(page);
          }
          this.$set(this.tableGround[2], "page", page);
          break;
        case 4:
          await this.getStuClassHW(page);
          this.$set(this.tableGround[3], "page", page);
          break;
        case 5:
          await this.getStuOnlineHW(page);
          this.$set(this.tableGround[4], "page", page);
          break;
      }
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