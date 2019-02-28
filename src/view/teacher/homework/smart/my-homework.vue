<template>
  <div class="containter">
    <CreateSubject :showModal.sync="showModal2" @modalOk="submitSubject" />

    <Modal v-model="showModal" title="新建任务">
      <p slot="header" style="color:#666;text-align:center;font-size:18px;">
        <span>{{ type === "create" ? "新建作业" : "修改作业" }}</span>
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
            :max="80"
            :min="5"
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

        <div class="df-aic">
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
            info['classify'] === '在线作业' ? addSubject() : updateHWInfo()
          "
          long
        >
          {{
            info["classify"] === "在线作业" ? "修改题目信息" : "修改作业信息"
          }}
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import CreateSubject from "@teaHomework/smart/create-subject";
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import myMixin from "@/view/global/mixin";
import config from "@/config";
import { mapActions } from "vuex";

export default {
  name: "my-homework",

  mixins: [myMixin],

  props: {
    type: String, // 新建状态和编辑状态
    sumbitInfo: Object, // 新建任务需要的信息
    info: Object, // 编辑任务显示的数据
    modalOpen: Boolean
  },

  components: {
    CreateSubject,
    MultipleChoice
  },

  watch: {
    modalOpen(newVal, oldVal) {
      this.showModal = newVal;
    },

    showModal(newVal, oldVal) {
      this.$emit("update:modalOpen", newVal);
    },

    info(newVal, oldVal) {
      this.getCurTaskInfo(newVal);
    }
  },

  computed: {
    classHourList() {
      return this.getClassHourList().filter(item => item.value !== "所有课时");
    },

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
      uploadFileInfo: {},
      homeworkInfo: {
        name: "",
        classify: "",
        classHour: "",
        testingTime: 0,
        stopTimeList: []
      }
    };
  },

  mounted() {
    // TODO: 根据type判断是否为新建模式和修改模式，根据homeworkType获取对应接口的信息
  },

  methods: {
    ...mapActions(["addTeaClassHW", "updateTeaClassHW"]),

    // 监听选择时间日期函数
    timeOnChange(value) {
      let homeworkInfo = { ...this.homeworkInfo };
      homeworkInfo["stopTimeList"] = value;
      this.homeworkInfo = homeworkInfo;
    },

    getCurTaskInfo(val) {
      let { name, week, startime, fintime, classify } = val;
      if (this.type === "create") return;
      if (classify === "课时作业") {
        let info = this.homeworkInfo;
        info["name"] = name;
        info["classify"] = classify;
        info["classHour"] = week;
        info["stopTimeList"] = [startime, fintime];
        this.homeworkInfo = info;
      }
    },

    // 新建作业任务
    async addHWInfo() {
      let {
        name,
        classify,
        classHour,
        testingTime,
        stopTimeList
      } = this.homeworkInfo;
      let { filename, localpath, url } = this.uploadFileInfo;

      if (!name || !classify || !classHour || stopTimeList.length === 0) {
        return this.$Message.error("缺少必填信息");
      }
      if (this.$tools.isEmptyObject(this.uploadFileInfo)) {
        return this.$Message.error("请上传课件");
      }
      if (classify === "课时作业") {
        let res = await this.addTeaClassHW({
          name,
          classHour,
          localpath,
          localname: filename,
          webpath: url,
          semester: this.sumbitInfo["semester"],
          course: this.sumbitInfo["course"],
          course_id: this.sumbitInfo["course_id"],
          teacher: this.sumbitInfo["teacher"],
          startime: stopTimeList[0],
          fintime: stopTimeList[1]
        });
        if (res["status"] === 1) {
          this.$Notice.success({
            title: "新建成功！"
          });
          this.homeworkInfo = {};
          this.showModal = false;
        }
      }
    },

    // 更新课时作业信息
    async updateHWInfo() {
      let { name, classHour, stopTimeList } = this.homeworkInfo;
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

    // 新建在线作业题目
    addSubject() {
      let { name, classify, stopTimeList } = this.homeworkInfo;
      if (!name || !classify || stopTimeList.length === 0) {
        return this.$Message.error("缺少必填信息");
      }
      this.showModal2 = true;
    },

    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件超过大小限制",
        desc: "文件大小不能查过15M！"
      });
    },

    handleFormatErr(file) {
      this.$Notice.warning({
        title: "文件格式应该为doc",
        desc: ""
      });
    },

    handleSuccess(res, file) {
      this.uploadFileInfo = res;
      this.$Notice.success({
        title: "上传成功！",
        desc: ""
      });
    },

    // 提交题目Modal确定事件
    submitSubject() {
      // TODO:提交题目
      this.showModal = false;
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
