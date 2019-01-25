<template>
  <div class="containter">
    <radio-item
      title='1、单选题'
      @onChangeSubject="onChangeSubject"
      placeholder='第一题题目'
      @onChangeRadio="onChangeRadio"
    />

    <radio-item
      title='2、单选题'
      @onChangeSubject="onChangeSubject2"
      placeholder='第二题题目'
      @onChangeRadio="onChangeRadio2"
    />

    <div class="mar-bottom">
      <p class="input-title">3、多选题</p>
      <Input
        v-model="thirdSubject"
        placeholder="第三题题目"
        clearable
        style="width: 220px"
      />
      <div class="radio-list">
        答案:
        <CheckboxGroup v-model="thirdChoice">
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
      <p class="input-title">4、主观题</p>
      <Input
        v-model="fourthSubject"
        placeholder="第四题题目"
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
import RadioItem from "../smart/create-subject-radio-item";

export default {
  name: "create-subject",
  data() {
    return {
      firstSubject: "",
      secondSubject: "",
      thirdSubject: "",
      fourthSubject: "",
      firstChoice: "",
      secondChoice: "",
      thirdChoice: []
    };
  },
  props: {
    homeworkName: String,
    homeworkClassify: String,
    stopTimeList: Array
  },
  components: {
    RadioItem
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
    onChangeSubject(data) {
      this.firstSubject = data.subject;
    },
    onChangeSubject2(data) {
      this.secondSubject = data.subject;
    },
    onChangeRadio(data) {
      this.firstChoice = data.radioChoice;
    },
    onChangeRadio2(data) {
      this.secondChoice = data.radioChoice;
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
