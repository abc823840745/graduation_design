<template>
  <div class="containter">
    <div
      class="containter"
      v-if="!isChangeHWTasks"
    >
      <div class="select-list">
        <MultipleChoice
          v-for="item in selectList"
          :key="item['semesterTip']"
          :semesterTip="item['semesterTip']"
          :defaultValue="item['semester']"
          :semesterList="item['semesterList']"
          class="flex-start"
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
      <Page
        :total="30"
        class="mar-top"
      />
    </div>

    <ChangeHomeworkTasks
      v-if="isChangeHWTasks"
      @goBack="goBack"
    />

  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import ChangeHomeworkTasks from "@teaHomework/smart/change-homework-tasks";
import myMixin from "@teaHomework/mixin";

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
          semesterTip: "学期选择",
          semester: "2017-2018第二学期",
          semesterList: [
            {
              value: "2016-2017第一学期",
              label: "2016-2017第一学期"
            },
            {
              value: "2016-2017第二学期",
              label: "2016-2017第二学期"
            },
            {
              value: "2017-2018第一学期",
              label: "2017-2018第一学期"
            },
            {
              value: "2017-2018第二学期",
              label: "2017-2018第二学期"
            }
          ]
        },
        {
          semesterTip: "课程选择",
          semester: "所有课程",
          semesterList: [
            {
              value: "所有课程",
              label: "所有课程"
            },
            {
              value: "新媒体实训",
              label: "新媒体实训"
            },
            {
              value: "JavaScript编程",
              label: "JavaScript编程"
            },
            {
              value: "vue应用程序开发",
              label: "vue应用程序开发"
            },
            {
              value: "mysql数据库",
              label: "mysql数据库"
            }
          ]
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
          key: "stopTime"
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
    width: 100%;
    display: flex;
    align-self: flex-start;
    .search-item {
      margin-left: 4%;
      width: 20%;
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
}
</style>
