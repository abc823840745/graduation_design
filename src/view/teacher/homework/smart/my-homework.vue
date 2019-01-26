<style lang="less" scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  .mar-bottom {
    margin-bottom: 30px;
  }
  .mar-top {
    margin-top: 80px;
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
<template>
  <div class="containter">
    <div
      v-show="!showCreateSubject"
      class="containter"
    >
      <div class="mar-bottom mar-top">
        作业名称：
        <Input
          v-model="homeworkName"
          placeholder="输入内容"
          clearable
          style="width: 250px"
        />
      </div>

      <div class="mar-bottom">
        作业类型：
        <Select
          v-model="homeworkClassify"
          style="width:250px"
          @on-change="selOnChange"
        >
          <Option
            v-for="item in homeworkCategory"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </div>

      <div class="mar-bottom">
        截止日期：
        <DatePicker
          :value="stopTimeList"
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
          @click="homeworkClassify==='在线作业'?createSubject():sumbit()"
          long
        >{{homeworkClassify==='在线作业'? '新建题目':'新建作业任务'}}</Button>

        <Button
          type="primary"
          @click="$emit('showModal')"
          long
        >返回</Button>
      </div>

    </div>

    <create-subject
      v-show="showCreateSubject"
      @goBack="goBack"
      :homeworkName="homeworkName"
      :homeworkClassify="homeworkClassify"
      :stopTimeList="stopTimeList"
    />
  </div>

</template>

<script>
import createSubject from "@/view/teacher/homework/smart/create-subject.vue";

export default {
  name: "my-homework",
  data() {
    return {
      showCreateSubject: false,
      homeworkName: "",
      homeworkClassify: "",
      stopTimeList: [],
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
  components: {
    createSubject: createSubject
  },
  methods: {
    // 监听选择时间日期函数
    timeOnChange(value) {
      this.stopTimeList = value;
    },

    // 提交表单
    sumbit() {
      let { homeworkName, homeworkClassify, stopTimeList } = this;
      if (!homeworkName || !homeworkClassify || stopTimeList.length === 0) {
        return this.$Message.error("缺少必填信息");
      }
    },

    // 新建在线作业题目
    createSubject() {
      let { homeworkName, homeworkClassify, stopTimeList } = this;
      if (!homeworkName || !homeworkClassify || stopTimeList.length === 0) {
        return this.$Message.error("缺少必填信息");
      }
      this.showCreateSubject = true;
    },

    // 选择器监听事件
    selOnChange(value) {
      this.stopTimeList = [];
    },

    // 传递给子组件的上一步事件
    goBack() {
      this.showCreateSubject = false;
    }
  },
  created() {},
  mounted() {}
};
</script>
