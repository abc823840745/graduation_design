<template>
  <div class="containter">

    <div
      class="containter"
      v-show="curDirectory !== 2"
    >
      <Modal
        v-model="showModal"
        title="上传"
        @on-ok="dialogOk"
        @on-cancel="dialogCancel"
      >
        <Alert show-icon>只能上传单个文件或文件夹，如果上传有误，请重新上传即可</Alert>

        <Select
          v-model="weeksNum"
          placeholder='请选择周数'
          style="width:200px;margin-bottom:10px;"
        >
          <Option
            v-for="item in weeksList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>

        <Upload
          ref="upload"
          type="drag"
          :on-remove="handleremove"
          action="//jsonplaceholder.typicode.com/posts/"
        >
          <div style="padding: 20px 0">
            <Icon
              type="ios-cloud-upload"
              size="52"
              style="color: #3399ff"
            ></Icon>
            <p>点击或者把文件拖拽到这里</p>
          </div>
        </Upload>
      </Modal>

      <div class="select-con">
        <MultipleChoice
          v-for="(item,index) in selectList"
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

      <Page
        :total="30"
        class="mar-top page"
      />
    </div>

    <HomeworkDetail
      v-show="curDirectory === 2"
      @goBack='goBack'
    />
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import HomeworkDetail from "@stuHomework/smart/check-online-homework-detail";
import myMixin from "@stuHomework/mixin";

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
          semesterTip: "学期",
          defaultValue: "2018-2019上学期",
          semesterList: [
            {
              value: "2015-2016上学期",
              label: "2015-2016上学期"
            },
            {
              value: "2016-2017上学期",
              label: "2016-2017上学期"
            },
            {
              value: "2017-2018上学期",
              label: "2017-2018上学期"
            },
            {
              value: "2018-2019上学期",
              label: "2018-2019上学期"
            }
          ]
        },
        {
          semesterTip: "课程",
          defaultValue: "所有课程",
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
              value: "Vue应用开发",
              label: "Vue应用开发"
            }
          ]
        },
        {
          semesterTip: "周数",
          defaultValue: "",
          semesterList: [
            {
              value: "第一周",
              label: "第一周"
            },
            {
              value: "第二周",
              label: "第二周"
            }
          ]
        },
        {
          semesterTip: "状态",
          defaultValue: "",
          semesterList: [
            {
              value: "未完成",
              label: "未完成"
            },
            {
              value: "已完成",
              label: "已完成"
            },
            {
              value: "已过期",
              label: "已过期"
            }
          ]
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
                this.btnStyle("查看", h, () => (this.curDirectory = 2))
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
    goBack() {
      this.curDirectory = 1;
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
  justify-content: flex-start;

  .multiple-choice /deep/ .select-list {
    margin-right: 16px;
    width: 160px;
  }

  .mar-top {
    margin-top: 2.5%;
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
    width: 100%;

    .search-item {
      margin-top: -1px;
      width: 220px;
    }
  }
}
</style>