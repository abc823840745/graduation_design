<template>
  <div>
    <div v-if="access == 'student'">
      <Row :gutter="20">
        <i-col
          :xs="12"
          :md="8"
          :lg="4"
          v-for="(infor, i) in inforCardData"
          :key="`infor-${i}`"
          style="height: 120px;padding-bottom: 10px;"
        >
          <infor-card
            shadow
            :color="infor.color"
            :icon="infor.icon"
            :icon-size="36"
          >
            <count-to :end="infor.count" count-class="count-style" />
            <p>{{ infor.title }}</p>
          </infor-card>
        </i-col>
      </Row>
      <div class="lesson_container">
        <Table
          border
          :columns="columns"
          :data="lesson"
          size="large"
          no-data-text="暂时无法查询课表"
        ></Table>
        <div class="btn_container">
          <Button @click="showModal = true" type="success">刷新课表</Button>
        </div>
      </div>
      <Modal
        v-model="showModal"
        title="确定要刷新课表？"
        @on-ok="refreshCourse"
      >
        <Form
          ref="formValidate"
          :model="form"
          :rules="ruleValidate"
          :label-width="80"
        >
          <FormItem label="学号" prop="name">
            <Input v-model="form.name" placeholder="请输入你的学号"></Input>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input
              v-model="form.password"
              type="password"
              placeholder="请输入你的密码"
            ></Input>
          </FormItem>
        </Form>
      </Modal>
    </div>
    <div v-if="access == 'admin'">
      <TeaHome />
    </div>
  </div>
</template>

<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { ChartPie, ChartBar } from "_c/charts";
import Example from "./example.vue";
import TeaHome from "@teaHomework/page/homework-main.vue";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { getNewMessage } from "@/api/message";
import { refreshCourse } from "@/api/user";

export default {
  name: "student-teacher-home",
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example,
    TeaHome
  },
  data() {
    return {
      form: {
        name: "",
        password: ""
      },
      showModal: false,
      columns: [
        {
          title: "上课时间",
          key: "time",

          align: "center"
        },
        {
          title: "星期一",
          key: "monday",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    let lessonItem = this.lesson[params.index].monday;
                    this.goToCource(lessonItem);
                  }
                }
              },
              this.lesson[params.index].monday
            );
          }
        },
        {
          title: "星期二",
          key: "tuesday",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    let lessonItem = this.lesson[params.index].tuesday;
                    this.goToCource(lessonItem);
                  }
                }
              },
              this.lesson[params.index].tuesday
            );
          }
        },
        {
          title: "星期三",
          key: "wednesday",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    let lessonItem = this.lesson[params.index].wednesday;
                    this.goToCource(lessonItem);
                  }
                }
              },
              this.lesson[params.index].wednesday
            );
          }
        },
        {
          title: "星期四",
          key: "thursday",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    let lessonItem = this.lesson[params.index].thursday;
                    this.goToCource(lessonItem);
                  }
                }
              },
              this.lesson[params.index].thursday
            );
          }
        },
        {
          title: "星期五",
          key: "friday",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    let lessonItem = this.lesson[params.index].friday;
                    this.goToCource(lessonItem);
                  }
                }
              },
              this.lesson[params.index].friday
            );
          }
        }
      ],
      lesson: [],
      lessonText: [],
      access: "",
      inforCardData: [
        {
          title: "毕设动态",
          icon: "md-person-add",
          count: 803,
          color: "#2d8cf0"
        },
        { title: "课题通知", icon: "md-locate", count: 232, color: "#19be6b" },
        {
          title: "论文动态",
          icon: "md-help-circle",
          count: 142,
          color: "#ff9900"
        },
        { title: "分享统计", icon: "md-share", count: 657, color: "#ed3f14" },
        {
          title: "新增互动",
          icon: "md-chatbubbles",
          count: 12,
          color: "#E46CBB"
        },
        { title: "任务区", icon: "md-map", count: 14, color: "#9A66E4" }
      ],
      pieData: [
        { value: 335, name: "作业" },
        { value: 310, name: "毕设" },
        { value: 234, name: "课程" },
        { value: 135, name: "问答" }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "请输入正确的学号",
            trigger: "blur",
            pattern: /^[0-9]{10}$/
          }
        ],
        password: [
          {
            required: true,
            message: "请输入正确的密码",
            trigger: "blur",
            pattern: /^[0-9]{14}$/
          }
        ]
      }
    };
  },
  mounted() {
    this.getUserAccess();
    this.getNewMessage();
    if (this.$store.state.user.lesson) {
      let { setSessionStorage, getSessionStorage } = this.$tools;
      this.lessonText = this.$store.state.user.lesson.split("&nbsp;");
      this.formatLesson();
      let lessonText = this.formatData(this.lessonText);
      setSessionStorage("formatLesson", lessonText);
    }
  },
  methods: {
    ...mapActions(["getAccess"]),
    goToCource(cource) {
      let newCource = cource.split(",");
      let courceArr = [];
      newCource.forEach(cource => {
        let code = cource.substr(cource.indexOf("(") + 1, 3);
        let lesson = cource.substring(0, cource.indexOf("("));
        let dataDetail = cource.substr(cource.indexOf("(") + 4).split(" ");
        let name = dataDetail[1];
        let week = "";
        for (let i = 2; i < dataDetail.length - 1; i++) {
          week += dataDetail[i];
        }
        let room = dataDetail[dataDetail.length - 1].substring(
          0,
          dataDetail[dataDetail.length - 1].indexOf(")")
        );
        courceArr.push({
          code,
          name,
          room,
          week,
          lesson
        });
      });
      this.$router.push({
        path: "/student/homework/my-homework",
        query: {
          data: JSON.stringify({ lesson: courceArr })
        }
      });
    },
    formatLesson() {
      let lessonContainer = [];
      this.lesson = [];
      let flag = false;
      this.lessonText.forEach(item => {
        if (lessonContainer.length != 0 && item.indexOf("节") != -1) {
          this.lesson.push({
            time: lessonContainer[0],
            monday: lessonContainer[1],
            tuesday: lessonContainer[2],
            wednesday: lessonContainer[3],
            thursday: lessonContainer[4],
            friday: lessonContainer[5]
          });
          lessonContainer = [];
        }
        if (item != "" && item.indexOf("节") == -1) {
          lessonContainer.push("");
        }
        if (
          item != "" &&
          item.indexOf("节") != -1 &&
          item.substr(item.indexOf("节") + 14) != ""
        ) {
          lessonContainer.push(item.substr(0, item.indexOf("节") + 14));
          lessonContainer.push(item.substr(item.indexOf("节") + 14));
        } else {
          lessonContainer.push(item);
        }
      });
    },
    formatData(strArr) {
      let courseNameReg = /[\u4e00-\u9fa5]{4,}/g;
      let teacherNameReg = /\s[\u4e00-\u9fa5]{3}\s/g;
      let classNameReg = /[a-zA-Z]{3}\s/g;
      let classIdReg = /[a-zA-Z]{1,}[0-9]{1,}/g;
      let notNullReg = /周/g;
      let obj = {};
      let courseNameList = strArr.reduce((finalList, item, index) => {
        // 排除没有'周字'的数据
        if (notNullReg.test(item)) {
          let courseName = item.match(courseNameReg)[0];

          // 根据课程名去除重复数据
          if (!obj[courseName]) {
            obj[courseName] = true;
            finalList.push({
              courseName,
              teacherName: item.match(teacherNameReg)[0],
              className: item.match(classNameReg)[0],
              classId: item.match(classIdReg)[0]
            });
          }
        }
        return finalList;
      }, []);
      return courseNameList;
    },
    getNewMessage() {
      let uid = this.$store.state.user.guideTeacher;
      getNewMessage({ uid }).then(res => {
        if (res.data.message == "ok") {
          let viewCount = localStorage.getItem("news")
            ? localStorage.getItem("news")
            : 0;
          localStorage.setItem("originCount", res.data.count);
          let leftCount = res.data.count - viewCount;
          this.$store.commit("setMsgCount", leftCount);
        }
      });
    },
    getUserAccess() {
      this.getAccess().then(res => {
        this.access = res[0];
      });
    },
    refreshCourse() {
      this.$refs["formValidate"].validate(validate => {
        let { name, password } = this.form;
        if (validate) {
          refreshCourse(name, password).then(res => {
            if (res.data.message == "ok") {
              this.$store.dispatch("setLesson", this.lessonText);
              this.lessonText = res.data.content.split("&nbsp;");
              this.formatLesson();
              let lessonText = this.formatData(this.lessonText);
              this.$store.commit("setFormatLesson", lessonText);
              this.$Notice.success({
                title: "刷新成功"
              });
            } else {
              this.$Notice.warning({
                title: "用户名或密码不正确"
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}

.lesson_container {
  position: relative;
  margin-top: 50px;
}

.btn_container {
  position: absolute;
  left: 50%;
  transform: translateX(-20px);
  margin-top: 30px;
}
</style>