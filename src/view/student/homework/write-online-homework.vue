<style lang="less" scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  //   padding-left: 10%;
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
      //   align-items: center;
      //   justify-content: center;
      .radio-item {
        margin-left: 15px;
      }
    }
    .checkbox-item {
      margin-left: 10px;
    }
    .text-input {
      width: 220px;
      margin-top: 10px;
    }
  }
  .count-down-con {
    position: absolute;
    top: 17%;
    right: 10%;
    display: flex;
    align-items: center;
    .count-down-text {
      font-size: 16px;
    }
  }
  .primary-color {
    color: #2d8cf0;
  }
  .submitBtn {
    align-self: center;
  }
  .subjectText {
    width: 220px;
    height: auto;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
}
</style>
<template>
  <div class="containter">

    <div class="count-down-con">
      <P class="count-down-text">倒计时：</P>
      <P class="count-down-text primary-color">20min</P>
    </div>

    <radio-item title="1、单选题" :outputSubject="firstSubject" @onChangeRadio="onChangeRadio" :ifEdit="false" />
    <radio-item title="2、单选题" :outputSubject="secondSubject" @onChangeRadio="onChangeRadio2" :ifEdit="false" />

    <div class="mar-bottom">
      <p class="input-title">3、多选题</p>
      <p class="subjectText">{{thirdSubject}}</p>
      <div class="radio-list">
        答案:
        <CheckboxGroup v-model="thirdChoice">
          <Checkbox label="A" class="checkbox-item"></Checkbox>
          <Checkbox label="B" class="checkbox-item"></Checkbox>
          <Checkbox label="C" class="checkbox-item"></Checkbox>
          <Checkbox label="D" class="checkbox-item"></Checkbox>
        </CheckboxGroup>
      </div>

    </div>

    <div class="mar-bottom">
      <p class="input-title">4、主观题</p>
      <p class="subjectText">{{fourthSubject}}</p>
      <Input v-model="fourthChoice" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入你的答案" class="text-input" />
    </div>

    <Button type="primary" @click="submit()" class="submitBtn">提交</Button>
  </div>

</template>
<script>
import RadioItem from '@/view/teacher/homework/smart/create-subject-radio-item';
export default {
  name: 'online-homework',
  data() {
    return {
      firstChoice: '',
      firstSubject: '钢铁是怎么炼成的?',
      secondChoice: '',
      secondSubject: '钢铁是怎么炼成的?',
      thirdChoice: [],
      thirdSubject: '钢铁是怎么炼成的?',
      fourthChoice: '',
      fourthSubject: '钢铁是怎么炼成的?',
    };
  },
  components: {
    RadioItem,
  },
  methods: {
    //监听子组件传过来的radio值
    onChangeRadio(data) {
      this.firstChoice = data.radioChoice;
    },
    onChangeRadio2(data) {
      this.secondChoice = data.radioChoice;
    },
    submit() {
      console.log(this.firstChoice, this.secondChoice);
    },
  },
  created() {},
  mounted() {},
};
</script>