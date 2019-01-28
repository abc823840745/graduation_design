<template>
  <div class="containter">
    <radio-item
      :inputInfo='inputInfo[0]'
      @onChangeSubject="onChangeSubject"
      @onChangeRadio="onChangeRadio"
    />

    <radio-item
      :inputInfo='inputInfo[1]'
      @onChangeSubject="onChangeSubject2"
      @onChangeRadio="onChangeRadio2"
    />

    <div class="mar-bottom">
      <p class="input-title">{{inputInfo[2]['title']}}</p>
      <Input
        v-model="inputInfo[2]['subject']"
        :placeholder="inputInfo[2]['placeholder']"
        clearable
        style="width: 220px"
      />
      <div class="radio-list">
        答案:
        <CheckboxGroup v-model="inputInfo[2]['choice']">
          <Checkbox
            label="A"
            class="checkbox-item"
          >A</Checkbox>
          <Checkbox
            label="B"
            class="checkbox-item"
          >B</Checkbox>
          <Checkbox
            label="C"
            class="checkbox-item"
          >C</Checkbox>
          <Checkbox
            label="D"
            class="checkbox-item"
          >D</Checkbox>
        </CheckboxGroup>
      </div>
    </div>

    <div class="mar-bottom">
      <p class="input-title">{{inputInfo[3]['title']}}</p>
      <Input
        v-model="inputInfo[3]['subject']"
        :placeholder="inputInfo[3]['placeholder']"
        clearable
        style="width: 220px"
      />
    </div>

    <div class="btnGround">
      <Button
        type="primary"
        size='large'
        @click="$emit('goBack')"
      >上一步</Button>
      <Button
        type="primary"
        size='large'
        @click="submit"
      >提交</Button>
    </div>

  </div>
</template>

<script>
import RadioItem from "@teaHomework/smart/create-subject-radio-item";

export default {
  name: "create-subject",
  data() {
    return {
      inputInfo: [
        {
          subject: "haha",
          title: "1、单选题",
          placeholder: "第一题题目",
          choice: "A"
        },
        {
          subject: "haha",
          title: "2、单选题",
          placeholder: "第二题题目",
          choice: "B"
        },
        {
          subject: "haha",
          title: "3、多选题",
          placeholder: "第三题题目",
          choice: ["A", "B"]
        },
        {
          subject: "haha",
          title: "4、主观题",
          placeholder: "第四题题目",
          choice: ""
        }
      ]
    };
  },
  props: {
    homeworkInfo: Object
  },
  components: {
    RadioItem
  },
  methods: {
    submit() {
      if (
        !this.inputInfo[0]["subject"] ||
        !this.inputInfo[0]["choice"] ||
        !this.inputInfo[1]["subject"] ||
        !this.inputInfo[1]["choice"] ||
        !this.inputInfo[2]["subject"] ||
        this.inputInfo[2]["choice"].length === 0
      ) {
        return this.$Message.error("缺少必填信息");
      }
      this.$Message.success("成功");
    },
    onChangeSubject(data) {
      this.inputInfo[0]["subject"] = data.subject;
    },
    onChangeSubject2(data) {
      this.inputInfo[1]["subject"] = data.subject;
    },
    onChangeRadio(data) {
      this.inputInfo[0]["choice"] = data.radioChoice;
    },
    onChangeRadio2(data) {
      this.inputInfo[1]["choice"] = data.radioChoice;
    }
  }
};
</script>

<style lang="less" scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  p {
    font-size: 14px;
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
      justify-content: center;
      .radio-item {
        margin-left: 15px;
      }
    }
    .checkbox-item {
      margin-left: 15px;
    }
  }
  .btnGround {
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
