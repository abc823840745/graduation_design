<template>
  <div class="containter">
    <div class="containter" v-if="!isChangeHWTasks">
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
        :columns="columns1"
        :data="data1"
      />
      <Page :total="30" class="mar-top page" />
    </div>

    <ChangeHomeworkTasks v-if="isChangeHWTasks" @goBack="goBack" />
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import ChangeHomeworkTasks from "@teaHomework/smart/change-homework-tasks";
import myMixin from "@/view/global/mixin";

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice,
    ChangeHomeworkTasks
  },

  data() {
    return {
      isChangeHWTasks: false,
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
      columns1: [
        {
          title: "课程名",
          key: "courseName"
        },
        {
          title: "作业名",
          key: "homeworkName"
        },
        {
          title: "作业类型",
          key: "homeworkClassify"
        },
        {
          title: "截止时间",
          key: "stopTime",
          sortable: true
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle(
                "修改任务信息",
                h,
                () => (this.isChangeHWTasks = true)
              ),
              this.btnStyle(
                "删除",
                h,
                () =>
                  this.$Modal.confirm({
                    title: "确定要删除该任务？",
                    onOk: () => {
                      // TODO: 删除任务信息
                    }
                  }),
                "error"
              )
            ]);
          }
        }
      ],
      data1: [
        {
          courseName: "新媒体实训",
          homeworkName: "搭建服务器",
          homeworkClassify: "课时作业",
          stopTime: "2019-1-27"
        },
        {
          courseName: "新媒体实训",
          homeworkClassify: "在线作业",
          homeworkName: "堂上搭建服务器",
          stopTime: "2019-1-27"
        }
      ]
    };
  },

  methods: {
    goBack() {
      this.isChangeHWTasks = false;
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
