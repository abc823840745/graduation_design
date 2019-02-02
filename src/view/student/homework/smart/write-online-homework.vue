<template>
  <div class="containter">
    <div class="count-down-con">
      <P class="count-down-text">倒计时：</P>
      <P class="count-down-text primary-color">
        <CountDown
          :isStartTimer='isStartTimer'
          :initialTime='1200'
          @callBack='endTimeDoing'
        >
          <h2 slot-scope="{remainingTime}">
            {{$tools.formatSeconds(remainingTime)}}
          </h2>
        </CountDown>
      </P>
    </div>

    <RadioItem
      :inputInfo='inputInfo[0]'
      :ifEdit="false"
      @onChangeRadio="onChangeRadio"
    />
    <RadioItem
      :inputInfo='inputInfo[1]'
      :ifEdit="false"
      @onChangeRadio="onChangeRadio2"
    />

    <div class="mar-bottom">
      <p class="input-title">{{inputInfo[2]['title']}}</p>
      <p class="subjectText">{{inputInfo[2]['subject']}}</p>
      <div class="radio-list">
        答案:
        <CheckboxGroup v-model="inputInfo[2]['choice']">
          <Checkbox
            label="A"
            class="checkbox-item"
          ></Checkbox>
          <Checkbox
            label="B"
            class="checkbox-item"
          ></Checkbox>
          <Checkbox
            label="C"
            class="checkbox-item"
          ></Checkbox>
          <Checkbox
            label="D"
            class="checkbox-item"
          ></Checkbox>
        </CheckboxGroup>
      </div>

    </div>

    <div class="mar-bottom">
      <p class="input-title">{{inputInfo[3]['title']}}</p>
      <p class="subjectText">{{inputInfo[3]['subject']}}</p>
      <Input
        v-model="inputInfo[3]['choice']"
        type="textarea"
        :autosize="{minRows: 2,maxRows: 5}"
        placeholder="请输入你的答案"
        class="text-input"
      />
    </div>

    <div class="btnGround">
      <Button
        type="primary"
        @click="submit"
        class="submitBtn"
        long
      >提交</Button>
      <Button
        type="primary"
        @click="$emit('goBack')"
        class="submitBtn"
        long
      >上一步</Button>
    </div>
  </div>
</template>

<script>
import RadioItem from "@teaHomework/smart/create-subject-radio-item";
import CountDown from "@stuHomework/smart/count-down";

export default {
  name: "online-homework",

  components: {
    RadioItem,
    CountDown
  },

  data() {
    return {
      inputInfo: [
        {
          subject: "钢铁是怎么炼成的?",
          title: "1、单选题",
          placeholder: "第一题题目",
          choice: ""
        },
        {
          subject: "钢铁是怎么炼成的?",
          title: "2、单选题",
          placeholder: "第二题题目",
          choice: ""
        },
        {
          subject: "钢铁是怎么炼成的?",
          title: "3、多选题",
          placeholder: "第三题题目",
          choice: []
        },
        {
          subject: "钢铁是怎么炼成的?",
          title: "4、主观题",
          placeholder: "第四题题目",
          choice: ""
        }
      ],
      isStartTimer: true // 是否开启定时器
    };
  },

  methods: {
    // 监听子组件传过来的radio值
    onChangeRadio(data) {
      this.inputInfo[0]["choice"] = data.radioChoice;
    },

    onChangeRadio2(data) {
      this.inputInfo[1]["choice"] = data.radioChoice;
    },

    submit() {
      console.log(this.inputInfo[0]["choice"], this.inputInfo[1]["choice"]);
    },

    endTimeDoing() {
      this.isStartTimer = false;
      console.log("结束后的回调");
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
  .submitBtn:nth-of-type(1) {
    margin-right: 10px;
  }
  .subjectText {
    width: 220px;
    height: auto;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
  .btnGround {
    width: 21%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>