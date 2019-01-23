<template>
  <div class="containter">
    <div
      class="containter"
      v-if="curDirectory!==3"
    >
      <div class="select-con">
        <div
          v-if="curDirectory===1"
          class="select-list-con"
        >
          <p class="select-title">学期选择:</p>
          <Select
            v-model="semester"
            class="select-list"
          >
            <Option
              v-for="item in semesterList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div>

        <div
          v-if="curDirectory===2"
          class="select-list-con"
        >
          <p class="select-title">提交情况:</p>
          <Select
            v-model="finishCondition"
            class="select-list"
          >
            <Option
              v-for="item in finishList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div>

        <div
          v-if="curDirectory===2"
          class="select-list-con"
        >
          <p class="select-title">作业类型:</p>
          <Select
            v-model="hwClassify"
            class="select-list"
          >
            <Option
              v-for="item in hwClassifyList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div>
      </div>

      <Table
        stripe
        class="table-con mar-top"
        :columns="showTable('columns')"
        :data="showTable('data')"
      />
      <Page
        :total="30"
        class="mar-top"
      />
    </div>

    <homework-detail
      v-if="curDirectory===3"
      :goback='goback'
    />
  </div>
</template>

<script>
import homeworkDetail from "../smart/check-online-homework-detail.vue";
export default {
  name: "my-homework",
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
            return h("div", [
              this.btnStyle("查看", h, () => (this.curDirectory = 2))
            ]);
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
          title: "提交情况",
          key: "submission"
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
                this.btnStyle("返回", h, () => (this.curDirectory = 1))
              ]);
            }
            return h("div", [
              this.btnStyle("下载", h, () => {
                this.$Message.info("下载中");
              }),
              this.btnStyle("返回", h, () => (this.curDirectory = 1))
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
          submission: "已完成",
          score: "100"
        },
        {
          homeworkName: "实验2",
          homeworkClassify: "课时作业",
          stopTime: "2018-9-14",
          submission: "已完成",
          score: "100"
        }
      ],
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
      finishCondition: "",
      finishList: [
        {
          value: "已完成",
          label: "已完成"
        },
        {
          value: "未完成",
          label: "未完成"
        }
      ],
      hwClassify: "",
      hwClassifyList: [
        {
          value: "课时作业",
          label: "课时作业"
        },
        {
          value: "在线作业",
          label: "在线作业"
        }
      ]
    };
  },
  components: {
    homeworkDetail
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
    showTable(name) {
      let val = null;
      switch (this.curDirectory) {
        case 1:
          val = this[`${name}1`];
          break;
        case 2:
          val = this[`${name}2`];
          break;
      }
      return val;
    },
    goback() {
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
