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
        :columns="columns1"
        :data="data1"
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
      weeksNum: "",
      weeksList: [
        {
          value: "第一周",
          label: "第一周"
        },
        {
          value: "第二周",
          label: "第二周"
        },
        {
          value: "第三周",
          label: "第三周"
        },
        {
          value: "第四周",
          label: "第四周"
        },
        {
          value: "第五周",
          label: "第五周"
        },
        {
          value: "第六周",
          label: "第六周"
        }
      ],
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
          semesterTip: "周数选择",
          defaultValue: "所有周数",
          semesterList: this.getWeekList()
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
      columns1: [
        {
          title: "课程名称",
          key: "courseName"
        },
        {
          title: "实验",
          key: "experiment"
        },
        {
          title: "周数",
          key: "weeksNum"
        },
        {
          title: "作业类型",
          key: "homeworkClassify"
        },
        {
          title: "状态",
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
              this.btnStyle("下载", h, () => this.$Message.info("下载中"))
            ]);
          }
        }
      ],
      data1: [
        {
          courseName: "新媒体实训",
          weeksNum: "第一周",
          experiment: "堂上构建简单服务器",
          grading: 100,
          status: "已完成",
          homeworkClassify: "在线作业"
        },
        {
          courseName: "新媒体实训",
          weeksNum: "第二周",
          experiment: "构建简单服务器",
          grading: 0,
          status: "未完成",
          homeworkClassify: "课时作业"
        },
        {
          courseName: "JavaScript编程",
          weeksNum: "第一周",
          experiment: "堂上构建简单服务器",
          grading: 100,
          status: "已完成",
          homeworkClassify: "在线作业"
        },
        {
          courseName: "JavaScript编程",
          weeksNum: "第二周",
          experiment: "构建简单服务器",
          grading: 0,
          status: "未完成",
          homeworkClassify: "课时作业"
        },
        {
          courseName: "Vue应用开发",
          weeksNum: "第一周",
          experiment: "堂上构建简单服务器",
          grading: 100,
          status: "已完成",
          homeworkClassify: "在线作业"
        },
        {
          courseName: "Vue应用开发",
          weeksNum: "第二周",
          experiment: "构建简单服务器",
          grading: 0,
          status: "未完成",
          homeworkClassify: "课时作业"
        }
      ]
    };
  },

  methods: {
    handleOk() {
      this.curDirectory = 1;
    },

    handleCancel() {
      this.curDirectory = 1;
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