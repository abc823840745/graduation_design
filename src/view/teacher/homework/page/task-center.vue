<template>
  <div class="containter">
    <div
      class="containter"
      v-if="!isChangeHWTasks"
    >
      <multiple-choice
        semesterTip='学期选择'
        :defaultValue='semester'
        :semesterList='semesterList'
        class="flex-start"
      />

      <Table
        stripe
        class="table-con mar-top"
        :columns="columns1"
        :data="data1"
      />
      <Page
        :total="30"
        class="mar-top"
      />
    </div>

    <change-homework-tasks
      v-if="isChangeHWTasks"
      @goBack="goBack"
    />

  </div>
</template>

<script>
import multipleChoice from "@teaHomework/smart/multiple-choice";
import changeHomeworkTasks from "@teaHomework/smart/change-homework-tasks";

export default {
  data() {
    return {
      isChangeHWTasks: false,
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
  components: {
    multipleChoice,
    changeHomeworkTasks
  },
  methods: {
    btnStyle(btnTitle, h, onclick) {
      return h(
        "Button",
        {
          props: {
            type: "primary",
            size: "default"
          },
          style: {
            marginRight: "5px"
          },
          on: {
            click: onclick
          }
        },
        btnTitle
      );
    },
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
