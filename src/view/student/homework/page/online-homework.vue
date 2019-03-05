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
        :columns="columns"
        :data="tableInfo['tableData']"
      />

      <Page
        class="mar-top page"
        :total="tableInfo['count']"
        :page-size="10"
        @on-change="changePage"
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
import { mapActions, mapState } from "vuex";

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
      inputInfo: state => state.homework.inputInfo,
      tableInfo: state => state.homework.onlineHWInfo
    })
  },

  data() {
    return {
      curDirectory: 1, // 当前的目录
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
          key: "submit_time",
          sortable: true
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("完成作业", h, async () => {
                const status = params["row"]["submit_time"];
                if (status !== "待提交") {
                  return this.$Message.info("你已完成作业");
                }
                this.showModal2 = true;
                this.stuHomeworkId = params.row.id;
                await this.getSubjectList(params.row.exper_id);
              })
            ]);
          }
        }
      ]
    };
  },

  async mounted() {
    await this.getTabelTable();
  },

  methods: {
    ...mapActions([
      "getStuOnlineHW",
      "getStuOnlineSubject",
      "stuSubmitOnlineHW"
    ]),

    async getTabelTable() {
      await this.getStuOnlineHW({
        // TODO: 暂时写死，课程信息由课程接口返回
        obj: this.getAllCourse,
        semester: this.getCurSchoolYear(),
        student: this.userName
      });
    },

    async changeYear(value) {
      // TODO: 每次将value存入vuex
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
        student: this.userName
      });
    },

    async changeCourse(value) {
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
        student: this.userName
      });
    },

    async changeClassHour(value) {
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
        student: this.userName
      });
    },

    async changePage(page) {
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
        student: this.userName
      });
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
                answer: choice
              }
            ];
          } else {
            questions = subject.map(item => {
              console.log(item["id"]);
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
          console.log(res);
        })
      );
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
