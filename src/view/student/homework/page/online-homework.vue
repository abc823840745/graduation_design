<template>
  <div class="containter">
    <div class="containter" v-if="curDirectory !== 2">
      <div class="select-con">
        <MultipleChoice
          v-for="(item, index) in selectList"
          :key="index"
          :defaultValue.sync="item['value']"
          :semesterTip="item['tip']"
          :semesterList="item['list']"
          @onChange="item['onChange']"
          class="multiple-choice"
        />
      </div>

      <Table
        border
        class="table-con mar-top"
        :loading="loading"
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

    <WriteOnlineHomework
      :stuHWInfo="stuHWInfo"
      :modalOpen.sync="showModal2"
      @endTimeDoing="endTimeDoing"
      @handleOk="handleOk"
      @handleCancel="handleCancel"
    />
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import WriteOnlineHomework from "@stuHomework/smart/write-online-homework";
import myMixin from "@/view/global/mixin";
import { getlocalStorage, getCurDate } from "@tools";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice,
    WriteOnlineHomework
  },

  computed: {
    ...mapState({
      userName: state => state.user.userName,
      stuId: state => state.user.stu_nmuber,
      inputInfo: state => state.homework.inputInfo,
      courseList: state => state.homework.courseList,
      tableInfo: state => state.homework.onlineHWInfo,
      remainTime: state => state.homework.remainTime
    })
  },

  data() {
    return {
      curDirectory: 1, // 当前的目录
      loading: true,
      stuHomeworkId: 0, // 学生作业id
      stuHWInfo: {}, // 学生在线作业item信息
      showModal: false,
      showModal2: false,
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
          title: "实验名称",
          key: "exper_name"
        },
        {
          title: "完成时间",
          key: "exper_fintime",
          sortable: true
        },
        {
          title: "完成状态",
          key: "status",
          sortable: true
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            let { exper_fintime, id, exper_id, status } = params.row;
            let curDate = new Date();
            let finDate = new Date(exper_fintime);
            if (curDate < finDate && status === "未完成") {
              return h("div", [
                this.btnStyle("完成作业", h, async () => {
                  this.showModal2 = true;
                  this.stuHomeworkId = id;
                  this.stuHWInfo = params.row;
                  await this.getSubjectList(exper_id);
                  await this.autoSubmit();
                })
              ]);
            }
            return h("div", [this.disableBtnStyle("完成作业", h)]);
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
      "getStuOnlineHW",
      "getStuOnlineSubject",
      "stuSubmitOnlineHW"
    ]),

    ...mapMutations(["setInputInfo"]),

    // 掉线下次再进来就自动提交题目
    async autoSubmit() {
      let inputInfo = getlocalStorage("inputInfo");
      // let seconds = getlocalStorage("remainTime");
      if (inputInfo) {
        this.setInputInfo(inputInfo);
        await this.submitOnlineHW(seconds, "未完成");
        this.$Notice.success({
          title: "检测到你中途离开考试，已为你恢复回答"
        });
      }
    },

    // 获取表格数据
    async getTableData(page = 1) {
      await this.getTableList("getStuOnlineHW", page);
    },

    // 选择学年
    async changeYear(value) {
      await this.yearChange("getStuOnlineHW", value);
    },

    // 课程选择
    async changeCourse(value) {
      await this.courseChange("getStuOnlineHW", value);
    },

    // 课时选择
    async changeClassHour(value) {
      await this.classHourChange("getStuOnlineHW", value);
    },

    // 获取在线作业题目信息
    async getSubjectList(id) {
      await this.getStuOnlineSubject(id);
    },

    // 提交作业
    async submitOnlineHW(seconds, status) {
      let questions = null;
      await Promise.all(
        this.inputInfo.map(async (item, index) => {
          let { choice, subjectType, subject, id } = item;
          if (subjectType !== "填空题") {
            questions = [
              {
                root_id: this.stuHomeworkId,
                quest_id: id,
                answer:
                  subjectType === "多选题" && choice ? choice.join() : choice
              }
            ];
          } else {
            questions = subject.map(item => {
              return {
                root_id: this.stuHomeworkId,
                quest_id: item["id"],
                answer: item["referenceAnswer"]
              };
            });
          }
          let res = await this.stuSubmitOnlineHW({
            id: this.stuHomeworkId,
            status,
            submit_time: getCurDate(),
            surplus_time: seconds,
            questions
          });
        })
      );
    },

    // 时间为 0 时的回调
    async endTimeDoing(seconds) {
      return;
      await this.submitOnlineHW(seconds, "已完成");
      this.curDirectory = 1;
      this.setInputInfo([]);
      this.showModal2 = false;
      this.$Notice.success({
        title: "没有剩余时间自动提交作业成功"
      });
    },

    // 点击 modal 确定按钮提交作业
    async handleOk(seconds) {
      await this.submitOnlineHW(seconds, "已完成");
      this.curDirectory = 1;
      this.setInputInfo([]);
      this.showModal2 = false;
      this.$Notice.success({
        title: "提交作业成功！"
      });
      localStorage.removeItem("inputInfo");
    },

    handleCancel() {
      this.curDirectory = 1;
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
    margin-top: 1.5%;
  }

  .table-con {
    width: 100%;
  }

  .page {
    align-self: flex-end;
  }

  .select-con {
    display: flex;
    align-self: flex-start;
    flex-wrap: wrap;
    width: 100%;

    .multiple-choice {
      margin-bottom: 10px;
      box-sizing: border-box;
    }

    .multiple-choice /deep/ .select-list {
      margin-right: 30px;
    }

    .search-item {
      margin-top: -1px;
      width: 271px;
    }
  }
}
</style>
