<template>
  <div class="containter">
    <div class="containter" v-if="curDirectory !== 2">
      <Modal v-model="showModal" title="上传" @on-ok="dialogOk">
        <Alert show-icon
          >只能上传单个文件或文件夹，如果上传有误，请重新上传即可</Alert
        >

        <!-- <Select
          v-model="weeksNum"
          placeholder="请选择周数"
          style="width:200px;margin-bottom:10px;"
        >
          <Option
            v-for="item in weeksList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select> -->

        <Upload
          ref="upload"
          type="drag"
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
          v-for="(item, index) in selectList"
          :key="index"
          :defaultValue.sync="item['value']"
          :semesterTip="item['tip']"
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

    <Modal
      fullscreen
      title="完成在线作业"
      v-model="showModal2"
      @on-ok="handleOk"
      @on-cancel="handleCancel"
    >
      <WriteOnlineHomework />
    </Modal>
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import WriteOnlineHomework from "@stuHomework/smart/write-online-homework";
import myMixin from "@/view/global/mixin";

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice,
    WriteOnlineHomework
  },

  data() {
    return {
      curDirectory: 1, // 当前的目录
      showModal: false,
      showModal2: false,
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
          tip: "周数选择",
          value: "所有周数",
          list: this.getWeekList()
        },
        {
          tip: "完成状态",
          value: "所有状态",
          list: this.getFinishList()
        }
      ],
      columns1: [
        {
          title: "课程",
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
          title: "完成时间",
          key: "finishTime",
          sortable: true
        },
        {
          title: "状态",
          key: "status"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("完成作业", h, () => {
                const status = params["row"]["status"];
                if (status === "已完成") {
                  return this.$Message.info("你已完成作业");
                }
                this.showModal2 = true;
              })
            ]);
          }
        }
      ],
      data1: [
        {
          courseName: "新媒体实训",
          weeksNum: "第一周",
          experiment: "堂上构建简单服务器",
          finishTime: "2019-02-13",
          status: "未完成"
        },
        {
          courseName: "新媒体实训",
          weeksNum: "第二周",
          experiment: "构建简单服务器",
          finishTime: "2019-02-13",
          status: "未完成"
        },
        {
          courseName: "新媒体实训",
          weeksNum: "第三周",
          experiment: "堂上构建简单服务器",
          finishTime: "2019-02-13",
          status: "未完成"
        },
        {
          courseName: "新媒体实训",
          weeksNum: "第四周",
          experiment: "构建简单服务器",
          finishTime: "2019-02-13",
          status: "未完成"
        },
        {
          courseName: "新媒体实训",
          weeksNum: "第五周",
          experiment: "堂上构建简单服务器",
          finishTime: "2019-02-13",
          status: "未完成"
        },
        {
          courseName: "新媒体实训",
          weeksNum: "第六周",
          experiment: "构建简单服务器",
          finishTime: "2019-02-13",
          status: "未完成"
        }
      ]
    };
  },

  methods: {
    dialogOk() {
      console.log("上传");
    },

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
      box-sizing: border-box;
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
