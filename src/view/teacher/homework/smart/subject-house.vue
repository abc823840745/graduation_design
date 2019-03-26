<template>
  <div class="subject-warehouse">
    <div class="top_title mb-20">
      <h2 class="class_title">
        {{ courseInfo["name"] }}
        <span class="course-code">[{{ courseInfo["code"] }}]</span>
      </h2>

      <div class="return_btn">
        <Button type="primary" shape="circle" @click="openModal" icon="ios-add">
          添加题目</Button
        >

        <Button
          class="ml-10"
          type="primary"
          shape="circle"
          @click="headerGoBack"
          icon="md-arrow-back"
          >返回</Button
        >
      </div>
    </div>

    <Tabs v-model="subType" @on-click="tabsClick">
      <TabPane
        v-for="(item, index) in table"
        :key="index"
        :label="item['label']"
        :name="item['name']"
        class="df-fdc"
      >
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
          :data="item['data']"
        />
        <Page
          :total="item['total']"
          class="page"
          @on-change="item['changePage']"
        />
      </TabPane>

      <TabPane label="历史记录" name="历史记录" class="df-fdc">
        <Card
          shadow
          v-for="(item, index) in historyList"
          :key="index"
          class="mb-10"
        >
          <p slot="title">{{ item["operation"].slice(0, 4) }}</p>
          <p>
            <Time :time="item['time']" />,{{ item["teacher"]
            }}{{ item["operation"] }},题号为：{{ item["quest_id"] }}
          </p>
        </Card>

        <Page
          :total="historyTotal"
          class="page"
          @on-change="historyChnangePage"
        />
      </TabPane>
    </Tabs>

    <Modal fullscreen title="搜索" v-model="modalOpen">
      <SearchView
        :columns="columns"
        :tableData="searchTable"
        :total="searchCount"
        @search="getSearchResult"
        @changePage="changePage"
      />
      <div slot="footer">
        <Button type="primary" size="large" @click="searchClose">
          返回
        </Button>
      </div>
    </Modal>

    <Modal
      :title="type === 'create' ? '添加题库' : '查看详情或修改'"
      v-model="showSubHourse"
      :width="900"
    >
      <div class="modal-con df-fdc">
        <div class="df-aic mb-20" v-show="type === 'create'">
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
          :disabled="true"
          :index="index"
          :key="index"
        />
      </div>

      <div slot="footer">
        <Button type="primary" @click="closeModal">
          返回
        </Button>
        <Button
          type="primary"
          @click="type === 'create' ? createSub() : updateSub()"
        >
          {{ type === "create" ? "确认新建" : "确认修改" }}
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import myMixin from "@/view/global/mixin";
import SubjectType from "@/view/global/component/show-subject-different-types";
import { mapState, mapMutations, mapActions } from "vuex";
import SearchView from "@/view/global/component/search-view";

export default {
  mixins: [myMixin],

  props: {
    courseInfo: Object
  },

  components: {
    SubjectType,
    SearchView
  },

  watch: {
    async courseInfo(newVal, oldVal) {
      await this.getTableData(1);
    }
  },

  computed: {
    ...mapState({
      inputInfo: state => state.homework.inputInfo,
      userName: state => state.user.userName,
      teaId: state => state.user.stu_nmuber
    })
  },

  data() {
    return {
      type: "",
      total: 1,
      searchCount: 1,
      searchText: "",
      searchTable: [],
      searchPage: 1,
      modalOpen: false,
      loading: false,
      showSubHourse: false,
      subType: "单选题",
      selVal: "",
      subject: "",
      historyTotal: 1,
      historyList: [],
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
      columns: [
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
            let { id, type } = params.row;
            return h("div", [
              this.btnStyle("详情", h, () => {
                this.getDeatail(params.index);
              }),
              this.btnStyle(
                "删除",
                h,
                () => {
                  this.$Modal.confirm({
                    title: "确定要删除该任务？",
                    onOk: async () => {
                      await this.delSub(id, type);
                    }
                  });
                },
                "error"
              )
            ]);
          }
        }
      ],
      table: [
        {
          data: [],
          page: 1,
          label: "单选题",
          name: "单选题",
          total: 1,
          changePage: async page => {
            let table = this.table;
            table[0]["page"] = page;
            this.table = table;
            await this.getTableData(page);
          }
        },
        {
          data: [],
          page: 1,
          label: "多选题",
          name: "多选题",
          total: 1,
          changePage: async page => {
            let table = this.table;
            table[1]["page"] = page;
            this.table = table;
            await this.getTableData(page);
          }
        },
        {
          data: [],
          page: 1,
          label: "填空题",
          name: "填空题",
          total: 1,
          changePage: async page => {
            let table = this.table;
            table[2]["page"] = page;
            this.table = table;
            await this.getTableData(page);
          }
        },
        {
          data: [],
          page: 1,
          label: "问答题",
          name: "问答题",
          total: 1,
          changePage: async page => {
            let table = this.table;
            table[3]["page"] = page;
            this.table = table;
            await this.getTableData(page);
          }
        }
      ]
    };
  },

  methods: {
    ...mapActions([
      "createSubHouse",
      "getSubHouse",
      "delSubHouse",
      "updateSubHouse",
      "searchSubHouse",
      "subHouseHistory"
    ]),

    ...mapMutations(["setInputInfo"]),

    // 获取table列表数据
    async getTableData(page) {
      this.loading = true;
      let res = await this.getSubHouse({
        course: this.courseInfo["name"],
        category: "",
        type: this.subType,
        page: page || 1
      });
      let table = this.table;
      let num = this.getNum(this.subType);
      table[num]["data"] = res.data;
      table[num]["total"] = res.count;
      table[num]["page"] = page;
      this.table = table;
      this.loading = false;
    },

    // 获取题库修改历史记录
    async getSubHistory(page = 1) {
      let res = await this.subHouseHistory({
        course: this.courseInfo["name"],
        page
      });
      let data = res.data;
      data.forEach(item => {
        if (item["teacher"] === "-----") {
          item["teacher"] = "系统管理员";
        }
      });
      this.historyList = data;
      this.historyTotal = res.count;
    },

    // 题库修改历史记录分页
    async historyChnangePage(page) {
      await this.getSubHistory(page);
    },

    async tabsClick(name) {
      if (name === "历史记录") {
        return await this.getSubHistory(1);
      }
      let num = this.getNum(name);
      await this.getTableData(this.table[num]["page"]);
    },

    // modal 确定新建题目事件
    async createSub() {
      let arr = [];
      let { name } = this.courseInfo;
      let {
        subjectType,
        subject,
        optionList,
        choice,
        weighting
      } = this.inputInfo[0];
      if (subjectType !== "填空题") {
        arr = [
          {
            course: name,
            category: "",
            type: subjectType,
            context: subject,
            obj: {
              first_option: optionList[0]["option"],
              sec_option: optionList[1]["option"],
              third_option: optionList[2]["option"],
              fourth_option: optionList[3]["option"]
            },
            answer: Array.isArray(choice) ? choice.join() : choice,
            grade: weighting
          }
        ];
      } else {
        arr = subject.map(item => {
          return {
            course: name,
            category: "",
            type: subjectType,
            context: item["subject"],
            obj: {
              first_option: "",
              sec_option: "",
              third_option: "",
              fourth_option: ""
            },
            answer: item["referenceAnswer"],
            grade: weighting / subject.length
          };
        });
      }
      let res = await this.createSubHouse({
        teach_id: this.teaId,
        teacher: this.userName,
        arr
      });
      this.setInputInfo([]);
      this.closeModal();
      let num = this.getNum(subjectType);
      await this.getTableData(this.table[num]["page"]);
      this.$Notice.success({
        title: "新增成功！"
      });
    },

    // 更新题目
    async updateSub() {
      let { id } = this.subject;
      let {
        subjectType,
        choice,
        subject,
        optionList,
        weighting
      } = this.inputInfo[0];
      let answer = null;
      switch (subjectType) {
        case "填空题":
          answer = subject[0]["answer"];
          break;
        case "多选题":
          answer = choice.join();
          break;
        default:
          answer = choice;
          break;
      }
      let res = await this.updateSubHouse({
        teach_id: this.teaId,
        teacher: this.userName,
        id,
        course: this.courseInfo["name"],
        category: "",
        context: subjectType === "填空题" ? subject[0]["subject"] : subject,
        obj: {
          first_option: optionList[0]["option"] || "",
          sec_option: optionList[1]["option"] || "",
          third_option: optionList[2]["option"] || "",
          fourth_option: optionList[3]["option"] || ""
        },
        answer,
        grade: weighting
      });
      if (res["status"] === 1) {
        this.setInputInfo([]);
        this.closeModal();
        let num = this.getNum(subjectType);
        await this.getTableData(this.table[num]["page"]);
        return this.$Notice.success({
          title: "修改成功！"
        });
      }
      this.$Notice.error({
        title: "修改失败"
      });
    },

    // 删除题目
    async delSub(id, type) {
      let res = await this.delSubHouse({
        id,
        teach_id: this.teaId,
        teacher: this.userName
      });
      // if (res["status"] === 1) {
      let num = this.getNum(type);
      if (this.modalOpen === true) {
        await this.searchResult(this.searchText, this.searchPage);
      } else {
        await this.getTableData(this.table[num]["page"]);
      }
      return this.$Notice.success({ title: "删除成功！" });
      // }
      // this.$Notice.error({ title: "删除失败！" });
    },

    // 打开新增题目的modal
    openModal() {
      this.type = "create";
      this.selVal = "";
      this.setInputInfo([]);
      this.showSubHourse = true;
    },

    // 关闭modal
    closeModal() {
      this.showSubHourse = false;
    },

    // 切换题目
    selectChange(type) {
      this.setInputInfo([]);
      let inputInfo = this.inputInfo;
      let subject =
        type !== "填空题"
          ? ""
          : [
              {
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
        subject,
        subjectType: type,
        title: "",
        choice: type === "多选题" ? [] : "",
        optionList,
        weighting: 10
      });
      this.setInputInfo(inputInfo);
    },

    // 查看问题详情
    async getDeatail(index) {
      this.setInputInfo([]);
      this.openModal();
      this.type = "check";
      let num = this.getNum(this.subType);
      this.subject = this.table[num]["data"][index];
      this.setSubject();
    },

    setSubject() {
      let arr = [];
      let {
        type,
        answer,
        context,
        grade,
        first_option,
        sec_option,
        third_option,
        fourth_option
      } = this.subject;
      let optionList = [
        {
          label: "A",
          option: first_option
        },
        {
          label: "B",
          option: sec_option
        },
        {
          label: "C",
          option: third_option
        },
        {
          label: "D",
          option: fourth_option
        }
      ];
      if (type !== "填空题") {
        arr = [
          {
            subject: context,
            subjectType: type,
            title: "",
            choice: type === "多选题" ? answer.split(",") : answer,
            optionList,
            weighting: grade
          }
        ];
      } else {
        arr = [
          {
            subject: [
              {
                subject: context,
                referenceAnswer: answer
              }
            ],
            subjectType: type,
            title: "",
            choice: "",
            optionList: [],
            weighting: grade
          }
        ];
      }
      this.setInputInfo(arr);
    },

    // 返回课程页面
    headerGoBack() {
      this.$emit("backCourse");
    },

    // 搜索结果
    async searchResult(searchText, page = 1) {
      let res = await this.searchSubHouse({
        condition: searchText,
        course: this.courseInfo["name"],
        Category: "",
        type: this.subType,
        page
      });
      this.searchCount = res.count;
      this.searchTable = res.data;
    },

    // 获取搜索结果
    async getSearchResult(searchText) {
      this.searchText = searchText;
      await this.searchResult(searchText);
    },

    // 搜索表格分页
    async changePage(page) {
      this.searchPage = page;
      await this.searchResult(this.searchText, page);
    },

    searchOpen() {
      this.modalOpen = true;
    },

    searchClose() {
      this.modalOpen = false;
    },

    getNum(type) {
      let num = 0;
      switch (type) {
        case "单选题":
          num = 0;
          break;
        case "多选题":
          num = 1;
          break;
        case "填空题":
          num = 2;
          break;
        case "问答题":
          num = 3;
          break;
      }
      return num;
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

.top_title {
  // overflow: hidden;
  // padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: #fff;
  padding: 14px 20px;
  border-radius: 10px;
  color: #666;
  box-shadow: 2px 2px 2px #eee;
  .class_title {
    font-size: 18px;
    font-weight: 700;
    float: left;
    line-height: 32px;
    .course-code {
      font-weight: 500;
      color: #888;
      font-size: 14px;
    }
  }
  .return_btn {
    float: right;
  }
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
