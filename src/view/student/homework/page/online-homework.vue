<template>
  <div class="containter">

    <div
      class="containter"
      v-if="curDirectory !== 2"
    >

      <Modal
        v-model="showModal"
        title="上传"
        @on-ok="dialogOk"
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
          :defaultValue.sync="item['semester']"
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

    <WriteOnlineHomework
      v-show="curDirectory===2"
      @goBack="goBack"
    />
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import WriteOnlineHomework from "@stuHomework/smart/write-online-homework";
import myMixin from "@stuHomework/mixin";

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
        },
        {
          semesterTip: "周数选择",
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
          semesterTip: "完成状态",
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
                this.curDirectory = 2;
              })
            ]);
          }
        }
      ],
      data1: [
        {
          weeksNum: "第一周",
          experiment: "堂上构建简单服务器",
          finishTime: "2019-02-13",
          status: "未完成"
        },
        {
          weeksNum: "第二周",
          experiment: "构建简单服务器",
          finishTime: "2019-02-13",
          status: "未完成"
        },
        {
          weeksNum: "第三周",
          experiment: "堂上构建简单服务器",
          finishTime: "2019-02-13",
          status: "未完成"
        },
        {
          weeksNum: "第四周",
          experiment: "构建简单服务器",
          finishTime: "2019-02-13",
          status: "未完成"
        },
        {
          weeksNum: "第五周",
          experiment: "堂上构建简单服务器",
          finishTime: "2019-02-13",
          status: "未完成"
        },
        {
          weeksNum: "第六周",
          experiment: "构建简单服务器",
          finishTime: "2019-02-13",
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
      console.log("上传");
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
      width: 262px;
    }
  }
}
</style>