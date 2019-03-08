<template>
  <div class="search-con">
    <Input
      class="mb-30"
      search
      enter-button
      placeholder="请输入搜索内容"
      v-model="searchText"
      @on-search="getSearchResult"
    />

    <Table class="mb-10 w100" border :columns="columns" :data="tabledata" />

    <Page :total="30" class="page" @on-change="changePage" />

    <Modal fullscreen v-model="showModal">
      <p slot="header" style="text-align:center">
        在线作业：堂上构建简单服务器
      </p>
      <HomeworkDetail />
    </Modal>
  </div>
</template>

<script>
import HomeworkDetail from "@stuHomework/smart/check-online-homework-detail";
import { mapActions, mapState } from "vuex";
import myMixin from "@/view/global/mixin";

export default {
  mixins: [myMixin],

  components: {
    HomeworkDetail
  },

  computed: {
    ...mapState({
      userName: state => state.user.userName,
      stuId: state => state.user.stu_nmuber
    })
  },

  data() {
    return {
      searchText: "",
      showModal: false,
      columns: [
        {
          title: "课程名称",
          key: "course"
        },
        {
          title: "课时",
          key: "week"
        },
        {
          title: "实验名称",
          key: "exper_name"
        },
        {
          title: "作业类型",
          key: "type"
        },
        {
          title: "完成状态",
          key: "status"
        },
        {
          title: "评分",
          key: "grade"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            let { classify, status } = params.row;
            if (classify === "在线作业") {
              if (status === "已完成") {
                return h("div", [
                  this.btnStyle("查看", h, () => {
                    this.showModal = true;
                    let { id, exper_id } = params.row;
                    this.getSubjectList(id, exper_id);
                  })
                ]);
              }
              return h("div", [this.disableBtnStyle("查看", h)]);
            } else {
              if (status === "已完成") {
                return h("div", [
                  this.btnStyle("下载", h, () => {
                    window.open(params.row.webpath);
                  })
                ]);
              }
              return h("div", [this.disableBtnStyle("下载", h)]);
            }
          }
        }
      ],
      tabledata: []
    };
  },

  methods: {
    ...mapActions(["searchMyHWlist"]),

    // 获取搜索结果
    async getSearchResult(page = 1) {
      let res = await this.searchMyHWlist({
        page,
        condition: this.searchText,
        stuId: this.stuId,
        student: this.userName
      });
      this.tabledata = res;
    },

    // 获取分页数据
    async changePage(page) {
      await this.getSearchResult(page);
    },

    // 获取在线作业题目
    async getSubjectList(id, exper_id) {
      await this.getStuScoreSubject({
        id,
        exper_id
      });
    }

    // handleOk() {
    //   this.curDirectory = 1;
    // },

    // handleCancel() {
    //   this.curDirectory = 1;
    // }
  }
};
</script>

<style lang='less' scoped>
@import "../public.less";
.search-con {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;

  .page {
    align-self: flex-end;
  }
}
</style>
