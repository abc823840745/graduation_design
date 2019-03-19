<template>
  <div class="subject-warehouse">
    <div class="search-bar df mb-20">
      <Button
        type="primary"
        shape="circle"
        @click="searchOpen"
        icon="ios-search"
      >
        搜索</Button
      >
    </div>

    <Table
      class="mb-10 w100"
      border
      :loading="loading"
      :columns="columns"
      :data="tableData"
    />

    <Page :total="total" class="page" @on-change="changePage" />

    <Modal fullscreen title="搜索" v-model="modalOpen">
      <SearchView
        :columns="columns"
        :tableData="searchTable"
        :total="searchCount"
        @search="getSearchResult"
        @changePage="searchChangePage"
      />
      <div slot="footer">
        <Button type="primary" size="large" @click="searchClose">
          返回
        </Button>
      </div>
    </Modal>

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
import optionRow from "@teaHomework/smart/option-expand";
import answerRow from "@teaHomework/smart/answer-expand";
import myMixin from "@/view/global/mixin";
import SearchView from "@/view/global/component/search-view";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  mixins: [myMixin],

  props: {
    subType: String,
    type: String
  },

  components: {
    optionRow,
    answerRow,
    SearchView
  },

  watch: {
    async subType(newVal, oldVal) {
      await this.getTableData(1);
    }
  },

  computed: {
    ...mapState({
      curCourse: state => state.homework.curCourse,
      inputInfo: state => state.homework.inputInfo,
      optionList: state => state.homework.optionList,
      originalInfo: state => state.homework.originalInfo
    })
  },

  data() {
    return {
      total: 1,
      searchText: "",
      loading: false,
      modalOpen: false,
      searchCount: 1,
      searchText: "",
      searchTable: [],
      tableData: [],
      columns: [
        {
          title: "...",
          type: "expand",
          width: 50,
          render: (h, params) => {
            if (this.subType === "单选题" || this.subType === "多选题") {
              return h(optionRow, {
                props: {
                  row: params.row
                }
              });
            }
            if (this.subType === "填空题" || this.subType === "问答题") {
              return h(answerRow, {
                props: {
                  row: params.row
                }
              });
            }
          }
        },
        {
          title: "题号",
          key: "id",
          maxWidth: 70,
          align: "center",
          className: "demo-table-info-column"
        },
        {
          title: "题目",
          key: "context",
          ellipsis: true
        },
        {
          title: "操作",
          key: "option",
          maxWidth: 150,
          align: "center",
          render: (h, params) => {
            let { id } = params.row;
            return h("div", [
              this.btnStyle("选择", h, () => {
                this.selectSubject(params.row);
              })
            ]);
          }
        }
      ],
      selList: [
        {
          value: "单选题",
          label: "单选题"
        },
        {
          value: "多选题",
          label: "多选题"
        },
        {
          value: "填空题",
          label: "填空题"
        },
        {
          value: "问答题",
          label: "问答题"
        }
      ]
    };
  },

  methods: {
    ...mapActions(["getSubHouse", "searchSubHouse"]),

    ...mapMutations(["setInputInfo", "setOptionList"]),

    // 搜索结果
    async searchResult(searchText, page = 1) {
      this.searchText = searchText;
      let res = await this.searchSubHouse({
        condition: searchText,
        course: this.curCourse,
        Category: "",
        type: this.subType,
        page
      });
      this.searchCount = res.count;
      this.searchTable = res.data;
    },

    // 获取搜索结果
    async getSearchResult(searchText) {
      await this.searchResult(searchText);
    },

    // 搜索表格分页
    async searchChangePage(page) {
      await this.searchResult(this.searchText, page);
    },

    // 获取分页数据
    async changePage(page) {
      await this.getTableData(page);
    },

    // 获取table列表数据
    async getTableData(page) {
      this.loading = true;
      let res = await this.getSubHouse({
        course: this.curCourse,
        category: "",
        type: this.subType,
        page: page || 1
      });
      this.tableData = res.data;
      this.total = res.count;
      this.loading = false;
    },

    // 选择题目
    selectSubject(item) {
      let {
        type,
        context,
        grade,
        answer,
        first_option,
        sec_option,
        third_option,
        fourth_option
      } = item;
      let inputInfo = this.inputInfo;
      let key = Math.round(new Date().getTime() / 1000).toString();
      let optionList = [
        { label: "A", option: first_option },
        { label: "B", option: sec_option },
        { label: "C", option: third_option },
        { label: "D", option: fourth_option }
      ];
      if (type !== "填空题") {
        inputInfo.push({
          key,
          subject: context,
          subjectType: type,
          title: `${inputInfo.length + 1}、${type}`,
          choice: type === "多选题" ? answer.split(",") : answer,
          optionList,
          weighting: grade,
          status: "old"
        });
      } else {
        let fillSub = this.inputInfo.filter(
          item => item["subjectType"] === "填空题"
        );

        let fillIndex = this.inputInfo.findIndex(
          item => item["subjectType"] === "填空题"
        );

        // 判断填空题是否存在
        if (fillSub["length"] > 0) {
          inputInfo[fillIndex]["subject"].push({
            key,
            subject: context,
            answer: "",
            referenceAnswer: answer,
            showCreSubjectBtn: true,
            status: "old"
          });
        }
        if (fillSub["length"] === 0) {
          inputInfo.push({
            key: "",
            subject: [
              {
                key,
                subject: context,
                answer: "",
                referenceAnswer: answer,
                showCreSubjectBtn: true,
                status: "old"
              }
            ],
            subjectType: type,
            title: `${inputInfo.length + 1}、${type}`,
            choice: answer,
            optionList: [],
            weighting: grade,
            status: "old"
          });
        }
      }
      this.setInputInfo(inputInfo);
      this.searchClose();
      this.$emit("closeModal");

      // 编辑状态存一个题目索引用来记录题目修改情况
      if (this.type !== "create") {
        let optionList = this.optionList;
        optionList.push({
          key,
          subjectType: type,
          type: "add"
        });
        let filterData = this.reduceData(optionList);
        this.setOptionList(filterData);
      }
    },

    searchOpen() {
      this.modalOpen = true;
    },

    searchClose() {
      this.modalOpen = false;
    },

    // 筛选需要update的题目，并对concat后的数组对象进行去重
    reduceData(optionList) {
      let list = optionList;
      let newArr = this.originalInfo.reduce((arr, item, index) => {
        if (!list[index] || item["id"] !== list[index]["key"]) {
          arr.push({
            type: "update",
            subjectType: item["type"],
            key: item["id"]
          });
        }
        return arr;
      }, []);
      list = list.concat(newArr);
      let obj = {};
      let filterData = list.reduce((arr, item) => {
        if (!obj[item["key"]]) {
          obj[item["key"]] = true;
          arr.push({
            key: item["key"],
            subjectType: item["subjectType"],
            type: item["type"]
          });
        }
        return arr;
      }, []);
      return filterData;
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
