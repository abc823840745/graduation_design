<template>
  <div class="containter">
    <div class="containter" v-show="curDirectory !== 2">
      <div class="select-con">
        <MultipleChoice
          class="multiple-choice"
          v-for="(item, index) in selectList"
          :key="index"
          :defaultValue.sync="item['value']"
          :semesterTip="item['tip']"
          :semesterList="item['list']"
          @onChange="item['onChange']"
        />

        <Button
          type="primary"
          icon="ios-search"
          class="search-btn"
          @click="searchOpen"
          >Search</Button
        >
      </div>

      <Table
        border
        class="table-con mar-top"
        :loading="loading"
        :columns="columns"
        :data="tableInfo['tableData']"
      />

      <Page
        class="mar-top page"
        :total="tableInfo['count']"
        @on-change="getTableData"
      />
    </div>

    <Modal fullscreen v-model="showModal" @on-cancel="handleCancel">
      <p slot="header" style="text-align:center">
        查看在线作业
      </p>
      <div slot="footer">
        <Button type="primary" size="large" @click="handleOk">返回</Button>
      </div>
      <HomeworkDetail />
    </Modal>

    <Modal fullscreen title="搜索" v-model="modalOpen" @on-ok="searchClose">
      <SearchView
        :columns="columns"
        :tableData="tableData"
        :total="searchCount"
        @search="getSearchResult"
        @changePage="changePage"
      />
      <div slot="footer">
        <Button type="primary" size="large" @click="goBack">
          返回
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import myMixin from "@/view/global/mixin";
import { mapState, mapActions } from "vuex";
import { getCurSchoolYear } from "@tools";
import { types } from "util";

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice: () => import("@teaHomework/smart/multiple-choice"),
    HomeworkDetail: () =>
      import("@stuHomework/smart/check-online-homework-detail"),
    SearchView: () => import("@/view/global/component/search-view")
  },

  computed: {
    ...mapState({
      userName: state => state.user.userName,
      stuId: state => state.user.stu_nmuber,
      courseList: state => state.homework.courseList,
      tableInfo: state => state.homework.stuMyHWList
    }),

    allCourseList() {
      return this.courseList.map(item => {
        let { name, classes, teacher } = item;
        return {
          course: name,
          stuclass: classes,
          teacher
        };
      });
    },

    selectCourse() {
      return value => {
        return this.allCourseList.filter(item => item["course"] === value);
      };
    }
  },

  data() {
    return {
      curDirectory: 1, // 当前的目录
      showModal: false,
      modalOpen: false,
      loading: true,
      searchText: "",
      searchCount: 1,
      tableData: [],
      selectList: [
        {
          tip: "学期选择",
          value: getCurSchoolYear(),
          list: this.getSchoolYear(),
          onChange: this.changeYear
        },
        {
          tip: "课程选择",
          value: "所有课程",
          list: [
            {
              value: "所有课程",
              label: "所有课程"
            }
          ],
          onChange: this.changeCourse
        },
        {
          tip: "课时选择",
          value: "所有课时",
          list: [
            {
              value: "所有课时",
              label: "所有课时"
            }
          ],
          onChange: this.changeClassHour
        },
        {
          tip: "作业类型",
          value: "所有类型",
          list: [
            {
              value: "所有类型",
              label: "所有类型"
            },
            {
              value: "课时作业",
              label: "课时作业"
            },
            {
              value: "在线作业",
              label: "在线作业"
            }
          ],
          onChange: this.changeHWClassify
        }
      ],
      columns: [
        {
          title: "课程名称",
          key: "course"
        },
        {
          title: "课时",
          key: "week"
        },
        {
          title: "实验名称",
          key: "exper_name"
        },
        {
          title: "作业类型",
          key: "classify",
          render: (h, params) => {
            const { classify } = params.row;
            if (classify === "在线作业") return h("p", {}, "在线作业");
            return h("p", {}, "课时作业");
          }
        },
        {
          title: "完成状态",
          key: "status",
          render: (h, params) => {
            let text = params.row.status;
            let btnColor = null;
            switch (text) {
              case "已完成":
                btnColor = "success";
                break;
              case "进行中":
                btnColor = "warning";
                break;
              default:
                btnColor = "error";
                break;
            }
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
            const { classify, status } = params.row;
            if (classify === "在线作业") {
              if (status === "已完成") {
                return h("div", [
                  this.btnStyle("查看", h, () => {
                    this.goDetail(params);
                  })
                ]);
              }
              return h("div", [this.disableBtnStyle("查看", h)]);
            } else {
              if (status === "已完成") {
                return h("div", [
                  this.btnStyle("下载", h, () => {
                    this.goDownload(params);
                  })
                ]);
              }
              return h("div", [this.disableBtnStyle("下载", h)]);
            }
          }
        }
      ]
    };
  },

  async mounted() {
    await this.setCourseSelList();
    await this.getTableData();
  },

  methods: {
    ...mapActions([
      "getTeaHW",
      "getStuMyHWlist",
      "getStuScoreSubject",
      "searchMyHWlist"
    ]),

    goDetail(params) {
      let { id, exper_id } = params.row;
      this.showModal = true;
      this.getSubjectList(id, exper_id);
    },

    goDownload(params) {
      let { webpath } = params.row;
      window.open(webpath);
    },

    handleOk() {
      this.showModal = false;
      this.curDirectory = 1;
    },

    handleCancel() {
      this.curDirectory = 1;
    },

    // 获取表格数据
    async getTableData(page = 1) {
      this.loading = true;
      let semester = this.selectList[0]["value"];
      let course = this.selectList[1]["value"];
      let classHour = this.selectList[2]["value"];
      let type = this.selectList[3]["value"];
      await this.getStuMyHWlist({
        page,
        obj:
          course === "所有课程"
            ? this.allCourseList
            : this.selectCourse(course),
        semester,
        type: this.transHwClassify(type),
        classHour: classHour === "所有课时" ? undefined : classHour,
        student: this.userName,
        stuId: this.stuId
      });
      this.loading = false;
    },

    // 学年选择
    async changeYear(value) {
      this.loading = true;
      this.resetSelList();
      let semester = value;
      let course = this.selectList[1]["value"];
      let classHour = this.selectList[2]["value"];
      let type = this.selectList[3]["value"];
      await this.setCourseSelList(value);
      await this.getStuMyHWlist({
        obj:
          course === "所有课程"
            ? this.allCourseList
            : this.selectCourse(course),
        semester,
        type: this.transHwClassify(type),
        classHour: classHour === "所有课时" ? undefined : classHour,
        student: this.userName,
        stuId: this.stuId
      });
      this.loading = false;
    },

    // 课程选择
    async changeCourse(value) {
      this.loading = true;
      this.resetClassHour();
      let semester = this.selectList[0]["value"];
      let course = value;
      let classHour = this.selectList[2]["value"];
      let type = this.selectList[3]["value"];
      let getId = this.courseList.reduce((arr, item) => {
        if (item["name"] === value) {
          arr.push(item["id"]);
        }
        return arr;
      }, []);
      await this.setClassHourSelList(getId[0]);
      await this.getStuMyHWlist({
        obj:
          course === "所有课程"
            ? this.allCourseList
            : this.selectCourse(course),
        semester,
        type: this.transHwClassify(type),
        classHour: classHour === "所有课时" ? undefined : classHour,
        student: this.userName,
        stuId: this.stuId
      });
      this.loading = false;
    },

    // 课时选择
    async changeClassHour(value) {
      this.loading = true;
      let semester = this.selectList[0]["value"];
      let course = this.selectList[1]["value"];
      let type = this.selectList[3]["value"];
      let classHour = value;
      await this.getStuMyHWlist({
        obj:
          course === "所有课程"
            ? this.allCourseList
            : this.selectCourse(course),
        semester,
        type: this.transHwClassify(type),
        classHour: classHour === "所有课时" ? undefined : classHour,
        student: this.userName,
        stuId: this.stuId
      });
      this.loading = false;
    },

    // 作业类型筛选
    async changeHWClassify(value) {
      this.loading = true;
      let semester = this.selectList[0]["value"];
      let course = this.selectList[1]["value"];
      let classHour = this.selectList[2]["value"];
      await this.getStuMyHWlist({
        obj:
          course === "所有课程"
            ? this.allCourseList
            : this.selectCourse(course),
        semester,
        type: this.transHwClassify(value),
        classHour: classHour === "所有课时" ? undefined : classHour,
        student: this.userName,
        stuId: this.stuId
      });
      this.loading = false;
    },

    transHwClassify(value) {
      if (value === "所有类型") return undefined;
      if (value === "课时作业") return "offline";
      if (value === "在线作业") return "online";
    },

    // 获取在线作业题目
    async getSubjectList(id, exper_id) {
      await this.getStuScoreSubject({
        id,
        exper_id
      });
    },

    // 打开搜索页
    searchOpen() {
      this.modalOpen = true;
    },

    searchClose() {
      this.modalOpen = false;
    },

    // 搜索结果
    async searchResult(searchText, page = 1) {
      this.searchText = searchText;
      let res = await this.searchMyHWlist({
        page,
        semester: this.selectList[0]["value"],
        condition: searchText,
        stuId: this.stuId,
        student: this.userName
      });
      this.searchCount = res.count;
      this.tableData = res.data;
    },

    // 获取搜索结果
    async getSearchResult(searchText) {
      await this.searchResult(searchText);
    },

    // 搜索表格分页
    async changePage(page) {
      await this.searchResult(this.searchText, page);
    },

    // 关闭modal
    goBack() {
      this.modalOpen = false;
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../../global/public.less";

.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .mar-top {
    margin-top: 1.5%;
  }

  .table-con {
    width: 100%;
  }

  .page {
    align-self: flex-end;
  }

  .select-con {
    display: flex;
    align-self: flex-start;
    flex-wrap: wrap;
    width: 100%;

    .search-btn {
      height: 32px;
    }

    .multiple-choice {
      margin-bottom: 10px;
    }

    .multiple-choice /deep/ .select-list {
      margin-right: 30px;
    }

    .search-item {
      margin-top: -1px;
      width: 271px;
    }
  }
}
</style>