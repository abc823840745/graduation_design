<template>
  <div class="homework-detail-con">
    <div>
      <RadioItem
        :inputInfo='inputInfo[0]'
        @onChangeScore="onChangeScore"
      />

      <RadioItem
        :inputInfo='inputInfo[1]'
        @onChangeScore="onChangeScore2"
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
              disabled
            ></Checkbox>
            <Checkbox
              label="B"
              class="checkbox-item"
              disabled
            ></Checkbox>
            <Checkbox
              label="C"
              class="checkbox-item"
              disabled
            ></Checkbox>
            <Checkbox
              label="D"
              class="checkbox-item"
              disabled
            ></Checkbox>
          </CheckboxGroup>
        </div>
        <div class="radio-list">
          <p>评分：</p>
          <InputNumber
            :max="100"
            :min="0"
            :step="10"
            v-model="inputInfo[2]['score']"
          ></InputNumber>
        </div>
      </div>

      <div class="mar-bottom">
        <p class="input-title">{{inputInfo[3]['title']}}</p>
        <p class="input-title subjectText">{{inputInfo[3]['subject']}}</p>
        <p>答案: {{inputInfo[3]['choice']}}</p>
        <div class="radio-list">
          <p>评分：</p>
          <InputNumber
            :max="100"
            :min="0"
            :step="10"
            v-model="inputInfo[3]['score']"
          ></InputNumber>
        </div>
      </div>

      <div class="bottom-bar">
        <p class="total-score">总评分:
          <span class="total-score score">80</span>
        </p>
      </div>

      <div class="btnGround">
        <Button
          type="primary"
          @click="submit"
          long
        >提交</Button>

        <Button
          type="primary"
          @click="$emit('goBack')"
          long
        >返回</Button>
      </div>
    </div>

  </div>
</template>

<script>
import RadioItem from "@teaHomework/smart/online-detail-radio-item";

export default {
  name: "check-online-homework-detail",

  components: {
    RadioItem
  },

  data() {
    return {
      inputInfo: [
        {
          subject: "我们是机车吗？",
          title: "1、单选题",
          placeholder: "第一题题目",
          choice: "A",
          score: 60
        },
        {
          subject: "我们是机车吗？",
          title: "2、单选题",
          placeholder: "第二题题目",
          choice: "B",
          score: 60
        },
        {
          subject: "我们是机车吗？",
          title: "3、多选题",
          placeholder: "第三题题目",
          choice: ["B", "C"],
          score: 60
        },
        {
          subject: "我们是机车吗？",
          title: "4、主观题",
          placeholder: "第四题题目",
          choice: "hahahahahahah",
          score: 60
        }
      ]
    };
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
      alert("提交表单");
    },

    goBack() {
      console.log("goback");
    },

    onChangeScore(data) {
      let inputInfo = { ...inputInfo };
      inputInfo[0]["score"] = data.score;
      this.inputInfo = inputInfo;
    },

    onChangeScore2(data) {
      let inputInfo = { ...inputInfo };
      inputInfo[1]["score"] = data.score;
      this.inputInfo = inputInfo;
    }
  }
};
</script>

<style lang="less" scoped>
.homework-detail-con {
  width: 100%;
  height: auto;
  padding-top: 2%;
  padding-left: 3%;

  .bottom-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4%;

    .total-score {
      font-size: 18px;

      .score {
        color: #2d8cf0;
      }
    }
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
      justify-content: flex-start;

      .radio-item {
        margin-left: 10px;
      }
    }

    .checkbox-item {
      margin-left: 10px;
    }
  }

  .btnGround {
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .btnGround button:nth-of-type(1) {
    margin-right: 5%;
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
