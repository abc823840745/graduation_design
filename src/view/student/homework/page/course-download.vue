<template>
  <div class="containter">
    <CourseSelect
      v-show="isSelectCourse"
      @goNext='goNext'
    />

    <div
      class="containter"
      v-show="!isSelectCourse"
    >
      <Table
        border
        class="table-con mar-top"
        :columns="showTable('columns',2)"
        :data="showTable('data',2)"
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
  </div>
</template>

<script>
import CourseSelect from "@teaHomework/smart/course-select";
import myMixin from "@/view/global/mixin";

export default {
  name: "course-detail",

  mixins: [myMixin],

  components: {
    CourseSelect
  },

  data() {
    return {
      isSelectCourse: true,
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
              this.btnStyle("查看", h, () => (this.curDirectory = 2)),
              this.btnStyle("返回", h, () => {
                this.curDirectory = 1;
                this.isSelectCourse = true;
              })
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
              this.btnStyle("返回", h, () => (this.curDirectory = 1))
            ]);
          }
        }
      ],
      data1: [
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
      data2: [
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

  methods: {
    goNext() {
      this.isSelectCourse = false;
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

  .all-download-btn {
    margin-top: 1.5%;
  }
}
</style>
