<template>
  <div class="containter">
    <div v-show="!showCreateSubject" class="create-subject-con">
      <h2>新建作业</h2>

      <Divider />

      <div class="mar-bottom mar-top df-aic">
        <h3>作业名称：</h3>
        <Input
          v-model="homeworkInfo['name']"
          placeholder="输入内容"
          clearable
          style="width: 250px"
        />
      </div>

      <div class="mar-bottom">
        <MultipleChoice
          semesterTip="作业类型"
          :defaultValue.sync="homeworkInfo['classify']"
          :semesterList="homeworkCategory"
          class="multiple-choice"
        />
      </div>

      <div class="mar-bottom">
        <MultipleChoice
          semesterTip="周数选择"
          :defaultValue.sync="homeworkInfo['weekNum']"
          :semesterList="weekList"
          class="multiple-choice"
        />
      </div>

      <div
        class="mar-bottom df-aic"
        v-show="homeworkInfo['classify'] === '在线作业'"
      >
        <h3>考试时间：</h3>
        <InputNumber :max="80" :min="5" v-model="homeworkInfo['testingTime']" />
        <span class="ml-5">分钟</span>
      </div>

      <div class="mar-bottom df-aic">
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

      <Button
        icon="ios-cloud-upload-outline"
        class="show-dialog-btn"
        @click="showDialog"
      >
        上传课件
      </Button>

      <Modal v-model="isShowDialog" title="上传" @on-ok="dialogOk">
        <Alert>注意：如果上传有误，请到任务中心查找对应任务进行重新上传</Alert>

        <!-- <input type="file" @change="hanldeUpload" /> -->

        <Upload
          class="upload-con"
          type="drag"
          :action="uploadUrl"
          :format="['doc', 'docx']"
          :on-success="hanldeSuccess"
          :on-format-error="handleFormatErr"
          :on-exceeded-size="handleMaxSize"
        >
          <div style="padding: 20px 0">
            <Icon
              type="ios-cloud-upload"
              size="52"
              style="color: #3399ff"
            ></Icon>
            <p>点击或拖拽到这里进行上传</p>
          </div>
        </Upload>
      </Modal>

      <div class="btnGround">
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

        <Button type="primary" @click="$emit('goBack')" long>返回</Button>
      </div>
    </div>

    <CreateSubject
      v-show="showCreateSubject"
      @goBack="goBack"
      :homeworkInfo="homeworkInfo"
    />
  </div>
</template>

<script>
import CreateSubject from "@teaHomework/smart/create-subject";
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import myMixin from "@/view/global/mixin";
import config from "@/config";
import { mapActions } from "vuex";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;
const uploadUrl = baseUrl + "/upload/teacher/exper";

export default {
  name: "my-homework",

  mixins: [myMixin],

  props: {
    sumbitInfo: Object
  },

  components: {
    CreateSubject,
    MultipleChoice
  },

  computed: {
    weekList() {
      return this.getWeekList().filter(item => item.value !== "所有周数");
    }
  },

  data() {
    return {
      uploadUrl,
      isShowDialog: false,
      showCreateSubject: false,
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
      this.showCreateSubject = true;
    },

    // 传递给子组件的上一步事件
    goBack() {
      this.showCreateSubject = false;
    },

    dialogOk() {
      this.isShowDialog = false;
    },

    showDialog() {
      this.isShowDialog = true;
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
