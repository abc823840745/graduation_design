<template>
  <div class="containter">
    <CourseSelect
      v-show="isSelectCourse"
      @goNext='goNext'
    />

    <div
      class="containter"
      v-show="!isSelectCourse && curDirectory !== 2"
    >
      <div class="select-con">
        <MultipleChoice
          v-for="(item,index) in selectList"
          :key="index"
          :defaultValue.sync="item['defaultValue']"
          :semesterTip="item['semesterTip']"
          :semesterList="item['semesterList']"
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

    <HomeworkDetail
      v-show="curDirectory === 2"
      @goBack='goBack'
    />
  </div>
</template>

<script>
import HomeworkDetail from "@stuHomework/smart/check-online-homework-detail";
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import CourseSelect from "@teaHomework/smart/course-select";
import myMixin from "@/view/global/mixin";

export default {
  name: "my-homework",

  mixins: [myMixin],

  components: {
    HomeworkDetail,
    MultipleChoice,
    CourseSelect
  },

  data() {
    return {
      isSelectCourse: true,
      curDirectory: 1, // 当前的目录
      columns1: [
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
                this.btnStyle("查看", h, () => (this.curDirectory = 2)),
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
          semesterTip: "作业类型",
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
    goNext() {
      this.isSelectCourse = false;
    },

    goBack() {
      this.curDirectory = 1;
    },

    revert() {
      this.curDirectory = 1;
      this.isSelectCourse = true;
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

    .search-item {
      margin-left: 4%;
      width: 271px;
    }
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
