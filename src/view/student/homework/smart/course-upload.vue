<template>
  <div class="containter">
    <Modal
      v-model="showModal"
      title="上传"
      @on-ok="dialogOk"
      @on-cancel="dialogCancel"
    >
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
    <Modal
      v-model="showDelmodal"
      width="360"
    >
      <p
        slot="header"
        style="text-align:center"
      >
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除?</p>
      </div>
      <div slot="footer">
        <Button
          type="primary"
          size="large"
          long
          :loading="modal_loading"
          @click="del"
        >删除</Button>
      </div>
    </Modal>
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
      showModal: false,
      showDelmodal: false,
      modal_loading: false,
      curDirectory: 1, // 当前的目录
      columns1: [
        {
          title: "目录",
          key: "directory"
        },
        {
          title: "文件数",
          key: "fileCount"
        },
        {
          title: "最迟上传时间",
          key: "endTime"
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
      data1: [
        {
          directory: "新媒体实训",
          fileCount: 3,
          endTime: "2018-9-18 11:00"
        },
        {
          directory: "JavaScript编程",
          fileCount: 3,
          endTime: "2018-9-18 11:00"
        },
        {
          directory: "新媒体概论",
          fileCount: 3,
          endTime: "2018-9-18 11:00"
        }
      ],
      columns2: [
        {
          title: "目录",
          key: "directory"
        },
        {
          title: "文件数",
          key: "fileCount"
        },
        {
          title: "最迟上传时间",
          key: "endTime"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("上传", h, () => {
                // TODO: 上传
                this.showModal = true;
              }),
              this.btnStyle("返回", h, () => (this.curDirectory = 1))
            ]);
          }
        }
      ],
      data2: [
        {
          directory: "第一周",
          fileCount: 3,
          endTime: "2018-9-18 11:00"
        },
        {
          directory: "第二周",
          fileCount: 3,
          endTime: "2018-9-18 11:00"
        },
        {
          directory: "第三周",
          fileCount: 3,
          endTime: "2018-9-18 11:00"
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
    },
    dialogOk() {
      this.$Message.info("Clicked ok");
    },
    dialogCancel() {
      this.$Message.info("Clicked cancel");
    },
    handleremove() {
      this.showDelmodal = true;
    },
    del() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.showDelmodal = false;
        this.$Message.success("Successfully delete");
      }, 2000);
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
}
</style>