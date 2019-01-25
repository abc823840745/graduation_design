<template>
  <div class="containter">
    <multiple-choice
      semesterTip='学期选择'
      :defaultValue='semester'
      :semesterList='semesterList'
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
</template>

<script>
import multipleChoice from "../smart/multiple-choice";

export default {
  name: "other",
  data() {
    return {
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
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("查看", h, () => this.$emit("goCreSub"))
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
      ]
    };
  },
  components: {
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
    }
  }
};
</script>

<style lang="less" scoped>
.containter {
  width: 100%;
  height: auto;
  .mar-top {
    margin-top: 20px;
  }
  .table-con {
    width: 100%;
  }
  .content {
    margin-top: 20px;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    justify-content: center;
  }
  .course-name {
    width: 20%;
    height: 120px;
    display: flex;
    background: gainsboro;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 20px;
    border-radius: 10px;
    margin-right: 50px;
    margin-bottom: 20px;
  }
  .course-name:nth-child(4n) {
    margin-right: 0;
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
  }
}
</style>