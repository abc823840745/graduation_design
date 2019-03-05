<template>
  <div class="containter">
    <div class="containter">
      <div class="select-list">
        <MultipleChoice
          v-for="item in selectList"
          :key="item['tip']"
          :semesterTip="item['tip']"
          :defaultValue.sync="item['value']"
          :semesterList="item['list']"
          @onChange="item['onChange']"
          class="multiple-choice"
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
        :columns="columns"
        :data="tableInfo['tableData']"
      />
      <Page
        class="mar-top page"
        :total="tableInfo['count']"
        :page-size="10"
        @on-change="changePage"
      />
    </div>

    <MyHomework
      type="update"
      :modalOpen.sync="modalOpen"
      :info="itemInfo"
      @getTableData="getTableData"
    />
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import MyHomework from "@teaHomework/smart/my-homework";
import myMixin from "@/view/global/mixin";
import { mapActions, mapState } from "vuex";

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice,
    MyHomework
  },

  computed: {
    getAllCourse() {
      return ["新媒体综合实训", "就业与创业指导"];
    },

    ...mapState({
      userName: state => state.user.userName,
      tableInfo: state => state.homework.taskCenterInfo
    })
  },

  data() {
    return {
      modalOpen: false,
      curIndex: 0,
      submitInfo: {
        semester: "2018-2019上学期",
        course: "新媒体综合实训",
        course_id: 1,
        // teacher: this.$store.state.user.userName
        teacher: "程亮"
      },
      itemInfo: {},
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
          title: "作业名称",
          key: "name"
        },
        {
          title: "作业类型",
          key: "classify",
          sortable: true
        },
        {
          title: "截止时间",
          key: "fintime",
          sortable: true
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("修改任务信息", h, async () => {
                this.modalOpen = true;
                this.itemInfo = this.tableInfo["tableData"][params.index];
                await this.getSubjectData(params.row.id);
              }),
              this.btnStyle(
                "删除",
                h,
                () =>
                  this.$Modal.confirm({
                    title: "确定要删除该任务？",
                    onOk: () => {
                      if (params.row.classify === "课时作业") {
                        return this.delClassHWInfo(params.index);
                      }
                      this.delOnlineHWInfo(params.index);
                    }
                  }),
                "error"
              )
            ]);
          }
        }
      ]
    };
  },

  async mounted() {
    await this.getTableData();
  },

  methods: {
    ...mapActions([
      "getTeaClassHW",
      "delTeaClassHW",
      "delTeaOnlineHW",
      "getTeaHW",
      "getTeaOnlineHW",
      "getTeaSubject"
    ]),

    async getTableData() {
      await this.getTeaHW({
        course: this.getAllCourse,
        teacher: this.userName,
        semester: this.getCurSchoolYear()
      });
    },

    async changeYear(value) {
      await this.getTeaHW({
        course:
          this.selectList[1]["value"] === "所有课程"
            ? this.getAllCourse
            : [this.selectList[1]["value"]],
        semester: value,
        classHour:
          this.selectList[2]["value"] === "所有课时"
            ? undefined
            : this.selectList[2]["value"],
        teacher: this.userName
      });
    },

    async changeCourse(value) {
      await this.getTeaHW({
        course: value === "所有课程" ? this.getAllCourse : [value],
        semester: this.selectList[0]["value"],
        classHour:
          this.selectList[2]["value"] === "所有课时"
            ? undefined
            : this.selectList[2]["value"],
        teacher: this.userName
      });
    },

    async changeClassHour(value) {
      await this.getTeaHW({
        course:
          this.selectList[1]["value"] === "所有课程"
            ? this.getAllCourse
            : [this.selectList[1]["value"]],
        semester: this.selectList[0]["value"],
        classHour: value === "所有课时" ? undefined : value,
        teacher: this.userName
      });
    },

    async changePage(page) {
      await this.getTeaHW({
        page,
        course:
          this.selectList[1]["value"] === "所有课程"
            ? this.getAllCourse
            : [this.selectList[1]["value"]],
        semester: this.selectList[0]["value"],
        classHour:
          this.selectList[2]["value"] === "所有课时"
            ? undefined
            : this.selectList[2]["value"],
        teacher: this.userName
      });
    },

    // 修改模式获取题目数据
    async getSubjectData(id) {
      if (this.itemInfo["classify"] === "在线作业") {
        let res = await this.getTeaSubject(id);
      }
    },

    // 删除课时作业
    async delClassHWInfo(index) {
      let { id } = this.tableInfo["tableData"][index];
      let res = await this.delTeaClassHW(id);
      if (res["status"] === 1) {
        await this.getTableData();
        this.$Notice.success({
          title: "删除成功！"
        });
      }
    },

    // 删除在线作业
    async delOnlineHWInfo(index) {
      let { id } = this.tableInfo["tableData"][index];
      let res = await this.delTeaOnlineHW(id);
      if (res["status"] === 1) {
        await this.getTableData();
        this.$Notice.success({
          title: "删除成功！"
        });
      }
    }
  }
};
</script>

<style lang='less' scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .select-list {
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

  .flex-start {
    align-self: flex-start;
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
}
</style>
