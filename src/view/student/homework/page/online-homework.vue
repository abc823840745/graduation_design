<template>
  <div class="containter">
    <div class="containter" v-if="curDirectory !== 2">
      <Modal v-model="showModal" title="上传" @on-ok="dialogOk">
        <Alert show-icon
          >只能上传单个文件或文件夹，如果上传有误，请重新上传即可</Alert
        >

        <Upload
          ref="upload"
          type="drag"
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

        <Input
          class="search-item"
          search
          enter-button
          placeholder="请输入关键词"
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
      :modalOpen.sync="showModal2"
      @handleOk="handleOk"
      @handleCancel="handleCancel"
    />
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import WriteOnlineHomework from "@stuHomework/smart/write-online-homework";
import myMixin from "@/view/global/mixin";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice,
    WriteOnlineHomework
  },

  computed: {
    getAllCourse() {
      return [
        {
          course: "新媒体综合实训",
          stuclass: "ATM",
          teacher: "程亮"
        },
        {
          course: "就业与创业指导",
          stuclass: "ATM",
          teacher: "程亮"
        }
      ];
    },

    ...mapState({
      userName: state => state.user.userName,
      stuId: state => state.user.stu_nmuber,
      inputInfo: state => state.homework.inputInfo,
      tableInfo: state => state.homework.onlineHWInfo
    })
  },

  data() {
    return {
      curDirectory: 1, // 当前的目录
      loading: true,
      stuHomeworkId: 0, // 学生作业id
      teaHomeworkId: 0, // 老师作业id
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
          list: this.getCourseList(),
          onChange: this.changeCourse
        },
        {
          tip: "课时选择",
          value: "所有课时",
          list: this.getClassHourList(),
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
            let { exper_fintime, id, exper_id } = params.row;
            let curDate = new Date();
            let finDate = new Date(exper_fintime);
            if (curDate < finDate) {
              return h("div", [
                this.btnStyle("完成作业", h, async () => {
                  this.showModal2 = true;
                  this.stuHomeworkId = id;
                  await this.getSubjectList(exper_id);
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
    await this.getTableData(this.tableInfo["page"]);
  },

  methods: {
    ...mapActions([
      "getStuOnlineHW",
      "getStuOnlineSubject",
      "stuSubmitOnlineHW"
    ]),

    ...mapMutations(["setInputInfo"]),

    async getTableData(page) {
      this.loading = true;
      await this.getStuOnlineHW({
        page,
        obj:
          this.selectList[1]["value"] === "所有课程"
            ? this.getAllCourse
            : [
                {
                  course: this.selectList[1]["value"],
                  stuclass: "ATM",
                  teacher: "程亮"
                }
              ],
        semester: this.selectList[0]["value"],
        classHour:
          this.selectList[2]["value"] === "所有课时"
            ? undefined
            : this.selectList[2]["value"],
        student: this.userName,
        stuId: this.stuId
      });
      this.loading = false;
    },

    async changeYear(value) {
      this.loading = true;
      await this.getStuOnlineHW({
        // TODO: 暂时写死，课程信息由课程接口返回
        obj:
          this.selectList[1]["value"] === "所有课程"
            ? this.getAllCourse
            : [
                {
                  course: this.selectList[1]["value"],
                  stuclass: "ATM",
                  teacher: "程亮"
                }
              ],
        semester: value,
        classHour:
          this.selectList[2]["value"] === "所有课时"
            ? undefined
            : this.selectList[2]["value"],
        student: this.userName,
        stuId: this.stuId
      });
      this.loading = false;
    },

    async changeCourse(value) {
      this.loading = true;
      await this.getStuOnlineHW({
        obj:
          value === "所有课程"
            ? this.getAllCourse
            : [
                {
                  course: value,
                  stuclass: "ATM",
                  teacher: "程亮"
                }
              ],
        semester: this.selectList[0]["value"],
        classHour:
          this.selectList[2]["value"] === "所有课时"
            ? undefined
            : this.selectList[2]["value"],
        student: this.userName,
        stuId: this.stuId
      });
      this.loading = false;
    },

    async changeClassHour(value) {
      this.loading = true;
      await this.getStuOnlineHW({
        obj:
          this.selectList[1]["value"] === "所有课程"
            ? this.getAllCourse
            : [
                {
                  course: this.selectList[1]["value"],
                  stuclass: "ATM",
                  teacher: "程亮"
                }
              ],
        semester: this.selectList[0]["value"],
        classHour: value === "所有课时" ? undefined : value,
        student: this.userName,
        stuId: this.stuId
      });
      this.loading = false;
    },

    async getSubjectList(id) {
      await this.getStuOnlineSubject(id);
    },

    dialogOk() {
      console.log("上传");
    },

    async handleOk(seconds) {
      this.curDirectory = 1;
      let questions = null;
      await Promise.all(
        this.inputInfo.map(async (item, index) => {
          let { choice, subjectType, subject, id } = item;
          if (subjectType !== "填空题") {
            questions = [
              {
                root_id: this.stuHomeworkId,
                quest_id: id,
                answer: subjectType === "多选题" ? choice.join() : choice
              }
            ];
          } else {
            questions = subject.map(item => {
              return {
                root_id: this.stuHomeworkId,
                quest_id: item["id"],
                answer: item["answer"]
              };
            });
          }
          let res = await this.stuSubmitOnlineHW({
            id: this.stuHomeworkId,
            submit_time: this.$tools.getCurDate(),
            surplus_time: seconds,
            questions
          });
        })
      );
      this.setInputInfo([]);
      this.showModal2 = false;
      this.$Notice.success({
        title: "提交作业成功！"
      });
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
