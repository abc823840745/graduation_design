<template>
  <div class="containter">
    <div
      class="containter"
      v-show="curDirectory!==3"
    >
      <div class="select-con">
        <MultipleChoice
          v-for="(item,index) in selectList"
          v-show="item['isShow']"
          :key="index"
          :defaultValue="item['defaultValue']"
          :semesterTip="item['semesterTip']"
          :semesterList="item['semesterList']"
        />
      </div>

      <Table
        stripe
        class="table-con mar-top"
        :columns="showTable('columns',2)"
        :data="showTable('data',2)"
      />
      <Page
        :total="30"
        class="mar-top"
      />
    </div>

    <HomeworkDetail
      v-show="curDirectory===3"
      @goBack='goBack'
    />
  </div>
</template>

<script>
import HomeworkDetail from "@stuHomework/smart/check-online-homework-detail";
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import myMixin from "@stuHomework/mixin";

export default {
  name: "my-homework",

  mixins: [myMixin],

  components: {
    HomeworkDetail,
    MultipleChoice
  },

  data() {
    return {
      curDirectory: 1, // 当前的目录
      columns1: [
        {
          title: "课程名",
          key: "courseName"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [this.btnStyle("查看", h, () => this.check())]);
          }
        }
      ],
      columns2: [
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
          title: "评分",
          key: "score"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            const homeworkClassify = params["row"]["homeworkClassify"];
            if (homeworkClassify === "在线作业") {
              return h("div", [
                this.btnStyle("查看", h, () => (this.curDirectory = 3)),
                this.btnStyle("返回", h, () => this.revert())
              ]);
            }
            return h("div", [
              this.btnStyle("下载", h, () => this.$Message.info("下载中")),
              this.btnStyle("返回", h, () => this.revert())
            ]);
          }
        }
      ],
      data1: [
        {
          courseName: "新媒体实训"
        },
        {
          courseName: "新媒体实训"
        },
        {
          courseName: "新媒体实训"
        }
      ],
      data2: [
        {
          homeworkName: "实验1",
          homeworkClassify: "在线作业",
          stopTime: "2018-9-14",
          score: "100"
        },
        {
          homeworkName: "实验2",
          homeworkClassify: "课时作业",
          stopTime: "2018-9-14",
          score: "100"
        }
      ],
      selectList: [
        {
          semesterTip: "学期选择",
          isShow: true,
          defaultValue: "2017-2018第二学期",
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
          semesterTip: "提交情况",
          isShow: false,
          defaultValue: "",
          semesterList: [
            {
              value: "已完成",
              label: "已完成"
            },
            {
              value: "未完成",
              label: "未完成"
            }
          ]
        },
        {
          semesterTip: "作业类型",
          isShow: false,
          defaultValue: "",
          semesterList: [
            {
              value: "课时作业",
              label: "课时作业"
            },
            {
              value: "在线作业",
              label: "在线作业"
            }
          ]
        }
      ]
    };
  },

  methods: {
    check() {
      this.curDirectory = 2;
      let selectList = [...this.selectList];
      selectList[0]["isShow"] = false;
      selectList[1]["isShow"] = true;
      selectList[2]["isShow"] = true;
      this.selectList = selectList;
    },

    revert() {
      this.curDirectory = 1;
      let selectList = [...this.selectList];
      selectList[0]["isShow"] = true;
      selectList[1]["isShow"] = false;
      selectList[2]["isShow"] = false;
      this.selectList = selectList;
    },

    goBack() {
      this.curDirectory = 2;
    }
  }
};
</script>

<style lang="less" scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  .mar-top {
    margin-top: 20px;
  }
  .table-con {
    width: 100%;
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
}
</style>
