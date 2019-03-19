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
import {
  getlocalStorage,
  getCurDate,
  setlocalStorage,
  getCurSchoolYear,
  isEmptyObject
} from "@tools";
import { mapActions, mapState, mapMutations } from "vuex";
import Vue from "vue";
import VueSocketio from "vue-socket.io";
import socketio from "socket.io-client";
import config from "@/config";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;

// 配置socket服务地址
Vue.use(
  new VueSocketio({
    debug: false,
    connection: socketio(`${baseUrl}/online`)
  })
);

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
      remainTime: state => state.homework.remainTime,
      surplusTime: state => state.homework.surplusTime,
      experId: state => state.homework.experId
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
      timer: null,
      roomId: 0, // 房间id
      // surplusTime: 0, // 后端返回的剩余时间
      selectList: [
        {
          tip: "学期选择",
          value: getCurSchoolYear(),
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
          title: "开始时间",
          key: "exper_startime",
          sortable: true
        },
        {
          title: "截止时间",
          key: "exper_fintime",
          sortable: true
        },
        {
          title: "完成状态",
          key: "status",
          sortable: true,
          render: (h, params) => {
            let text = params.row.status;
            let btnColor = null;
            switch (text) {
              case "已完成":
                btnColor = "success";
                break;
              case "未完成":
                btnColor = "error";
                break;
              case "进行中":
                btnColor = "warning";
                break;
            }
            return h("div", [this.statusBtnStyle(text, h, btnColor)]);
          }
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            let {
              exper_fintime,
              exper_startime,
              id,
              exper_id,
              status,
              surplus_time
            } = params.row;
            let curDate = new Date();
            let startTime = new Date(exper_startime);
            let finDate = new Date(exper_fintime);

            // 作业状态为未完成和当前时间少于等于完成时间和当前时间大于开始时间
            if (
              status !== "已完成" &&
              curDate <= finDate &&
              curDate > startTime
            ) {
              return h("div", [
                this.btnStyle("完成作业", h, async () => {
                  // if (this.tableInfo["ondoingStatus"]["ondoingcount"] > 1) {
                  //   return this.$Notice.success({
                  //     title: "请先完成当前的在线测试"
                  //   });
                  // }
                  // console.log(this.tableInfo["ondoingStatus"]);
                  this.setRemainTime(0);
                  this.showModal2 = true;
                  this.stuHomeworkId = id;
                  this.stuHWInfo = params.row;
                  this.setFintime(exper_fintime);
                  this.setExperId(exper_id);
                  await this.getSubjectList(exper_id);
                  this.joinRoom();
                  if (status === "进行中") {
                    this.senSocketData(this.surplusTime);
                    await this.autoRecovery(exper_id);
                  } else {
                    this.setSurplusTime(surplus_time);
                    this.senSocketData(surplus_time);
                  }
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
    setInterval(() => {
      if (!this.$socket.connected) {
        this.$socket.connect();
      }
    }, 1500);
  },

  beforeRouteLeave(to, from, next) {
    this.closeSocket();
    this.timer && clearInterval(this.timer);
    next();
  },

  methods: {
    ...mapActions(["getStuOnlineHW", "getStuOnlineSubject"]),

    ...mapMutations([
      "setInputInfo",
      "setSurplusTime",
      "setExperId",
      "setFintime",
      "setRemainTime"
    ]),

    // 掉线下次再进来就恢复学生之前的回答
    async autoRecovery(exper_id) {
      let subjectList = getlocalStorage("subjectList");
      if (!isEmptyObject(subjectList)) {
        let inputInfo = subjectList[exper_id];
        this.setInputInfo(inputInfo);
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

    // 时间为 0 或者超过老师设置的完成时间的回调
    async endTimeDoing(seconds) {
      this.submitSubjectAfter(seconds, "没有剩余时间自动提交作业成功");
    },

    // 点击 modal 确定按钮手动提交作业
    async handleOk(seconds) {
      this.submitSubjectAfter(seconds, "提交作业成功！");
    },

    handleCancel() {
      this.curDirectory = 1;
    },

    // 处理题目格式
    getQuestions() {
      let questions = this.inputInfo.reduce((arr, item, index) => {
        let { choice, subjectType, subject, id } = item;
        if (subjectType !== "填空题") {
          arr.push({
            root_id: this.stuHomeworkId,
            quest_id: id,
            answer: subjectType === "多选题" && choice ? choice.join() : choice
          });
        } else {
          subject.forEach(item => {
            arr.push({
              root_id: this.stuHomeworkId,
              quest_id: item["id"],
              answer: item["answer"]
            });
          });
        }
        return arr;
      }, []);
      return questions;
    },

    // 处理后端返回的questions格式
    // getFilterQuestion() {

    // },

    // 提交题目数据后的事件
    async submitSubjectAfter(seconds, title) {
      this.leaveRoom(seconds);
      this.curDirectory = 1;
      this.setInputInfo([]);
      this.showModal2 = false;

      // 提交后清空保存的题目组
      localStorage.removeItem("subjectList");
      this.setExperId(0);
      this.$Notice.success({ title });
      await this.getTableData(this.tableInfo["page"]);
    },

    // 查看房间
    checkRoom() {
      this.$socket.emit("LookRoom", {
        room: this.roomId
      });
    },

    joinRoom() {
      this.timer && clearInterval(this.timer);
      this.$socket.emit("JoinRoom", {
        payload: {
          id: this.stuHomeworkId,
          status: "进行中",
          submit_time: getCurDate(),
          questions: this.getQuestions()
        }
      });
    },

    // 离开房间
    leaveRoom(seconds) {
      this.timer && clearInterval(this.timer);
      this.$socket.emit("LeaveRoom", {
        payload: {
          id: this.stuHomeworkId,
          status: "已完成",
          submit_time: getCurDate(),
          surplus_time: seconds,
          questions: this.getQuestions()
        }
      });
    },

    // 房间内发送数据,每隔1秒发送一次
    senSocketData(seconds) {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.$socket.emit("senData", {
          room: this.roomId,
          payload: {
            id: this.stuHomeworkId,
            status: "进行中",
            submit_time: getCurDate(),
            surplus_time: seconds,
            inputInfo: this.inputInfo
          }
        });
      }, 1000);
    },

    // 关闭socket
    closeSocket() {
      this.timer && clearInterval(this.timer);
      console.log("关闭了socket");
      this.$socket.emit("closeSocket", { id: this.roomId });
    },

    // 判断用户是否在线
    isOnline() {
      this.$socket.emit("heartmove", { id: this.roomId });
    }
  },

  sockets: {
    connect() {
      console.warn("socket连接成功！");
    },

    joinRes(value) {
      console.log(value);
      let { room, data } = value;
      this.roomId = room;
      if (data && data["surplus_time"]) {
        this.setSurplusTime(data["surplus_time"]);
      }
      if (data && data["inputInfo"]) {
        this.setInputInfo(data["inputInfo"]);
      }
    },

    leaveRes(value) {
      console.log(value);
    },

    senDataRes(value) {
      if (value["status"] !== 0) {
        this.senSocketData(this.remainTime);
      }
    },

    closeRes(value) {
      console.log(value);
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