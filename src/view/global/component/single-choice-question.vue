<template>
  <div class="radio-containter df-aic" v-if="!$tools.isEmptyObject(info)">
    <div class="radio-left-con">
      <!-- 标题和分值 -->
      <h2 class="input-title">
        {{ `${info["title"]}` }}

        <span class="ml-5" v-if="type !== 'create'">
          {{ `(${info["weighting"]}分)` }}
        </span>
      </h2>

      <!-- 显示题目 -->
      <p v-if="type !== 'create'">题目：{{ info["subject"] }}</p>

      <!-- 输入题目 -->
      <div class="df-aic" v-if="type === 'create'">
        <Input
          type="textarea"
          v-model="subject"
          :rows="3"
          :placeholder="`第${info['title'].slice(0, 1)}题题目`"
          clearable
          style="width: 400px"
        />
      </div>

      <!-- 按钮组 -->
      <div class="radio-list mb-10">
        <span>答案:</span>

        <RadioGroup v-model="radioChoice">
          <Radio class="radio-item" label="A" :disabled="isDisabled">A</Radio>
          <Radio class="radio-item" label="B" :disabled="isDisabled">B</Radio>
          <Radio class="radio-item" label="C" :disabled="isDisabled">C</Radio>
          <Radio class="radio-item" label="D" :disabled="isDisabled">D</Radio>
        </RadioGroup>
      </div>

      <div class="df-aic" v-if="type === 'create'">
        <span>分值：</span>
        <InputNumber
          :max="10"
          :min="1"
          v-model="info['weighting']"
        ></InputNumber>
      </div>

      <!-- 参考答案 -->
      <div class="reference-answer" v-if="type === 'check' || type === 'score'">
        <span>参考答案：</span>
        <span class="green">{{ info["referenceAnswer"] }}</span>
      </div>

      <!-- 评分 -->
      <div class="radio-list" v-if="type === 'score' || type === 'check'">
        <span>评分：</span>

        <span class="blue" v-if="type === 'check'">{{ info["score"] }}</span>

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
@import "../public.less";

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

  .delete-subject-btn {
    margin-left: 10px;
  }

  .reference-answer {
    margin-top: 10px;
  }
}
</style>
