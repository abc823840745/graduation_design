<template>
  <div class="subject-warehouse">
    <div class="search-bar df">
      <Input
        class="mb-20 search-item"
        search
        enter-button
        placeholder="请输入搜索内容"
        v-model="searchText"
        @on-search="getSearchResult"
      />
    </div>

    <Table
      class="mb-10 w100"
      border
      :loading="loading"
      :columns="columns"
      :data="tableData"
    />

    <Page :total="total" class="page" @on-change="changePage" />

    <Modal title="添加题库">
      <div class="modal-con df-fdc">
        <div class="df-aic mb-20">
          <h3>作业名称：</h3>
          <Input placeholder="输入内容" clearable style="width: 250px" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import expandRow from "@teaHomework/smart/table-expand";
import myMixin from "@/view/global/mixin";

export default {
  mixins: [myMixin],

  props: {
    subType: String
  },

  components: {
    expandRow
  },

  data() {
    return {
      total: 1,
      searchText: "",
      loading: false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "...",
          type: "expand",
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            });
          }
        },
        {
          title: "题号",
          key: "subNum",
          maxWidth: 70,
          align: "center",
          className: "demo-table-info-column"
        },
        {
          title: "题目",
          key: "subject",
          tooltip: true
        },
        {
          title: "操作",
          key: "option",
          maxWidth: 75,
          align: "center",
          render: (h, params) => {
            return h("div", [this.btnStyle("选择", h, () => {})]);
          }
        }
      ],
      tableData: [
        {
          subNum: 1,
          subject:
            "nodejs怎么发请求哈哈哈哈哈哈哈哈哈哈和和和和和和和哈哈和和和和和和和和和",
          optionA: "选项一",
          optionB: "选项二",
          optionC: "选项三",
          optionD: "选项四",
          referenceAnswer: "C"
        }
      ]
    };
  },

  methods: {
    // 获取搜索结果
    async getSearchResult() {
      this.$emit("search", this.searchText);
    },

    // 获取分页数据
    async changePage(page) {
      this.$emit("changePage", page);
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../../global/public.less";

.subject-warehouse {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;

  .page {
    align-self: flex-end;
  }
}

.search-bar {
  width: 100%;

  .search-item {
    width: 30%;
  }
}

.modal-con {
  width: 100%;
}

.ivu-table td.demo-table-info-column {
  width: 1%;
}
</style>
