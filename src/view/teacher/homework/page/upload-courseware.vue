<template>
  <div class="containter">
    <div class="containter">
      <multiple-choice
        semesterTip='学期选择'
        :defaultValue='semester'
        :semesterList='semesterList'
        class="flex-start"
      />

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

    <Modal
      v-model="showModal"
      title="上传"
      @on-ok="dialogOk"
      @on-cancel="dialogCancel"
    >
      <Alert show-icon>可同时选择上传多个文件，上传有误，请到查看已上传文件中删除</Alert>

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
        multiple
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

  </div>
</template>

<script>
import multipleChoice from "@teaHomework/smart/multiple-choice";

export default {
  name: "other",
  data() {
    return {
      showModal: false,
      isShowUploaded: false,
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
              this.btnStyle("上传", h, () => (this.showModal = true)),
              this.btnStyle(
                "查看已上传文件",
                h,
                () => (this.isShowUploaded = true)
              )
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
      columns2: [
        {
          title: "文件名",
          key: "filesName"
        },
        {
          title: "上传时间",
          key: "uploadTime"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("删除", h, () => {
                // TODO: 删除上传的文件
              }),
              this.btnStyle("返回", h, () => (this.isShowUploaded = false))
            ]);
          }
        }
      ],
      data2: [
        {
          filesName: "实验指导书1",
          uploadTime: "2019-01-21"
        },
        {
          filesName: "实验指导书2",
          uploadTime: "2019-01-21"
        },
        {
          filesName: "实验指导书3",
          uploadTime: "2019-01-21"
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
    },
    showTable(data) {
      if (!this.isShowUploaded) return this[`${data}1`];
      return this[`${data}2`];
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

<style lang="less" scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .flex-start {
    align-self: flex-start;
  }
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
