<template>
  <div class="essay-question df-aic">
    <div class="df-fdc">
      <!-- 标题 -->
      <h2 class="input-title">
        {{ `${info["title"]}` }}

        <span class="ml-5" v-if="type !== 'create'">
          {{ `(${info["weighting"]}分)` }}
        </span>
      </h2>

      <!-- 显示的题目 -->
      <p class="subjectText mb-20" v-if="type !== 'create'">
        题目：{{ info["subject"] }}
      </p>

      <!-- 输入题目 -->
      <Input
        class="mb-10"
        v-if="type === 'create'"
        type="textarea"
        :rows="3"
        :placeholder="`第${info['title'].slice(0, 1)}题题目`"
        :value="info['subject']"
        @on-change="subjectChange"
        clearable
        style="width: 400px"
      />

      <!-- 输入答案 -->
      <Input
        class="mb-10"
        :rows="3"
        v-if="type === 'create' || type === 'testing'"
        type="textarea"
        placeholder="请输入问答题答案"
        :value="info['choice']"
        @on-change="choiceChange"
        clearable
        style="width: 400px"
      />

      <div class="df-aic" v-if="type === 'create'">
        <span>分值：</span>
        <InputNumber
          :max="100"
          :min="1"
          :value="info['weighting']"
          @on-change="weightingChange"
        ></InputNumber>
      </div>

      <!-- 显示的回答 -->
      <div class="df-aic mb-20">
        <div class="df-aic" v-if="type === 'check' || type === 'score'">
          <p>
            回答:
            <span class="blue">{{ info["choice"] }}</span>
          </p>
        </div>
      </div>

      <!-- 参考答案 -->
      <div class="mb-10" v-if="type === 'check' || type === 'score'">
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
          :value="info['score']"
          @on-change="scoreChange"
        ></InputNumber>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    index: Number, // 题目索引
    type: String
  },

  computed: {
    ...mapState({
      inputInfo: state => state.homework.inputInfo
    }),

    info() {
      return this.inputInfo[this.index];
    }
  },

  data() {
    return {};
  },

  methods: {
    ...mapMutations(["setInputInfo"]),

    // 更新vuex的inputInfo最新值
    subjectChange(e) {
      let inputInfo = this.inputInfo;
      inputInfo[this.index]["subject"] = e.target.value;
      this.setInputInfo(inputInfo);
    },

    choiceChange(e) {
      let inputInfo = this.inputInfo;
      inputInfo[this.index]["choice"] = e.target.value;
      this.setInputInfo(inputInfo);
    },

    weightingChange(value) {
      let inputInfo = this.inputInfo;
      inputInfo[this.index]["weighting"] = value;
      this.setInputInfo(inputInfo);
    },

    scoreChange(value) {
      let inputInfo = this.inputInfo;
      inputInfo[this.index]["score"] = value;
      this.setInputInfo(inputInfo);
    }
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

  .input-title {
    margin-bottom: 5px;
  }
}
</style>
