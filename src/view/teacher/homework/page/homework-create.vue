<template>
  <div class="containter">
    <CourseSelect @goNext="goNext" />

    <Modal v-model="showModal">
      <p slot="header" style="color:#666;text-align:center;font-size:18px;">
        <span>新建作业</span>
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

        <div class="mb-20">
          <MultipleChoice
            semesterTip="作业类型"
            :defaultValue.sync="homeworkInfo['classify']"
            :semesterList="homeworkCategory"
            class="multiple-choice"
          />
        </div>

        <div class="mar-bottom mb-20">
          <MultipleChoice
            semesterTip="周数选择"
            :defaultValue.sync="homeworkInfo['weekNum']"
            :semesterList="weekList"
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
            :format="['doc', 'docx']"
            :on-success="hanldeSuccess"
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
          @click="
            homeworkInfo['classify'] === '在线作业' ? createSubject() : sumbit()
          "
          long
        >
          {{
            homeworkInfo["classify"] === "在线作业" ? "新建题目" : "新建作业"
          }}
        </Button>
      </div>
    </Modal>

    <Modal v-model="showCreSub" fullscreen title="新建题目" @on-ok="dialogOk">
      <createSubject :homeworkInfo="homeworkInfo" />
    </Modal>
  </div>
</template>

<script>
import CourseSelect from "@teaHomework/smart/course-select";
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import createSubject from "@teaHomework/smart/create-subject";
import myMixin from "@/view/global/mixin";
import config from "@/config";
import { mapActions } from "vuex";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;
const uploadUrl = baseUrl + "/upload/teacher/exper";

export default {
  mixins: [myMixin],

  props: {
    sumbitInfo: Object
  },

  components: {
    CourseSelect,
    MultipleChoice,
    createSubject
  },

  computed: {
    weekList() {
      return this.getWeekList().filter(item => item.value !== "所有周数");
    }
  },

  data() {
    return {
      uploadUrl,
      showModal: false,
      showCreSub: false,
      homeworkInfo: {
        name: "",
        classify: "",
        weekNum: "",
        testingTime: 0,
        stopTimeList: []
      },
      homeworkCategory: [
        {
          value: "课时作业",
          label: "课时作业"
        },
        {
          value: "在线作业",
          label: "在线作业"
        }
      ]
    };
  },

  methods: {
    ...mapActions(["uploadclassHomework"]),

    // 监听选择时间日期函数
    timeOnChange(value) {
      let homeworkInfo = { ...this.homeworkInfo };
      homeworkInfo["stopTimeList"] = value;
      this.homeworkInfo = homeworkInfo;
    },

    // 提交表单
    async sumbit() {
      let {
        name,
        classify,
        weekNum,
        testingTime,
        stopTimeList
      } = this.homeworkInfo;
      if (!name || !classify || !weekNum || stopTimeList.length === 0) {
        return this.$Message.error("缺少必填信息");
      }
      if (classify === "课时作业") {
        return await addClassHomework({
          name,
          path: obj["path"],
          semester: this.sumbitInfo["semester"],
          week: weekNum,
          course: this.sumbitInfo["course"],
          course_id: this.sumbitInfo["course_id"],
          teacher: this.sumbitInfo["teacher"],
          startime: stopTimeList[0],
          fintime: stopTimeList[1]
        });
      }
    },

    // 新建在线作业题目
    createSubject() {
      let { name, classify, stopTimeList } = this.homeworkInfo;
      if (!name || !classify || stopTimeList.length === 0) {
        return this.$Message.error("缺少必填信息");
      }
      this.showCreSub = true;
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

    hanldeSuccess(file) {
      this.$Notice.success({
        title: "上传成功！",
        desc: ""
      });
    },

    goNext() {
      this.showModal = true;
    },

    goBack() {
      this.showModal = false;
    },

    // 新建题目确定事件
    dialogOk() {
      console.log("新建题目");
      this.showModal = false;
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../../global/public.less";

.containter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;

  p {
    font-size: 15px;
  }

  .create-subject-con {
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 100%;
  }

  .multiple-choice /deep/ .select-list {
    width: 250px;
  }

  .mar-top {
    margin-top: 20px;
  }

  .show-dialog-btn {
    width: 322px;
    margin-bottom: 30px;
  }
}
</style>
