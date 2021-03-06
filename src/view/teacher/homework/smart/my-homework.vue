<template>
  <div class="containter">
    <CreateSubject
      ref="subject"
      :type="type"
      :homeworkInfo="info"
      :showModal.sync="showModal2"
      @modalOk="type === 'create' ? submitSubject() : updateSubject()"
      @modalCancel="modalCancel"
    />

    <Modal v-model="showModal" title="新建任务">
      <p slot="header" style="color:#666;text-align:center;font-size:18px;">
        <span>{{ type === "create" ? "新建作业" : "编辑作业" }}</span>
      </p>

      <div class="create-subject-con">
        <div class="df-aic mb-20">
          <h3>作业名称：</h3>
          <Input
            v-model="homeworkInfo['name']"
            placeholder="输入内容"
            clearable
            style="width: 250px"
          />
        </div>

        <div class="mb-20" v-if="type === 'create'">
          <MultipleChoice
            semesterTip="作业类型"
            :defaultValue.sync="homeworkInfo['classify']"
            :semesterList="classifyList"
            class="multiple-choice"
          />
        </div>

        <div class="mar-bottom mb-20">
          <MultipleChoice
            semesterTip="课时选择"
            :defaultValue.sync="homeworkInfo['classHour']"
            :semesterList="classHourList"
            class="multiple-choice"
          />
        </div>

        <div
          class="df-aic mb-20"
          v-show="homeworkInfo['classify'] === '在线作业'"
        >
          <h3>考试时间：</h3>
          <InputNumber
            :max="200"
            :min="1"
            :step="1"
            v-model="homeworkInfo['testingTime']"
          />
          <span class="ml-5">分钟</span>
        </div>

        <div class="df-aic mb-20">
          <h3>完成时间：</h3>
          <DatePicker
            :value="homeworkInfo['stopTimeList']"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            placeholder="选择时间"
            style="width: 250px"
            @on-change="timeOnChange"
          ></DatePicker>
        </div>

        <div
          class="df-aic"
          v-if="
            (type === 'create' && homeworkInfo['classify'] === '课时作业') ||
              (type === 'update' && info['classify'] === '课时作业')
          "
        >
          <h3>上传课件：</h3>
          <Upload
            class="upload-con"
            :show-upload-list="false"
            :action="uploadUrl"
            :max-size="15360"
            :format="['doc', 'docx']"
            :on-success="handleSuccess"
            :on-format-error="handleFormatErr"
            :on-exceeded-size="handleMaxSize"
          >
            <Button icon="ios-cloud-upload-outline">请点击此处上传</Button>
          </Upload>

          <Button
            class="ml-10"
            v-if="type === 'update' && info['classify'] === '课时作业'"
            @click="goDownload"
          >
            下载已上传课件
          </Button>
        </div>
      </div>

      <div slot="footer">
        <Button
          type="primary"
          v-if="type === 'create'"
          @click="
            homeworkInfo['classify'] === '在线作业' ? addSubject() : addHWInfo()
          "
          long
        >
          {{
            homeworkInfo["classify"] === "在线作业"
              ? "新建题目信息"
              : "新建作业信息"
          }}
        </Button>

        <Button
          type="primary"
          v-if="type === 'update'"
          @click="
            info['classify'] === '在线作业'
              ? updateSubjectInfo()
              : updateClassHWInfo()
          "
        >
          {{ info["classify"] === "在线作业" ? "编辑题目信息" : "确认修改" }}
        </Button>

        <Button
          type="primary"
          v-if="type === 'update' && info['classify'] === '在线作业'"
          @click="updateOnlineHWInfo"
        >
          确认修改
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import myMixin from "@/view/global/mixin";
import config from "@/config";
import { mapActions, mapState, mapMutations } from "vuex";
import { debounce, isEmptyObject } from "@tools";

export default {
  name: "my-homework",

  mixins: [myMixin],

  props: {
    type: String, // 新建状态和修改状态
    courseId: Number, // 课程id
    submitInfo: Object, // 新建任务需要的信息
    info: {
      type: Object, // 修改任务显示的数据
      default() {
        return {};
      }
    },
    modalOpen: Boolean
  },

  components: {
    CreateSubject: () => import("@teaHomework/smart/create-subject"),
    MultipleChoice: () => import("@teaHomework/smart/multiple-choice")
  },

  watch: {
    modalOpen(newVal, oldVal) {
      this.showModal = newVal;
    },

    async courseId(newVal, oldVal) {
      await this.setClassHourList(newVal);
      this.$set(this.homeworkInfo, "classHour", this.info["week"]);
    },

    showModal(newVal, oldVal) {
      this.$emit("update:modalOpen", newVal);
      if (newVal === false) {
        this.setInputInfo([]);
      }
    },

    info(newVal, oldVal) {
      this.setDefClassHour(newVal);
      this.getCurTaskInfo(newVal);
    }
  },

  computed: {
    ...mapState({
      inputInfo: state => state.homework.inputInfo,
      subjectList: state => state.homework.subjectList,
      optionList: state => state.homework.optionList,
      originalInfo: state => state.homework.originalInfo,
      originInputInfo: state => state.homework.originInputInfo,
      stu_number: state => state.user.stu_nmuber,
      curCourse: state => state.homework.curCourse
    }),

    classifyList() {
      return this.getClassifyList().filter(item => item.value !== "所有类型");
    },

    uploadUrl() {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro;
      const uploadUrl = baseUrl + "/upload/teacher/exper";
      return uploadUrl;
    }
  },

  data() {
    return {
      showModal: false,
      showModal2: false,
      classHourList: [],
      uploadFileInfo: {},
      homeworkInfo: {
        name: "",
        classify: "",
        classHour: "",
        webpath: "",
        testingTime: 0,
        stopTimeList: []
      }
    };
  },

  methods: {
    ...mapActions([
      "addTeaClassHW",
      "updateTeaClassHW",
      "updateTeaOnlineHW",
      "teaUploadAgain",
      "addTeaOnlineHW",
      "addTeaOnlineSubject",
      "updateTeaOnlineSubject",
      "changeSubject"
    ]),

    ...mapMutations(["setInputInfo", "setOptionList"]),

    goDownload() {
      window.open(this.homeworkInfo["webpath"]);
    },

    async setClassHourList(id) {
      let res = await this.getClassHourList(id);
      this.classHourList = res.filter(item => item.value !== "所有课时");
    },

    // 设置默认的课时选项
    setDefClassHour(info) {
      let homeworkInfo = this.homeworkInfo;
      homeworkInfo["classHour"] = info.week;
      this.homeworkInfo = homeworkInfo;
    },

    // 监听选择时间日期函数
    timeOnChange(value) {
      this.$set(this.homeworkInfo, "stopTimeList", value);
    },

    getCurTaskInfo(val) {
      let { name, week, startime, fintime, classify, totaltime, webpath } = val;
      if (this.type === "create") return;
      let info = this.homeworkInfo;
      info["name"] = name;
      info["classify"] = classify;
      info["classHour"] = week;
      info["webpath"] = classify === "课时作业" ? webpath : "";
      info["testingTime"] =
        classify === "课时作业" ? 0 : parseInt(totaltime, 10) / 60; // 将秒数转换成分钟显示
      info["stopTimeList"] = [startime, fintime];
      this.homeworkInfo = info;
    },

    // 新建作业任务
    addHWInfo: debounce(
      async function() {
        let { name, classify, classHour, stopTimeList } = this.homeworkInfo;
        let { filename, localpath, url } = this.uploadFileInfo;

        if (!name || !classify || !classHour || !stopTimeList.length) {
          return this.$Message.error("缺少必填信息");
        }
        if (isEmptyObject(this.uploadFileInfo)) {
          return this.$Message.error("请上传课件");
        }
        if (classify === "课时作业") {
          let { semester, course, course_id, teacher } = this.submitInfo;
          let res = await this.addTeaClassHW({
            name,
            classHour,
            localpath,
            localname: filename,
            webpath: url,
            semester,
            course,
            course_id,
            teacher,
            teach_id: this.stu_number,
            startime: stopTimeList[0],
            fintime: stopTimeList[1]
          });
          if (res["status"] === 1) {
            this.$Notice.success({
              title: "新建成功！"
            });
            this.homeworkInfo = {};
            this.uploadFileInfo = {};
            this.showModal = false;
          }
        }
      },
      2000,
      true
    ),

    // 提交题目Modal确定事件
    async submitSubject() {
      let { name, classHour, testingTime, stopTimeList } = this.homeworkInfo;
      let { semester, course, course_id, teacher } = this.submitInfo;
      let res = await this.addTeaOnlineHW({
        name,
        classHour,
        semester,
        course,
        teacher,
        teach_id: this.stu_number,
        totaltime: testingTime * 60, // 转换成秒数提交
        startime: stopTimeList[0],
        fintime: stopTimeList[1]
      });
      if (res["status"] === 1) {
        let questions = null;
        let root_id = res["id"];
        await Promise.all(
          this.inputInfo.map(async item => {
            let grade = item["weighting"];
            let subject = item["subject"];
            if (item["subjectType"] !== "填空题") {
              questions = [
                {
                  context: subject,
                  obj: {
                    first_option: item["optionList"][0]["option"],
                    sec_option: item["optionList"][1]["option"],
                    third_option: item["optionList"][2]["option"],
                    fourth_option: item["optionList"][3]["option"]
                  },
                  Category: "",
                  course: this.curCourse,
                  qtype: item["subjectType"],
                  answer:
                    item["subjectType"] === "多选题"
                      ? item["choice"].join()
                      : item["choice"],
                  grade,
                  status: item["status"]
                }
              ];
            } else {
              // 处理填空题格式
              questions = subject.map((item, index, arr) => {
                return {
                  context: item["subject"],
                  obj: {
                    first_option: "",
                    sec_option: "",
                    third_option: "",
                    fourth_option: ""
                  },
                  Category: "",
                  course: this.curCourse,
                  qtype: "填空题",
                  answer: item["referenceAnswer"],
                  grade: grade / arr.length,
                  status: item["status"]
                };
              });
            }

            // 新建题目
            let res = await this.addTeaOnlineSubject({
              root_id,
              root_name: name,
              questions,
              teach_id: this.stu_number
            });
          })
        );
        this.homeworkInfo = {};
        this.setInputInfo([]);
        localStorage.removeItem("subjectList");
        this.$Notice.success({
          title: "新建成功！"
        });
      }
      this.showModal = false;
      this.showModal2 = false;
    },

    // 修改在线作业题目
    async updateSubject() {
      let executeOne = true;
      let notFillSubject = this.originInputInfo.filter(
        item => item["subjectType"] !== "填空题"
      );
      let notFillSubject2 = this.inputInfo.filter(
        item => item["subjectType"] !== "填空题"
      );
      let fillSubject = this.originInputInfo.filter(
        item => item["subjectType"] === "填空题"
      );
      let fillSubject2 = this.inputInfo.filter(
        item => item["subjectType"] === "填空题"
      );
      let beforeFillSubLen =
        fillSubject["length"] > 0 ? fillSubject[0]["subject"]["length"] : 0;
      let curFillSubLen =
        fillSubject2["length"] > 0 ? fillSubject2[0]["subject"]["length"] : 0;

      // 判断数组长度和填空题小题数量是否变化，没有变化，则全部为更新操作
      if (this.optionList.length === 0 && beforeFillSubLen === curFillSubLen) {
        await this.updateOnlineSubject();
        return;
      }

      let data = this.optionList.reduce((arr, item, index) => {
        let { key, type, subjectType } = item;
        if (item["subjectType"] !== "填空题") {
          // 处理非填空题的逻辑
          if (type === "delete") {
            arr.push({
              id: item["key"],
              type: "delete"
            });
          } else if (type === "update") {
            // 获取该题具体数据
            arr.push(this.update(key, notFillSubject2));
          } else if (type === "add") {
            arr.push(this.add(key));
          }
        } else {
          // 处理填空题的逻辑
          let key = item["key"];
          let subject = item["subject"];
          if (type === "delete") {
            let subjectInfo = fillSubject[0]["subject"].filter(
              item => item["id"] === key
            );
            arr.push({
              id: subjectInfo[0]["id"],
              type: "delete"
            });
          } else if (type === "update") {
            // 获取该题具体数据
            arr.push(this.update2(key, fillSubject2));
          } else if (type === "add") {
            // 只执行一次，因为只有一道填空题
            if (executeOne) {
              executeOne = false;
              let weighting = fillSubject2[0]["weighting"];
              fillSubject2[0]["subject"].forEach((item, index, array) => {
                // 剔除不需要添加的填空题
                if (item["id"]) return;
                arr.push(this.add2(item, weighting, array));
              });
            }
          }
        }
        return arr;
      }, []);
      let res = await this.changeSubject({
        id: this.info["id"],
        arr: data
      });
      this.showModal = false;
      this.showModal2 = false;
      this.setInputInfo([]);
      this.setOptionList([]);
      localStorage.removeItem("subjectList");
      this.$Notice.success({
        title: "修改成功！"
      });
    },

    // 非填空题添加题目逻辑
    add(key) {
      let subjectInfo = this.inputInfo.filter(item => item["key"] === key);
      let {
        id,
        subject,
        optionList,
        type,
        subjectType,
        choice,
        weighting
      } = subjectInfo[0];
      return {
        type: "add",
        context: subject,
        root_name: this.info["name"],
        root_id: this.info["id"],
        obj: {
          first_option: optionList[0]["option"],
          sec_option: optionList[1]["option"],
          third_option: optionList[2]["option"],
          fourth_option: optionList[3]["option"]
        },
        qtype: subjectType,
        answer: subjectType === "多选题" ? choice.join() : choice,
        grade: weighting
      };
    },

    // 填空题添加逻辑
    add2(item, weighting, array) {
      let { subject, referenceAnswer } = item;
      return {
        type: "add",
        context: subject,
        root_name: this.info["name"],
        root_id: this.info["id"],
        obj: {
          first_option: "",
          sec_option: "",
          third_option: "",
          fourth_option: ""
        },
        qtype: "填空题",
        answer: referenceAnswer,
        grade: weighting / array.length
      };
    },

    // 非填空题更新题目逻辑
    update(key, notFillSubject) {
      let subjectInfo = notFillSubject.filter(item => item["id"] === key);
      let {
        id,
        subject,
        optionList,
        type,
        subjectType,
        choice,
        weighting
      } = subjectInfo[0];
      return {
        id,
        type: "update",
        context: subject,
        obj: {
          first_option: optionList[0]["option"],
          sec_option: optionList[1]["option"],
          third_option: optionList[2]["option"],
          fourth_option: optionList[3]["option"]
        },
        qtype: subjectType,
        answer: subjectType === "多选题" ? choice.join() : choice,
        grade: weighting
      };
    },

    // 填空题更新题目逻辑
    update2(key, fillSubject) {
      let fillSubjectLen = 0;
      let weighting = fillSubject[0]["weighting"];
      let subjectInfo = fillSubject[0]["subject"].filter(item => {
        fillSubjectLen += 1;
        return item["id"] === key;
      });
      let { id, subject, referenceAnswer } = subjectInfo[0];
      return {
        id,
        type: "update",
        context: subject,
        obj: {
          first_option: "",
          sec_option: "",
          third_option: "",
          fourth_option: ""
        },
        qtype: "填空题",
        answer: referenceAnswer,
        grade: weighting / fillSubjectLen
      };
    },

    // 对题目只执行更新操作
    async updateOnlineSubject() {
      let questions = [];
      await Promise.all(
        this.inputInfo.map(async item => {
          let [first, second, third, fourth] = item["optionList"];
          let { subject, choice, weighting, subjectType, id } = item;
          let answer = subjectType === "多选题" ? choice.join() : choice;
          if (subjectType !== "填空题") {
            questions = [
              {
                id,
                context: subject,
                obj: {
                  first_option: first["option"],
                  sec_option: second["option"],
                  third_option: third["option"],
                  fourth_option: fourth["option"]
                },
                qtype: subjectType,
                answer,
                grade: weighting
              }
            ];
          } else {
            // 处理填空题格式
            questions = item["subject"].map((item, index, arr) => {
              let { id, subject, referenceAnswer } = item;
              return {
                id,
                context: subject,
                obj: {
                  first_option: "",
                  sec_option: "",
                  third_option: "",
                  fourth_option: ""
                },
                qtype: "填空题",
                answer: referenceAnswer,
                grade: weighting / arr.length
              };
            });
          }
          await this.updateTeaOnlineSubject(questions);
        })
      );
      this.showModal = false;
      this.showModal2 = false;
      this.setInputInfo([]);
      this.$Notice.success({
        title: "修改成功！"
      });
    },

    // 点击修改在线作业题目按钮事件
    updateSubjectInfo() {
      this.showModal2 = true;
    },

    // 取消modal事件
    modalCancel() {
      this.showModal = false;
      this.showModal2 = false;
    },

    // 更新课时作业信息
    async updateClassHWInfo() {
      let { submitterStatus } = this.info;
      if (
        !isEmptyObject(submitterStatus) &&
        submitterStatus["isOperate"] === 0
      ) {
        this.$Modal.confirm({
          title: "已经有学生提交，确定要修改该任务？",
          onOk: async () => {
            await this.doUpdateClassHWInfo();
          }
        });
        return;
      }
      await this.doUpdateClassHWInfo();
    },

    // 调用更新课时作业信息接口
    async doUpdateClassHWInfo() {
      const { name, classHour, stopTimeList } = this.homeworkInfo;
      let res = await this.updateTeaClassHW({
        id: this.info.id,
        name,
        classHour,
        startime: stopTimeList[0],
        fintime: stopTimeList[1]
      });
      if (res["status"] === 1) {
        this.$Notice.success({
          title: "修改成功！"
        });
        this.$emit("getTableData");
        this.showModal = false;
      }
    },

    // 调用更新在线作业信息接口
    async doUpdateOnlineHWInfo() {
      const { name, classHour, stopTimeList, testingTime } = this.homeworkInfo;
      let res = await this.updateTeaOnlineHW({
        id: this.info.id,
        name,
        classHour,
        totaltime: testingTime * 60,
        startime: stopTimeList[0],
        fintime: stopTimeList[1]
      });
      if (res["status"] === 1) {
        this.$Notice.success({
          title: "修改成功！"
        });
        this.$emit("getTableData");
        this.showModal = false;
      }
    },

    // 更新在线作业信息
    async updateOnlineHWInfo() {
      let { submitterStatus } = this.info;
      if (
        !isEmptyObject(submitterStatus) &&
        submitterStatus["isOperate"] === 0
      ) {
        this.$Modal.confirm({
          title: "已经有学生提交，确定要修改该任务？",
          onOk: async () => {
            await this.doUpdateOnlineHWInfo();
          }
        });
        return;
      }
      await this.doUpdateOnlineHWInfo();
    },

    // 新建在线作业题目
    addSubject() {
      let {
        name,
        classify,
        classHour,
        testingTime,
        stopTimeList
      } = this.homeworkInfo;
      if (
        !name ||
        !classify ||
        !classify ||
        testingTime === 0 ||
        stopTimeList.length === 0
      ) {
        return this.$Message.error("缺少必填信息");
      }
      this.showModal2 = true;
      this.setInputInfo([]);
    },

    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件超过大小限制",
        desc: "文件大小不能查过15M！"
      });
    },

    handleFormatErr(file) {
      this.$Notice.warning({
        title: "文件格式应该为doc"
      });
    },

    async handleSuccess(result, file) {
      if (this.type === "create") {
        this.uploadFileInfo = result;
        this.$Notice.success({
          title: "上传成功！"
        });
        return;
      }
      let { id } = this.info;
      let { localpath, url, filename } = result;
      let res = await this.teaUploadAgain({
        id,
        localpath,
        webpath: url,
        localname: filename
      });
      if (res["status"] === 1) {
        this.$set(this.homeworkInfo, "webpath", url);
        this.$Notice.success({
          title: "重新上传成功！"
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../global/public.less";

.containter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: auto;
  padding: 0 1%;

  p {
    font-size: 15px;
  }

  .create-subject-con {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .multiple-choice /deep/ .select-list {
    width: 250px;
  }

  .mar-bottom {
    margin-bottom: 30px;
  }

  .mar-top {
    margin-top: 20px;
  }

  .show-dialog-btn {
    width: 322px;
    margin-bottom: 30px;
  }

  .btnGround {
    width: 321px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .btnGround button:nth-of-type(1) {
    margin-right: 5%;
  }
}
</style>
