<template>
  <div class="containter">
    <div
      class="containter"
      v-if="curDirectory!==3"
    >
      <div class="select-con">
        <multiple-choice
          v-for="(item,index) in selectList"
          :key="index"
          :defaultValue="item['defaultValue']"
          :semesterTip="item['semesterTip']"
          :semesterList="item['semesterList']"
        />
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

    <write-online-homework
      v-if="curDirectory===3"
      @goBack="goBack"
    />

  </div>
</template>

<script>
import writeOnlineHomework from "@stuHomework/smart/write-online-homework.vue";
import multipleChoice from "@teaHomework/smart/multiple-choice";

export default {
  name: "course-detail",
  data() {
    return {
      curDirectory: 1, // 当前的目录
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
          title: "序号",
          key: "serial"
        },
        {
          title: "所属课程",
          key: "interCourse"
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
            return h("div", [
              this.btnStyle("完成在线作业", h, () => {
                const status = params.row.status;
                if (status === "已完成") {
                  return this.$Message.info("你已完成在线作业");
                }
                this.curDirectory = 3;
              })
            ]);
          }
        }
      ],
      data1: [
        {
          serial: 1,
          interCourse: "新媒体实训",
          experiment: "构建简单服务器",
          finishTime: "10分钟",
          status: "已完成"
        },
        {
          serial: 2,
          interCourse: "新媒体实训",
          experiment: "构建简单服务器",
          finishTime: "10分钟",
          status: "未完成"
        },
        {
          serial: 3,
          interCourse: "新媒体实训",
          experiment: "构建简单服务器",
          finishTime: "10分钟",
          status: "已完成"
        }
      ]
    };
  },
  components: {
    writeOnlineHomework,
    multipleChoice
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
      }
      return val;
    },
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