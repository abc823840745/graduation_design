<template>
  <div class="essay-question df-aic">
    <div class='df-fdc'>
      <!-- 标题 -->
      <h2 class="input-title mb-5">
        {{`${info['title']} (${info['weighting']}分)`}}
      </h2>

      <!-- 显示的题目 -->
      <p
        class="subjectText mb-20"
        v-if="type !== 'create'"
      > 题目：{{info['subject']}}</p>

      <!-- 输入题目 -->
      <Input
        class='mb-10'
        v-if="type === 'create'"
        type="textarea"
        :rows="3"
        v-model="subject"
        :placeholder="`第${info['title'].slice(0,1)}题题目`"
        clearable
        style="width: 400px"
      />

      <!-- 输入答案 -->
      <Input
        class='mb-10'
        v-if="type === 'create' || type === 'testing'"
        type="textarea"
        :rows="3"
        v-model="choice"
        placeholder="请输入问答题答案"
        clearable
        style="width: 400px"
      />

      <div
        class='df-aic'
        v-if="type === 'create'"
      >
        <span>分值：</span>
        <InputNumber
          :max="10"
          :min="1"
          v-model="info['weighting']"
        ></InputNumber>
      </div>

      <!-- 参考答案 -->
      <div
        class='mb-20'
        v-if="type === 'check' || type === 'score'"
      >
        <span>参考答案：</span>
        <span class='green'>{{info['referenceAnswer']}}</span>
      </div>

      <!-- 显示的回答 -->
      <div class='df-aic'>
        <div
          class='df-aic'
          v-if="type === 'check' || type === 'score'"
        >
          <p>
            回答:
            <span class="blue">{{info['choice']}}</span>
          </p>

        </div>
      </div>

      <!-- 评分 -->
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
    info: Object,
    type: String
  },

  watch: {
    info(newVal, oldVal) {
      this.subject = this.info["subject"];
      this.chocie = this.info["choice"];
    },

    subject(newVal, oldVal) {
      this.$emit("update:subject", newVal);
    },

    chocie(newVal, oldVal) {
      this.$emit("update:chocie", newVal);
    }
  },

  data() {
    return {
      subject: this.info["subject"],
      choice: this.info["choice"],
      score: 60
    };
  }
};
</script>

<style lang='less' scoped>
@import "../public.less";

.essay-question {
  width: 100%;
  height: auto;

  p,
  span {
    font-size: 15px;
  }

  .radio-list {
    width: 100%;
    margin-top: 10px;
    display: flex;
    align-items: center;
  }

  .mar-bottom {
    .input-title {
      margin-bottom: 5px;
    }
  }
}
</style>
