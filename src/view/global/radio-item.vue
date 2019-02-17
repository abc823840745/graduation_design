<template>
  <div
    class="radio-containter df-aic"
    v-if="!$tools.isEmptyObject(info)"
  >

    <div class="radio-left-con">
      <h2 class="input-title">{{info['title']}}</h2>

      <p v-if="type !== 'create'">{{info['subject']}}</p>

      <Input
        type="textarea"
        v-if="type === 'create'"
        v-model="subject"
        :rows="2"
        :placeholder="`第${info['title'].slice(0,1)}题题目`"
        clearable
        style="width: 250px"
      />

      <div class="radio-list">
        <span>答案:</span>

        <RadioGroup v-model="radioChoice">
          <Radio
            class="radio-item"
            label='A'
            :disabled="isDisabled"
          >A</Radio>
          <Radio
            class="radio-item"
            label='B'
            :disabled="isDisabled"
          >B</Radio>
          <Radio
            class="radio-item"
            label='C'
            :disabled="isDisabled"
          >C</Radio>
          <Radio
            class="radio-item"
            label='D'
            :disabled="isDisabled"
          >D</Radio>
        </RadioGroup>
      </div>

      <div
        class='reference-answer'
        v-if="type === 'check' || type === 'score'"
      >
        <span>参考答案：</span>
        <span class='green'>{{info['referenceAnswer']}}</span>
      </div>

      <div
        class="radio-list"
        v-if="type === 'score' || type === 'check'"
      >
        <span>评分：</span>

        <span
          class="blue"
          v-if="type === 'check'"
        >{{info['score']}}</span>

        <InputNumber
          v-if="type === 'score'"
          :max="100"
          :min="0"
          :step="10"
          v-model="score"
        ></InputNumber>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: Object, // 输入的数据信息
    type: String
  },

  watch: {
    info(newVal, oldVal) {
      this.subject = this.info["subject"];
      this.radioChoice = this.info["choice"];
    },

    subject(newVal, oldVal) {
      this.$emit("update:subject", newVal);
    },

    radioChoice(newVal, oldVal) {
      this.$emit("update:choice", newVal);
    }
  },

  computed: {
    isDisabled() {
      return this.type === "score" || this.type === "check" ? true : false;
    }
  },

  data() {
    return {
      subject: this.info["subject"],
      radioChoice: this.info["choice"],
      score: 60
    };
  },

  methods: {}
};
</script>

<style  lang="less" scoped>
@import "../../public.less";

.radio-containter {
  width: 100%;

  p,
  span {
    font-size: 15px;
  }

  .radio-left-con {
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
  }

  .reference-answer {
    margin-top: 10px;
  }
}
</style>
