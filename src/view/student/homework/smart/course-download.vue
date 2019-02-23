<template>
  <div class="containter">
    <Table
      border
      class="table-con mar-top"
      :columns="showTable('columns',3)"
      :data="showTable('data',3)"
    />
    <Page
      :total="30"
      class="mar-top"
    />
    <Button
      class="all-download-btn"
      v-if="curDirectory === 3"
      icon="ios-download-outline"
      type="primary"
    >
      全部下载
    </Button>
  </div>
</template>

<script>
import myMixin from "@/view/global/mixin";

export default {
  name: "course-detail",

  mixins: [myMixin],

  data() {
    return {
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
          title: "创建时间",
          key: "createTime"
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
          title: "目录",
          key: "directory"
        },
        {
          title: "文件数",
          key: "fileCount"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("查看", h, () => (this.curDirectory = 3)),
              this.btnStyle("返回", h, () => (this.curDirectory = 1))
            ]);
          }
        }
      ],
      columns3: [
        {
          title: "目录",
          key: "directory"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("下载", h, () => {
                // TODO: 下载
                alert("下载");
              }),
              this.btnStyle("返回", h, () => (this.curDirectory = 2))
            ]);
          }
        }
      ],
      data1: [
        {
          directory: "新媒体实训",
          fileCount: 3,
          createTime: "2018-9-18"
        },
        {
          directory: "JavaScript编程",
          fileCount: 3,
          createTime: "2018-9-18"
        },
        {
          directory: "新媒体概论",
          fileCount: 3,
          createTime: "2018-9-18"
        }
      ],
      data2: [
        {
          directory: "第一周",
          fileCount: 3,
          createTime: "2018-9-18"
        },
        {
          directory: "第二周",
          fileCount: 3,
          createTime: "2018-9-18"
        },
        {
          directory: "第三周",
          fileCount: 3,
          createTime: "2018-9-18"
        }
      ],
      data3: [
        {
          directory: "实验指导书1",
          createTime: "2018-9-18"
        },
        {
          directory: "实验指导书2",
          createTime: "2018-9-18"
        },
        {
          directory: "实验指导书3",
          createTime: "2018-9-18"
        }
      ]
    };
  },

  methods: {}
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
  .all-download-btn {
    margin-top: 1.5%;
  }
}
</style>