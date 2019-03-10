<template>
  <div class="containter">
    <div class="containter">
      <div class="select-list">
        <MultipleChoice
          v-for="item in selectList"
          :key="item['tip']"
          :semesterTip="item['tip']"
          :defaultValue.sync="item['value']"
          :semesterList="item['list']"
          @onChange="item['onChange']"
          class="multiple-choice"
        />

        <Button
          type="primary"
          icon="ios-search"
          class="search-btn"
          @click="searchOpen"
          >Search</Button
        >
      </div>

      <Table
        border
        :loading="loading"
        class="table-con mar-top"
        :columns="columns"
        :data="tableInfo['tableData']"
      />
      <Page
        class="mar-top page"
        :total="tableInfo['count']"
        :page-size="10"
        @on-change="getTableData"
      />
    </div>

    <MyHomework
      type="update"
      :modalOpen.sync="modalOpen"
      :info="itemInfo"
      :courseId="courseId"
      @getTableData="getTableData"
    />

    <Modal fullscreen title="搜索" v-model="showModal" @on-ok="searchOk">
      <SearchView
        :columns="columns"
        :tableData="tableData"
        :total="searchCount"
        :searchLoading="searchLoading"
        @search="getSearchResult($event)"
        @changePage="changePage"
      />
    </Modal>
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import MyHomework from "@teaHomework/smart/my-homework";
import SearchView from "@/view/global/component/search-view";
import myMixin from "@/view/global/mixin";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice,
    MyHomework,
    SearchView
  },

  computed: {
    ...mapState({
      userName: state => state.user.userName,
      tableInfo: state => state.homework.taskCenterInfo,
      courseList: state => state.homework.courseList,
      teaId: state => state.user.stu_nmuber
    }),

    allCourseList() {
      return this.courseList.map(item => item.name);
    },

    selectCourse() {
      return value => {
        return this.allCourseList.filter(item => item === value);
      };
    }
  },

  data() {
    return {
      loading: true,
      modalOpen: false,
      showModal: false,
      curIndex: 0,
      courseId: 0,
      searchLoading: false,
      searchCount: 0,
      itemInfo: {},
      tableData: [],
      selectList: [
        {
          tip: "学期选择",
          value: this.getCurSchoolYear(),
          list: this.getSchoolYear(),
          onChange: this.changeYear
        },
        {
          tip: "课程选择",
          value: "所有课程",
          list: [
            {
              value: "所有课程",
              label: "所有课程"
            }
          ],
          onChange: this.changeCourse
        },
        {
          tip: "课时选择",
          value: "所有课时",
          list: [
            {
              value: "所有课时",
              label: "所有课时"
            }
          ],
          onChange: this.changeClassHour
        }
      ],
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
          title: "作业名称",
          key: "name"
        },
        {
          title: "作业类型",
          key: "classify",
          sortable: true,
          render: (h, params) => {
            if (params.row.type === "online") {
              return h("p", {}, "在线作业");
            }
            return h("p", {}, "课时作业");
          }
        },
        {
          title: "截止时间",
          key: "fintime",
          sortable: true
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            let { startime, course, id, type } = params.row;
            return h("div", [
              this.btnStyle("修改任务信息", h, async () => {
                let date = new Date();
                let stopDate = new Date(startime);
                if (date >= stopDate) {
                  return this.$Notice.warning({
                    title: "已经开始,无法修改"
                  });
                }
                this.modalOpen = true;
                this.itemInfo = this.tableInfo["tableData"][params.index];
                let getId = this.courseList.reduce((arr, item) => {
                  if (item["name"] === course) {
                    arr.push(item["id"]);
                  }
                  return arr;
                }, []);
                this.courseId = getId[0];
                await this.getSubjectData(id);
              }),
              this.btnStyle(
                "删除",
                h,
                () =>
                  this.$Modal.confirm({
                    title: "确定要删除该任务？",
                    onOk: () => {
                      if (type === "offline") {
                        return this.delClassHWInfo(params.index);
                      }
                      this.delOnlineHWInfo(params.index);
                    }
                  }),
                "error"
              )
            ]);
          }
        }
      ]
    };
  },

  async mounted() {
    await this.setCourseSelList();
    await this.getTableData();
  },

  methods: {
    ...mapActions([
      "delTeaClassHW",
      "delTeaOnlineHW",
      "getTeaHW",
      "getTeaOnlineHW",
      "getTeaSubject",
      "searchMyHW"
    ]),

    ...mapMutations(["setOriginInputInfo"]),

    // 获取表格信息
    async getTableData(page = 1) {
      this.loading = true;
      let semester = this.selectList[0]["value"];
      let course = this.selectList[1]["value"];
      let classHour = this.selectList[2]["value"];
      await this.getTeaHW({
        page,
        course:
          course === "所有课程"
            ? this.allCourseList
            : this.selectCourse(course),
        semester,
        classHour: classHour === "所有课时" ? undefined : classHour,
        teacher: this.userName
      });
      this.loading = false;
    },

    // 学年选择筛选
    async changeYear(value) {
      this.loading = true;
      this.resetSelList();
      let semester = value;
      let course = this.selectList[1]["value"];
      let classHour = this.selectList[2]["value"];
      await this.setCourseSelList(value);
      await this.getTeaHW({
        course:
          course === "所有课程"
            ? this.allCourseList
            : this.selectCourse(course),
        semester,
        classHour: classHour === "所有课时" ? undefined : classHour,
        teacher: this.userName
      });
      this.loading = false;
    },

    // 课程选择筛选
    async changeCourse(value) {
      this.loading = true;
      this.resetClassHour();
      let semester = this.selectList[0]["value"];
      let course = value;
      let classHour = this.selectList[2]["value"];
      let getId = this.courseList.reduce((arr, item) => {
        if (item["name"] === value) {
          arr.push(item["id"]);
        }
        return arr;
      }, []);
      await this.setClassHourSelList(getId[0]);
      await this.getTeaHW({
        course:
          course === "所有课程"
            ? this.allCourseList
            : this.selectCourse(course),
        semester,
        classHour: classHour === "所有课时" ? undefined : classHour,
        teacher: this.userName
      });
      this.loading = false;
    },

    // 课时选择筛选
    async changeClassHour(value) {
      this.loading = true;
      let semester = this.selectList[0]["value"];
      let course = this.selectList[1]["value"];
      let classHour = value;
      await this.getTeaHW({
        course:
          course === "所有课程"
            ? this.allCourseList
            : this.selectCourse(course),
        semester,
        classHour: classHour === "所有课时" ? undefined : classHour,
        teacher: this.userName
      });
      this.loading = false;
    },

    // 重置所有选项
    resetSelList() {
      let selectList = this.selectList;
      selectList[1]["value"] = "所有课程";
      selectList[1]["list"] = [
        {
          value: "所有课程",
          label: "所有课程"
        }
      ];
      selectList[2]["value"] = "所有课时";
      selectList[2]["list"] = [
        {
          value: "所有课时",
          label: "所有课时"
        }
      ];
      this.selectList = selectList;
    },

    // 重置所有课时
    resetClassHour() {
      let selectList = this.selectList;
      selectList[2]["value"] = "所有课时";
      selectList[2]["list"] = [
        {
          value: "所有课时",
          label: "所有课时"
        }
      ];
      this.selectList = selectList;
    },

    // 修改模式获取题目数据
    async getSubjectData(id) {
      if (this.itemInfo["classify"] === "在线作业") {
        let res = await this.getTeaSubject(id);
        let executeOnce = true;
        let data = res.data.data;
        let inputInfo = data.reduce((arr, item, index) => {
          let optionList = [
            {
              label: "A",
              option: item["first_option"]
            },
            {
              label: "B",
              option: item["sec_option"]
            },
            {
              label: "C",
              option: item["third_option"]
            },
            {
              label: "D",
              option: item["fourth_option"]
            }
          ];

          if (item["type"] !== "填空题") {
            arr.push({
              id: item["id"],
              subject: item["context"],
              subjectType: item["type"],
              title: `${index + 1}、${item["type"]}`,
              choice:
                item["type"] === "多选题"
                  ? item["answer"].split(",")
                  : item["answer"],
              optionList,
              weighting: item["grade"]
            });
          } else {
            if (executeOnce) {
              // 填空题只有一条大题，所以只执行一次
              executeOnce = false;
              let subjectLength = 0;
              let subject = data.reduce((arr, item) => {
                if (item["type"] === "填空题") {
                  // 记录填空题的题数
                  subjectLength += 1;
                  arr.push({
                    id: item["id"],
                    subject: item["context"],
                    answer: "",
                    referenceAnswer: item["answer"],
                    showCreSubjectBtn: true
                  });
                }
                return arr;
              }, []);
              arr.push({
                subject,
                subjectType: item["type"],
                title: `${index + 1}、${item["type"]}`,
                choice: item["answer"],
                optionList,
                weighting: item["grade"] * subjectLength
              });
            }
          }
          return arr;
        }, []);
        this.setOriginInputInfo(inputInfo);
      }
    },

    // 删除课时作业
    async delClassHWInfo(index) {
      let { id } = this.tableInfo["tableData"][index];
      let res = await this.delTeaClassHW(id);
      if (res["status"] === 1) {
        await this.getTableData();
        this.$Notice.success({
          title: "删除成功！"
        });
      }
    },

    // 删除在线作业
    async delOnlineHWInfo(index) {
      let { id } = this.tableInfo["tableData"][index];
      let res = await this.delTeaOnlineHW(id);
      if (res["status"] === 1) {
        await this.getTableData();
        this.$Notice.success({
          title: "删除成功！"
        });
      }
    },

    // 打开搜索页
    searchOpen() {
      this.showModal = true;
    },

    searchOk() {
      this.showModal = false;
    },

    // 获取搜索结果
    async getSearchResult(searchText, page = 1) {
      this.searchLoading = true;
      this.searchText = searchText;
      let res = await this.searchMyHW({
        page,
        condition: searchText,
        teach_id: this.teaId,
        teacher: this.userName
      });
      console.log(res);
      this.searchCount = res.count;
      this.tableData = res.data;
      this.searchLoading = false;
    },

    // 搜索表格分页
    async changePage(page) {
      await this.getSearchResult(this.searchText, page);
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

  .select-list {
    display: flex;
    align-self: flex-start;
    flex-wrap: wrap;
    width: 100%;

    .search-btn {
      height: 32px;
    }

    .multiple-choice {
      margin-bottom: 10px;
    }

    .multiple-choice /deep/ .select-list {
      margin-right: 30px;
    }

    .search-item {
      margin-top: -1px;
      width: 271px;
    }
  }

  .flex-start {
    align-self: flex-start;
  }

  .mar-top {
    margin-top: 20px;
  }

  .table-con {
    width: 100%;
  }

  .page {
    align-self: flex-end;
  }
}
</style>
