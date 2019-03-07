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

        <Input
          class="search-item"
          search
          enter-button
          placeholder="请输入关键词"
        />
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

    <Modal
      fullscreen
      v-model="showModal"
      @on-ok="handleOk"
      @on-cancel="handleCancel"
    >
      <p slot="header" style="text-align:center">
        在线作业：堂上构建简单服务器
      </p>
      <HomeworkDetail />
    </Modal>
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import HomeworkDetail from "@stuHomework/smart/check-online-homework-detail";
import myMixin from "@/view/global/mixin";
import { mapState, mapActions } from "vuex";
import { stat } from "fs";

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice,
    HomeworkDetail
  },

  computed: {
    ...mapState({
      userName: state => state.user.userName,
      stuId: state => state.user.stu_nmuber,
      tableInfo: state => state.homework.stuMyHWList
    }),

    getAllCourse() {
      return [
        {
          course: "新媒体综合实训",
          stuclass: "ATM",
          teacher: "程亮"
        },
        {
          course: "就业与创业指导",
          stuclass: "ATM",
          teacher: "程亮"
        }
      ];
    }
  },

  data() {
    return {
      curDirectory: 1, // 当前的目录
      showModal: false,
      loading: true,
      selectList: [
        {
          tip: "学期选择",
          value: this.getCurSchoolYear(),
          list: this.getSchoolYear(),
          onChange: this.changeYear
        },
        {
          tip: "课程选择",
          value: "所有课程",
          list: this.getCourseList(),
          onChange: this.changeCourse
        },
        {
          tip: "课时选择",
          value: "所有课时",
          list: this.getClassHourList(),
          onChange: this.changeClassHour
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
          sortable: true
        },
        {
          title: "完成状态",
          key: "status",
          sortable: true
        },
        {
          title: "评分",
          key: "grade",
          render: (h, params) => {
            let grade = null;
            switch (params.row.grade) {
              case "1":
                grade = "不及格";
                break;
              case "2":
                grade = "及格";
                break;
              case "3":
                grade = "中";
                break;
              case "4":
                grade = "良";
                break;
              case "5":
                grade = "优";
                break;
              default:
                grade = "待评分";
            }
            return h("p", {}, grade);
          }
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            let { classify, status } = params.row;
            if (classify === "在线作业") {
              if (status === "已完成") {
                return h("div", [
                  this.btnStyle("查看", h, () => {
                    this.showModal = true;
                    this.getSubjectList(params.row.exper_id);
                  })
                ]);
              }
              return h("div", [this.disableBtnStyle("查看", h)]);
            } else {
              if (status === "已完成") {
                return h("div", [
                  this.btnStyle("下载", h, () => {
                    window.open(params.row.webpath);
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
    await this.getTableData(this.tableInfo["page"]);
  },

  methods: {
    ...mapActions(["getTeaHW", "getStuMyHWlist", "getStuOnlineSubject"]),

    handleOk() {
      this.curDirectory = 1;
    },

    handleCancel() {
      this.curDirectory = 1;
    },

    async getTableData(page) {
      this.loading = true;
      await this.getStuMyHWlist({
        page,
        obj:
          this.selectList[1]["value"] === "所有课程"
            ? this.getAllCourse
            : [
                {
                  course: this.selectList[1]["value"],
                  stuclass: "ATM",
                  teacher: "程亮"
                }
              ],
        semester: this.selectList[0]["value"],
        classHour:
          this.selectList[2]["value"] === "所有课时"
            ? undefined
            : this.selectList[2]["value"],
        student: this.userName,
        stuId: this.stuId
      });
      this.loading = false;
    },

    async changeYear(value) {
      this.loading = true;
      await this.getStuMyHWlist({
        // TODO: 暂时写死，课程信息由课程接口返回
        obj:
          this.selectList[1]["value"] === "所有课程"
            ? this.getAllCourse
            : [
                {
                  course: this.selectList[1]["value"],
                  stuclass: "ATM",
                  teacher: "程亮"
                }
              ],
        semester: value,
        classHour:
          this.selectList[2]["value"] === "所有课时"
            ? undefined
            : this.selectList[2]["value"],
        student: this.userName,
        stuId: this.stuId
      });
      this.loading = false;
    },

    async changeCourse(value) {
      this.loading = true;
      await this.getStuMyHWlist({
        obj:
          value === "所有课程"
            ? this.getAllCourse
            : [
                {
                  course: value,
                  stuclass: "ATM",
                  teacher: "程亮"
                }
              ],
        semester: this.selectList[0]["value"],
        classHour:
          this.selectList[2]["value"] === "所有课时"
            ? undefined
            : this.selectList[2]["value"],
        student: this.userName,
        stuId: this.stuId
      });
      this.loading = false;
    },

    async changeClassHour(value) {
      this.loading = true;
      await this.getStuMyHWlist({
        obj:
          this.selectList[1]["value"] === "所有课程"
            ? this.getAllCourse
            : [
                {
                  course: this.selectList[1]["value"],
                  stuclass: "ATM",
                  teacher: "程亮"
                }
              ],
        semester: this.selectList[0]["value"],
        classHour: value === "所有课时" ? undefined : value,
        student: this.userName,
        stuId: this.stuId
      });
      this.loading = false;
    },

    async getSubjectList(id) {
      await this.getStuOnlineSubject(id);
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