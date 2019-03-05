<template>
  <div class="containter">
    <div class="containter" v-show="curDirectory !== 2">
      <div class="select-con">
        <MultipleChoice
          v-for="(item, index) in selectList"
          :key="index"
          :defaultValue.sync="item['defaultValue']"
          :semesterTip="item['semesterTip']"
          :semesterList="item['semesterList']"
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

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice,
    HomeworkDetail
  },

  data() {
    return {
      curDirectory: 1, // 当前的目录
      showModal: false,
      selectList: [
        {
          semesterTip: "学期选择",
          defaultValue: this.getCurSchoolYear(),
          semesterList: this.getSchoolYear()
        },
        {
          semesterTip: "课程选择",
          defaultValue: "所有课程",
          semesterList: this.getCourseList()
        },
        {
          semesterTip: "课时选择",
          defaultValue: "所有课时",
          semesterList: this.getClassHourList()
        },
        {
          semesterTip: "作业类型",
          defaultValue: "所有类型",
          semesterList: this.getClassifyList()
        },
        {
          semesterTip: "完成状态",
          defaultValue: "所有状态",
          semesterList: this.getFinishList()
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
          key: "name"
        },
        {
          title: "作业类型",
          key: "homeworkClassify"
        },
        {
          title: "完成状态",
          key: "status"
        },
        {
          title: "评分",
          key: "grading"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            const homeworkClassify = params["row"]["homeworkClassify"];
            if (homeworkClassify === "在线作业") {
              return h("div", [
                this.btnStyle("查看", h, () => (this.showModal = true))
              ]);
            }
            return h("div", [
              this.btnStyle("下载", h, () => {
                window.open(params.row.webpath);
              })
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
    ...mapActions(["getTeaHW"]),

    handleOk() {
      this.curDirectory = 1;
    },

    handleCancel() {
      this.curDirectory = 1;
    },

    async getTableData() {
      // let res = await this.getTeaHW({
      //   semester: "2018-2019上学期",
      //   course: "新媒体综合实训",
      //   teacher: "程亮"
      // });
      // res.forEach(item => {
      //   item["homeworkClassify"] =
      //     item["type"] === "online" ? "在线作业" : "课时作业";
      // });
      // this.tableData = res;
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