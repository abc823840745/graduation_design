<template>
  <div class="containter">
    <div v-show="!showCreateSubject" class="change-homework-tasks-con">
      <h2>修改任务信息</h2>

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

      <div class="btnGround">
        <Button
          type="primary"
          @click="
            homeworkInfo['classify'] === '在线作业' ? createSubject() : sumbit()
          "
          long
          >{{
            homeworkInfo["classify"] === "在线作业"
              ? "修改题目"
              : "修改作业任务"
          }}</Button
        >

        <Button type="primary" @click="$emit('goBack')" long>返回</Button>
      </div>
    </div>

    <ChangeHomeworkTasksSubject
      v-show="showCreateSubject"
      @goBack="goBack"
      :homeworkInfo="homeworkInfo"
    />
  </div>
</template>

<script>
import ChangeHomeworkTasksSubject from "@teaHomework/smart/change-homework-tasks-subject";
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import myMixin from "@/view/global/mixin";

export default {
  name: "my-homework",

  mixins: [myMixin],

  props: {
    info: Object,
    classify: String
  },

  components: {
    ChangeHomeworkTasksSubject,
    MultipleChoice
  },

  computed: {
    weekList() {
      return this.getWeekList().filter(item => item.value !== "所有周数");
    }
  },

  data() {
    return {
      showCreateSubject: false,
      homeworkInfo: {
        name: this.info["name"],
        weekNum: this.info["week"],
        classify: this.classify,
        stopTimeList: [this.info["startime"], this.info["fintime"]]
      },
      homeworkCategory: this.getClassifyList()
    };
  },

  methods: {
    // 监听选择时间日期函数
    timeOnChange(value) {
      let homeworkInfo = { ...this.homeworkInfo };
      homeworkInfo["stopTimeList"] = value;
      this.homeworkInfo = homeworkInfo;
    },

    // 提交表单
    sumbit() {
      let { name, classify, stopTimeList } = this.homeworkInfo;
      if (!name || !classify || stopTimeList.length === 0) {
        return this.$Message.error("缺少必填信息");
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
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../global/public.less";

.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .change-homework-tasks-con {
    width: 100%;
    padding: 0 1%;
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

  .btnGround {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .btnGround button:nth-of-type(1) {
    margin-right: 5%;
  }
}
</style>