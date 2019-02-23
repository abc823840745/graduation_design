<template>
  <div class="containters">

    <h2>新建作业</h2>

    <Divider />

    <Alert
      show-icon
      v-if="inputInfo.length === 0"
    >请点击新建作业按钮快点新建作业吧！</Alert>

    <Modal
      v-model="isShowModal"
      title="新建作业"
      @on-ok="dialogOk"
    >
      <MultipleChoice
        semesterTip="题目类型"
        placeholder='请选择题目类型'
        :defaultValue.sync="subjectClassify"
        :semesterList="subjectClassifyList"
        class="multiple-choice"
      />
    </Modal>

    <div
      v-for="(item,index) in inputInfo"
      :key="index"
      v-show="inputInfo.length > 0"
    >
      <SubjectType
        class="mb-10 subject-type"
        type='create'
        :inputInfo='item'
        @delFillSubject='delFillSubject($event,index)'
      />

      <Button
        type="error"
        v-show="item['subjectType'] !== '填空题'"
        class="delete-subject-btn mb-30"
        @click="delSubject(index)"
      >删除该题</Button>
    </div>

    <div class="btn-ground">
      <Button
        class="bottom-btn"
        type="primary"
        long
        @click="createSubject"
      >新建题目</Button>
      <Button
        class="bottom-btn"
        type="primary"
        long
        @click="$emit('goBack')"
      >上一步</Button>
      <Button
        v-show="inputInfo.length > 0"
        class="bottom-btn"
        type="primary"
        long
        @click="submit"
      >提交</Button>
    </div>
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import SubjectType from "@/view/global/component/show-subject-different-types";

export default {
  name: "create-subject",

  props: {
    homeworkInfo: Object
  },

  components: {
    MultipleChoice,
    SubjectType
  },

  data() {
    return {
      isShowModal: false,
      inputInfo: [],
      subjectClassify: "单选题",
      subjectClassifyList: [
        {
          value: "单选题",
          label: "单选题"
        },
        {
          value: "多选题",
          label: "多选题"
        },
        {
          value: "填空题",
          label: "填空题"
        },
        {
          value: "问答题",
          label: "问答题"
        }
      ]
    };
  },

  methods: {
    submit() {
      if (
        !this.firstSubject ||
        !this.firstChoice ||
        !this.secondSubject ||
        !this.secondChoice ||
        !this.thirdSubject ||
        this.thirdChoice.length === 0
      ) {
        return this.$Message.error("缺少必填信息");
      }
      this.$Message.success("成功");
    },

    // 显示 dialog
    createSubject() {
      this.isShowModal = true;
    },

    // 新建题目
    dialogOk() {
      /**
       * @subjectType 标题类型
       * @subject 作业题目
       * @title 标题
       * @placeholder 输入框提示
       * @choice 选择的答案
       */
      let inputInfo = this.inputInfo;
      let subject =
        this.subjectClassify !== "填空题"
          ? ""
          : [
              {
                subject: "",
                answer: "",
                showCreSubjectBtn: true
              }
            ];
      inputInfo.push({
        subject,
        subjectType: this.subjectClassify,
        title: `${inputInfo.length + 1}、${this.subjectClassify}`,
        choice: this.subjectClassify === "多选题" ? [] : ""
      });
      this.inputInfo = inputInfo;
    },

    // 删除题目
    delSubject(index) {
      let inputInfo = this.inputInfo;
      inputInfo.splice(index, 1);
      inputInfo.forEach((item, index) => {
        item["title"] = `${index + 1}、${item["subjectType"]}`;
      });
      this.inputInfo = inputInfo;
    },

    // 删除填空题小题
    delFillSubject($event, index) {
      let inputInfo = this.inputInfo;
      let fillindex = $event;
      inputInfo[index]["subject"].splice(fillindex, 1);
      let subjectListLength = inputInfo[index]["subject"].length;

      // 删除的是最后一个才显示前一个的删除按钮
      if (fillindex - 1 >= 0 && subjectListLength === fillindex) {
        inputInfo[index]["subject"][fillindex - 1]["showCreSubjectBtn"] = true;
      }

      // 删除当前填空题并更新题号
      if (subjectListLength === 0) {
        inputInfo.splice(index, 1);
        inputInfo.forEach((item, index) => {
          item["title"] = `${index + 1}、${item["subjectType"]}`;
        });
      }
      this.inputInfo = inputInfo;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../global/public.less";

.containters {
  width: 100%;
  height: auto;
  padding: 0 1%;

  p {
    font-size: 15px;
  }

  .mar-bottom {
    margin-bottom: 30px;

    .input-title {
      margin-bottom: 5px;
    }

    .radio-list {
      width: 100%;
      margin-top: 10px;
      display: flex;
      align-items: center;

      .radio-item {
        margin-left: 20px;
      }
    }

    .checkbox-item {
      margin-left: 21px;
    }
  }

  .subject-type {
    width: 400px;
  }

  .delete-subject-btn {
    // width: 30px;
    // margin-left: 10px;
  }

  .btn-ground {
    display: flex;
    align-items: center;
    margin-top: 30px;

    .bottom-btn {
      width: 100px;
      margin-right: 10px;
    }
  }
}
</style>
