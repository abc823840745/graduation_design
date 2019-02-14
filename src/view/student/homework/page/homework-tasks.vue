<template>
  <div class="containter">
    <div
      class="containter"
      v-show="curDirectory!==3"
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

    <WriteOnlineHomework
      v-show="curDirectory===3"
      @goBack="goBack"
    />

  </div>
</template>

<script>
import WriteOnlineHomework from "@stuHomework/smart/write-online-homework.vue";
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import myMixin from "@stuHomework/mixin";

export default {
  name: "course-detail",

  mixins: [myMixin],

  components: {
    WriteOnlineHomework,
    MultipleChoice
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
          semesterTip: "所有课程",
          defaultValue: "所有课程",
          semesterList: [
            {
              value: "所有课程",
              label: "所有课程"
            },
            {
              value: "新媒体实训",
              label: "新媒体实训"
            }
          ]
        }
      ],
      columns1: [
        {
          title: "所属课程",
          key: "interCourse"
        },
        {
          title: "作业类型",
          key: "homeworkClassify"
        },
        {
          title: "实验",
          key: "experiment"
        },
        {
          title: "完成时间",
          key: "finishTime"
        },
        {
          title: "状态",
          key: "status"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            const classify = params["row"]["homeworkClassify"];
            if (classify === "在线作业") {
              return h("div", [
                this.btnStyle("完成作业", h, () => {
                  const status = params["row"]["status"];
                  if (status === "已完成") {
                    return this.$Message.info("你已完成作业");
                  }
                  this.curDirectory = 3;
                })
              ]);
            }
            return h("div", [
              this.btnStyle("上传作业", h, () => (this.showModal = true))
            ]);
          }
        }
      ],
      data1: [
        {
          interCourse: "新媒体实训",
          homeworkClassify: "在线作业",
          experiment: "堂上构建简单服务器",
          finishTime: "10分钟",
          status: "未完成"
        },
        {
          interCourse: "新媒体实训",
          homeworkClassify: "课时作业",
          experiment: "构建简单服务器",
          finishTime: "10分钟",
          status: "未完成"
        }
      ]
    };
  },

  methods: {
    goBack() {
      this.curDirectory = 1;
    },

    dialogOk() {
      this.$Message.info("Clicked ok");
    },

    dialogCancel() {
      this.$Message.info("Clicked cancel");
    },

    handleremove() {
      this.showDelmodal = true;
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

  .mar-top {
    margin-top: 2.5%;
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
      width: 20%;
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