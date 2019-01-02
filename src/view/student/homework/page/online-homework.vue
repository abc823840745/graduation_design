<template>
  <div class="containter">
    <div class="select-con">
      <div class="select-list-con">
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

      <div class="select-list-con">
        <p class="select-title">课程:</p>
        <Select
          v-model="curCourse"
          class="select-list"
        >
          <Option
            v-for="item in curCourseList"
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
</template>

<script>
export default {
  name: "course-detail",
  data() {
    return {
      curDirectory: 1, // 当前的目录
      semester: "2016-2017第一学期",
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
      curCourse: "所有课程",
      curCourseList: [
        {
          value: "所有课程",
          label: "所有课程"
        },
        {
          value: "新媒体实训",
          label: "新媒体实训"
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
                this.$router.push({
                  name: "student-write-online-homework"
                });
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