<template>
  <div class="containters">
    <Modal
      fullscreen
      v-model="isShowModal"
      :title="type === 'create' ? '新建题目信息' : '修改题目信息'"
      @on-ok="$emit('modalOk')"
    >
      <Alert show-icon v-if="inputInfo.length === 0">
        请点击新建作业按钮快点新建作业吧！
      </Alert>

      <div
        v-for="(item, index) in inputInfo"
        :key="index"
        v-show="inputInfo.length > 0"
      >
        <SubjectType
          class="mb-10 subject-type"
          type="create"
          :index="index"
          @delFillSubject="delFillSubject($event, index)"
        />

        <Button
          type="error"
          v-show="item['subjectType'] !== '填空题'"
          class="delete-subject-btn mb-30"
          @click="delSubject(index)"
          >删除该题</Button
        >
      </div>

      <div class="btn-ground">
        <Dropdown @on-click="createSubject">
          <Button type="primary">
            新建题目
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="单选题">单选题</DropdownItem>
            <DropdownItem name="多选题">多选题</DropdownItem>
            <DropdownItem name="填空题">填空题</DropdownItem>
            <DropdownItem name="问答题">问答题</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Modal>
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import SubjectType from "@/view/global/component/show-subject-different-types";
import { mapMutations, mapState } from "vuex";

export default {
  name: "create-subject",

  props: {
    type: String, // 新建状态和编辑状态
    homeworkInfo: Object,
    showModal: Boolean
  },

  components: {
    MultipleChoice,
    SubjectType
  },

  watch: {
    showModal(newVal, oldVal) {
      this.isShowModal = newVal;
    },

    isShowModal(newVal, oldVal) {
      this.$emit("update:showModal", newVal);
      if (newVal === true) {
        this.setSubjectData();
      }
    }
  },

  computed: {
    ...mapState({
      inputInfo: state => state.homework.inputInfo,
      subjectList: state => state.homework.subjectList
    })
  },

  data() {
    return {
      isShowModal: false,
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

  mounted() {
    console.log(this.inputInfo);
  },

  methods: {
    ...mapMutations(["setInputInfo"]),

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

    // 新建题目
    createSubject(name) {
      /**
       * @subjectType 标题类型
       * @subject 作业题目
       * @title 标题
       * @placeholder 输入框提示
       * @choice 选择的答案
       */
      let inputInfo = this.inputInfo;
      let subject =
        name !== "填空题"
          ? ""
          : [
              {
                subject: "",
                answer: "",
                referenceAnswer: "",
                showCreSubjectBtn: true
              }
            ];
      let optionList = [
        {
          option: ""
        },
        {
          option: ""
        },
        {
          option: ""
        },
        {
          option: ""
        }
      ];
      inputInfo.push({
        subject,
        subjectType: name,
        title: `${inputInfo.length + 1}、${name}`,
        choice: name === "多选题" ? [] : "",
        optionList,
        weighting: 10
      });
      this.setInputInfo(inputInfo);
    },

    // 删除题目
    delSubject(index) {
      let inputInfo = this.inputInfo;
      inputInfo.splice(index, 1);
      inputInfo.forEach((item, index) => {
        item["title"] = `${index + 1}、${item["subjectType"]}`;
      });
      this.setInputInfo(inputInfo);
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
      this.setInputInfo(inputInfo);
    },

    // 修改模式渲染默认的题目
    setSubjectData() {
      if (this.type === "update") {
        let executeOnce = true;
        let formatData = this.subjectList.filter(item => {
          return item["name"] === this.homeworkInfo["name"];
        });
        let inputInfo = formatData[0]["questions"].reduce(
          (arr, item, index) => {
            let optionList = [
              {
                option: item["first_option"]
              },
              {
                option: item["sec_option"]
              },
              {
                option: item["third_option"]
              },
              {
                option: item["fourth_option"]
              }
            ];
            if (item["type"] !== "填空题") {
              arr.push({
                subject: item["context"],
                subjectType: item["type"],
                title: `${index + 1}、${item["type"]}`,
                choice:
                  item["type"] === "多选题" ? [item["answer"]] : item["answer"],
                optionList,
                weighting: item["grade"]
              });
            } else {
              if (executeOnce) {
                // 填空题只有一条大题，所以只执行一次
                executeOnce = false;
                let subject = formatData[0]["questions"].reduce((arr, item) => {
                  if (item["type"] === "填空题") {
                    arr.push({
                      subject: item["context"],
                      answer: "",
                      referenceAnswer: item["answer"],
                      showCreSubjectBtn: true
                    });
                  }
                  return arr;
                }, []);
                console.log(subject);
                arr.push({
                  subject,
                  subjectType: item["type"],
                  title: `${index + 1}、${item["type"]}`,
                  choice: item["answer"],
                  optionList,
                  weighting: item["grade"]
                });
              }
            }

            return arr;
          },
          []
        );
        this.setInputInfo(inputInfo);
      }
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

  .modal {
    position: absolute;
    z-index: 99999;
  }

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

    .bottom-btn {
      width: 100px;
      margin-right: 10px;
    }
  }
}
</style>
