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
        :data="tableData"
      />
      <Page :total="30" class="mar-top page" />
    </div>

    <MyHomework
      type="update"
      :modalOpen.sync="modalOpen"
      :sumbitInfo="submitInfo"
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
    ...mapState({
      userName: state => state.user.userName
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
          list: this.getSchoolYear()
        },
        {
          tip: "课程选择",
          value: "所有课程",
          list: this.getCourseList()
        },
        {
          tip: "作业类型",
          value: "所有类型",
          list: this.getClassifyList()
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
          key: "classify"
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
                this.itemInfo = this.tableData[params.index];
                await this.getSubjectData();
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
      ],
      tableData: []
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
      "getTeaOnlineHW"
    ]),

    async getTableData() {
      let res = await this.getTeaHW({
        course: ["新媒体综合实训", "就业与创业指导"],
        teacher: this.userName,
        semester: this.getCurSchoolYear()
      });
      if (res) {
        res.forEach(item => {
          item["classify"] =
            item["type"] === "offline" ? "课时作业" : "在线作业";
        });
      }
      this.tableData = res;
    },

    // 修改模式获取题目数据
    async getSubjectData() {
      if (this.itemInfo["classify"] === "在线作业") {
        let { semester, course, teacher } = this.submitInfo;
        await this.getTeaOnlineHW({
          course,
          teacher,
          semester
        });
      }
    },

    // 删除课时作业
    async delClassHWInfo(index) {
      let { id } = this.tableData[index];
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
      let { id } = this.tableData[index];
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
