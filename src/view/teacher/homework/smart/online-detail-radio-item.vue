<template>
  <div class="containter">
    <div class="mar-bottom">
      <p class="input-title">{{inputInfo['title']}}</p>
      <p class="subjectText">{{inputInfo['subject']}}</p>

      <div class="radio-list">
        答案:
        <RadioGroup :value="inputInfo['choice']">
          <Radio
            class="radio-item"
            label='A'
            disabled
          >A</Radio>
          <Radio
            class="radio-item"
            label='B'
            disabled
          >B</Radio>
          <Radio
            class="radio-item"
            label='C'
            disabled
          >C</Radio>
          <Radio
            class="radio-item"
            label='D'
            disabled
          >D</Radio>
        </RadioGroup>

        <div v-if="!ifEdit">
          <Icon
            v-if="inputInfo['score']!==0"
            type="md-checkmark"
            size='23'
            color='green'
          />
          <Icon
            v-else
            type="md-close"
            size='23'
            color='red'
          />
        </div>

      </div>
      <div class="radio-list">
        评分：<span
          v-if="!ifEdit"
          class="output-score"
        >{{inputInfo['score']}}</span>
        <InputNumber
          v-if="ifEdit"
          :max="100"
          :min="0"
          :step="10"
          v-model="score"
          @on-change='onChangeScore'
        ></InputNumber>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    inputInfo: Object,
    ifEdit: { default: true, type: Boolean } // 评分栏是否可以编辑
  },

  data() {
    return {
      score: this.inputInfo["score"]
    };
  },

  methods: {
    onChangeScore() {
      this.$emit("onChangeInputNum", { score: this.score });
    }
  }
};
</script>

<style  lang="less" scoped>
.containter {
  width: 100%;
  p,
  span {
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
        margin-left: 15px;
      }
      .output-score {
        color: #2d8cf0;
      }
    }
    .checkbox-item {
      margin-left: 15px;
    }
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
