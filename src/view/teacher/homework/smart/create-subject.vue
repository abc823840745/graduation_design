<template>
  <div class="containters">
    <Modal
      fullscreen
      v-model="isShowModal"
      :ok-text="type === 'create' ? '确认新建' : '确认修改'"
      :loading="loading"
      :title="type === 'create' ? '新建题目信息' : '修改题目信息'"
      @on-ok="modalOk"
      @on-cancel="modalCancel"
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
            <DropdownItem name="填空题" :disabled="hasFillSub"
              >填空题</DropdownItem
            >
            <DropdownItem name="问答题">问答题</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown
          trigger="click"
          @on-click="subWarehouseOpen"
          style="margin-left: 20px"
        >
          <Button type="primary">
            从题库中选择
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="单选题">
              单选题
            </DropdownItem>
            <DropdownItem name="多选题">
              多选题
            </DropdownItem>
            <DropdownItem name="填空题" :disabled="hasFillSub">
              填空题
            </DropdownItem>
            <DropdownItem name="问答题">问答题</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Modal>

    <Modal v-model="modalOpen" fullscreen :title="`题库选择(${subType})`">
      <SubWarehouse
        :type="type"
        :subType="subType"
        @closeModal="subWarehouseClose"
      />

      <div slot="footer">
        <Button type="primary" size="large" @click="subWarehouseClose">
          返回
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import SubjectType from "@/view/global/component/show-subject-different-types";
import SubWarehouse from "@teaHomework/smart/subject-warehouse";
import { mapMutations, mapState } from "vuex";
import { debounce } from "@tools";

export default {
  name: "create-subject",

  props: {
    type: String, // 新建状态和编辑状态
    homeworkInfo: Object,
    showModal: Boolean
  },

  components: {
    MultipleChoice,
    SubjectType,
    SubWarehouse
  },

  watch: {
    showModal(newVal, oldVal) {
      this.isShowModal = newVal;
    },

    isShowModal(newVal, oldVal) {
      this.$emit("update:showModal", newVal);
      this.hasFillSubject();
    }
  },

  computed: {
    ...mapState({
      inputInfo: state => state.homework.inputInfo,
      optionList: state => state.homework.optionList,
      originalInfo: state => state.homework.originalInfo
    })
  },

  data() {
    return {
      isShowModal: false,
      modalOpen: false,
      loading: false,
      subjectClassify: "单选题",
      hasFillSub: false,
      subType: "",
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
    ...mapMutations(["setInputInfo", "setOptionList"]),

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
    createSubject(type) {
      /**
       * @subjectType 标题类型
       * @subject 作业题目
       * @title 标题
       * @placeholder 输入框提示
       * @choice 选择的答案
       */
      let index = 0;
      let inputInfo = this.inputInfo;
      let key = Math.round(new Date().getTime() / 1000).toString();
      let subject =
        type !== "填空题"
          ? ""
          : [
              {
                key,
                subject: "",
                answer: "",
                referenceAnswer: "",
                showCreSubjectBtn: true,
                status: "new"
              }
            ];
      let optionList = [
        { label: "A", option: "" },
        { label: "B", option: "" },
        { label: "C", option: "" },
        { label: "D", option: "" }
      ];
      let length = inputInfo.push({
        key: type === "填空题" ? "" : key,
        subject,
        subjectType: type,
        title: `${inputInfo.length + 1}、${type}`,
        choice: type === "多选题" ? [] : "",
        optionList,
        weighting: 10,
        status: "new"
      });
      index = length - 1;
      this.setInputInfo(inputInfo);

      // 编辑状态存一个题目索引用来记录题目修改情况
      if (this.type !== "create") {
        let optionList = this.optionList;
        optionList.push({
          key,
          subjectType: type,
          type: "add"
        });
        let filterData = this.reduceData(optionList);
        this.setOptionList(filterData);
      }
      this.hasFillSubject();
    },

    // 删除题目
    delSubject(index) {
      let inputInfo = this.inputInfo;
      let { key, id, subjectType } = inputInfo[index];
      let keys = key || id;
      inputInfo.splice(index, 1);
      inputInfo.forEach((item, index) => {
        item["title"] = `${index + 1}、${item["subjectType"]}`;
      });
      this.setInputInfo(inputInfo);
      if (this.type !== "create") {
        // 查询create数组是否有删除题目的索引，有就删除，没就添加到delete数组
        let optionList = this.optionList;
        let flag = optionList.some(
          item => item["key"] === keys && item["type"] === "add"
        );
        if (flag) {
          optionList = optionList.filter(item => item["key"] !== keys);
        } else {
          // 先过滤相同数组对象
          optionList = optionList.filter(item => item["key"] !== keys);
          optionList.push({
            type: "delete",
            subjectType,
            key: keys
          });
        }
        let filterData = this.reduceData(optionList);
        console.log(filterData);
        this.setOptionList(filterData);
      }
    },

    // 删除填空题小题
    delFillSubject($event, index) {
      let inputInfo = this.inputInfo;
      let fillindex = $event;
      let { key, subjectType } = inputInfo[index];
      let { id } = inputInfo[index]["subject"][fillindex];
      let keys = key || id;

      // 查询create数组是否有删除题目的索引，有就删除，没就添加到delete数组
      if (this.type !== "create") {
        let optionList = this.optionList;
        let flag = optionList.some(
          item => item["key"] === keys && item["type"] === "add"
        );
        if (flag) {
          optionList = optionList.filter(item => item["key"] !== keys);
        } else {
          // 先过滤相同数组对象
          optionList = optionList.filter(item => item["key"] !== keys);
          optionList.push({
            type: "delete",
            subjectType,
            key: keys
          });
        }
        let filterData = this.reduceData(optionList);
        this.setOptionList(filterData);
      }
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

    hasFillSubject() {
      this.hasFillSub = this.inputInfo.some(
        item => item["subjectType"] === "填空题"
      );
    },

    // 筛选需要update的题目，并对concat后的数组对象进行去重
    reduceData(optionList) {
      let list = optionList;
      let newArr = this.originalInfo.reduce((arr, item, index) => {
        if (!list[index] || item["id"] !== list[index]["key"]) {
          arr.push({
            type: "update",
            subjectType: item["type"],
            key: item["id"]
          });
        }
        return arr;
      }, []);
      list = list.concat(newArr);
      let obj = {};
      let filterData = list.reduce((arr, item) => {
        if (!obj[item["key"]]) {
          obj[item["key"]] = true;
          arr.push({
            key: item["key"],
            subjectType: item["subjectType"],
            type: item["type"]
          });
        }
        return arr;
      }, []);
      return filterData;
    },

    // 打开题库
    subWarehouseOpen(subType) {
      this.modalOpen = true;
      this.subType = subType;
    },

    // 关闭题目选择
    subWarehouseClose() {
      this.modalOpen = false;
    },

    modalOk: debounce(
      function() {
        this.loading = true;
        this.$emit("modalOk");
        this.loading = false;
      },
      2000,
      true
    ),

    modalCancel() {
      this.loading = true;
      this.$emit("modalCancel");
      this.loading = false;
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
