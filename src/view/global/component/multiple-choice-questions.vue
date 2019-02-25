<template>
  <div class="check-box-item-con df-aic">
    <div class="check-box-left-con">
      <!-- 标题 -->
      <h2 class="input-title">
        {{ `${info["title"]}` }}

        <span class="ml-5" v-if="type !== 'create'">
          {{ `(${info["weighting"]}分)` }}
        </span>
      </h2>

      <!-- 显示题目 -->
      <p v-if="type !== 'create'">题目：{{ info["subject"] }}</p>

      <!-- 输入题目 -->
      <Input
        v-if="type === 'create'"
        type="textarea"
        :rows="3"
        v-model="subject"
        :placeholder="`第${info['title'].slice(0, 1)}题题目`"
        clearable
        style="width: 400px"
      />

      <!-- 多选框选择 -->
      <div class="radio-list mb-10">
        <p>答案:</p>
        <CheckboxGroup v-model="choice">
          <Checkbox label="A" class="checkbox-item" :disabled="isDisabled"
            >A</Checkbox
          >
          <Checkbox label="B" class="checkbox-item" :disabled="isDisabled"
            >B</Checkbox
          >
          <Checkbox label="C" class="checkbox-item" :disabled="isDisabled"
            >C</Checkbox
          >
          <Checkbox label="D" class="checkbox-item" :disabled="isDisabled"
            >D</Checkbox
          >
        </CheckboxGroup>
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
    info: Object,
    type: String
  },

  watch: {
    info(newVal, oldVal) {
      this.subject = this.info["subject"];
      this.choice = this.info["choice"];
    },

    subject(newVal, oldVal) {
      this.$emit("update:subject", newVal);
    },

    choice(newVal, oldVal) {
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
      choice: this.info["choice"],
      score: 60
    };
  }
};
</script>

<style lang='less' scoped>
@import "../public.less";

.check-box-item-con {
  widows: 100%;
  height: auto;

  p,
  span {
    font-size: 15px;
  }

  .check-box-left-con {
    .input-title {
      margin-bottom: 5px;
    }

    .radio-list {
      width: 100%;
      margin-top: 10px;
      display: flex;
      align-items: center;
    }

    .checkbox-item {
      margin-left: 21px;
    }
  }

  .reference-answer {
    margin-top: 10px;
  }
}
</style>
