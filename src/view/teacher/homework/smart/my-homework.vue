<template>
  <div class="containter">
    <div
      v-show="!showCreateSubject"
      class="create-subject-con"
    >

      <h2>新建作业</h2>

      <Divider />

      <div class="mar-bottom mar-top">
        作业名称：
        <Input
          v-model="homeworkInfo['name']"
          placeholder="输入内容"
          clearable
          style="width: 250px"
        />
      </div>

      <div class="mar-bottom">
        <MultipleChoice
          semesterTip='作业类型'
          :defaultValue.sync="homeworkInfo['classify']"
          :semesterList='homeworkCategory'
          class="multiple-choice"
        />
      </div>

      <div class="mar-bottom">
        <MultipleChoice
          semesterTip='周数选择'
          :defaultValue.sync="homeworkInfo['weekNum']"
          :semesterList='weekList'
          class="multiple-choice"
        />
      </div>

      <div class="mar-bottom">
        截止日期：
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
          @click="homeworkInfo['classify']==='在线作业'?createSubject():sumbit()"
          long
        >{{homeworkInfo['classify']==='在线作业'? '新建题目':'新建作业'}}</Button>

        <Button
          type="primary"
          @click="$emit('goBack')"
          long
        >返回</Button>
      </div>

    </div>

    <CreateSubject
      v-show="showCreateSubject"
      @goBack="goBack"
      :homeworkInfo='homeworkInfo'
    />
  </div>

</template>

<script>
import CreateSubject from "@teaHomework/smart/create-subject";
import MultipleChoice from "@teaHomework/smart/multiple-choice";

export default {
  name: "my-homework",

  components: {
    CreateSubject,
    MultipleChoice
  },

  data() {
    return {
      showCreateSubject: false,
      homeworkInfo: {
        name: "",
        classify: "",
        weekNum: "",
        stopTimeList: []
      },
      weekList: [
        {
          value: "第一周",
          label: "第一周"
        },
        {
          value: "第二周",
          label: "第二周"
        },
        {
          value: "第三周",
          label: "第三周"
        },
        {
          value: "第四周",
          label: "第四周"
        }
      ],
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
@import "../../../../public.less";

.containter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: auto;
  padding: 0 1%;

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
