<template>
  <div class="subject-warehouse">
    <div class="search-bar df mb-20">
      <Input
        class="search-item"
        search
        enter-button
        placeholder="请输入搜索内容"
        v-model="searchText"
        @on-search="getSearchResult"
      />
      <Button
        type="primary"
        class="add-sub-btn ml-10"
        icon="ios-add"
        @click="addSub"
        >添加题目</Button
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

    <Modal title="添加题库" v-model="showSubHourse" fullscreen>
      <!-- <div class="modal-con df-fdc">
        <div class="df-aic mb-20">
          <h3>题目类型：</h3>
          <Input placeholder="输入内容" clearable style="width: 250px" />
        </div>
      </div> -->

      <div class="modal-con df-fdc">
        <div class="df-aic mb-20">
          <h3>题目类型：</h3>
          <Select
            v-model="selVal"
            style="width:200px"
            @on-change="selectChange"
          >
            <Option
              v-for="item in selList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </div>
        <SubjectType
          class="mb-30"
          v-for="(item, index) in inputInfo"
          type="create"
          @delFillSubject="delFillSubject($event, index)"
          :index="index"
          :key="index"
        />
      </div>
    </Modal>
  </div>
</template>

<script>
import myMixin from "@/view/global/mixin";
import SubjectType from "@/view/global/component/show-subject-different-types";
import { mapState, mapMutations } from "vuex";

export default {
  mixins: [myMixin],

  props: {
    subType: String
  },

  components: {
    SubjectType
  },

  computed: {
    ...mapState({
      inputInfo: state => state.homework.inputInfo
    })
  },

  data() {
    return {
      total: 1,
      searchText: "",
      loading: false,
      showSubHourse: false,
      columns: [
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
          ellipsis: true
        },
        {
          title: "操作",
          key: "option",
          maxWidth: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("详情", h, () => {
                this.showSubHourse = true;
              }),
              this.btnStyle("删除", h, () => {}, "error")
            ]);
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
      ],
      selVal: ""
    };
  },

  methods: {
    ...mapMutations(["setInputInfo"]),

    // 获取搜索结果
    async getSearchResult() {
      this.$emit("search", this.searchText);
    },

    // 获取分页数据
    async changePage(page) {
      this.$emit("changePage", page);
    },

    addSub() {
      this.showSubHourse = true;
    },

    // 新建题目
    selectChange(type) {
      this.setInputInfo([]);
      let index = 0;
      let inputInfo = this.inputInfo;
      let key = Math.round(new Date().getTime() / 1000).toString();
      let subject =
        type !== "填空题"
          ? ""
          : [
              {
                key,
                subject: "",
                answer: "",
                referenceAnswer: "",
                showCreSubjectBtn: true
              }
            ];
      let optionList = [
        {
          option: ""
        },
        {
          option: ""
        },
        {
          option: ""
        },
        {
          option: ""
        }
      ];
      inputInfo.push({
        key: type === "填空题" ? "" : key,
        subject,
        subjectType: type,
        title: "",
        choice: type === "多选题" ? [] : "",
        optionList,
        weighting: 10
      });
      this.setInputInfo(inputInfo);
    },

    // 删除填空题小题
    delFillSubject(fillindex, index) {
      if (fillindex === 0) {
        return this.$Notice.warning({
          title: "最后一题无法删除！"
        });
      }
      let inputInfo = this.inputInfo;
      inputInfo[index]["subject"].splice(fillindex, 1);
      let subjectListLength = inputInfo[index]["subject"].length;

      // 删除的是最后一个才显示前一个的删除按钮
      if (fillindex - 1 >= 0 && subjectListLength === fillindex) {
        inputInfo[index]["subject"][fillindex - 1]["showCreSubjectBtn"] = true;
      }

      this.setInputInfo(inputInfo);
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
}

.page {
  align-self: flex-end;
}

.add-sub-btn {
  margin-top: 1px;
}

.search-bar {
  width: 100%;

  .search-item {
    width: 40%;
  }
}

.modal-con {
  width: 100%;
}

.ivu-table td.demo-table-info-column {
  width: 1%;
}
</style>
