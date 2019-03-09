<template>
  <div class="radio-containter df-aic" v-if="!$tools.isEmptyObject(inputInfo)">
    <div class="radio-left-con">
      <!-- 标题和分值 -->
      <h2 class="input-title">
        {{ `${info["title"]}` }}

        <span class="ml-5" v-if="type !== 'create'">
          {{ `(${info["weighting"]}分)` }}
        </span>
      </h2>

      <!-- 显示题目 -->
      <p v-if="type !== 'create'" class="mt-10">题目：{{ info["subject"] }}</p>

      <!-- 输入题目 -->
      <div class="df-aic" v-if="type === 'create'">
        <Input
          type="textarea"
          :rows="3"
          :placeholder="`第${info['title'].slice(0, 1)}题题目`"
          :value="info['subject']"
          @on-change="subjectChange"
          clearable
          style="width: 650px"
        />
      </div>

      <!-- 按钮组 -->
      <div class="radio-list mb-10">
        <span>答案:</span>

        <RadioGroup :value="info['choice']" @on-change="choiceChange">
          <Radio
            class="radio-item"
            v-for="item in radioItem"
            :disabled="isDisabled"
            :key="item['label']"
            :label="item['label']"
          >
            <span class="choice-text"> {{ item["label"] }}</span>
            <span class="choice-text" v-if="type !== 'create'">
              、{{ item["option"] }}
            </span>

            <Input
              v-if="type === 'create'"
              style="width: 100px"
              size="small"
              v-model="item['option']"
              @on-change="optionChange"
            />
          </Radio>
        </RadioGroup>
      </div>

      <div class="df-aic" v-if="type === 'create'">
        <span>分值：</span>
        <InputNumber
          :max="100"
          :min="1"
          :value="info['weighting']"
          @on-change="weightingChange"
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
          :min="5"
          :step="10"
          @on-change="scoreChange"
        ></InputNumber>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { setlocalStorage } from "@tools";

export default {
  props: {
    index: Number, // 题目索引
    type: String
  },

  computed: {
    ...mapState({
      inputInfo: state => state.homework.inputInfo
    }),

    isDisabled() {
      return this.type === "score" || this.type === "check" ? true : false;
    },

    info() {
      return this.inputInfo[this.index];
    }
  },

  data() {
    return {
      radioItem: [
        {
          label: "A",
          option: ""
        },
        {
          label: "B",
          option: ""
        },
        {
          label: "C",
          option: ""
        },
        {
          label: "D",
          option: ""
        }
      ]
    };
  },

  mounted() {
    this.setRadioItem();
  },

  methods: {
    ...mapMutations(["setInputInfo"]),

    setRadioItem() {
      let optionList = this.radioItem.map((item, index) => {
        return {
          label: item["label"],
          option: this.info["optionList"][index]["option"]
        };
      });
      this.radioItem = optionList;
    },

    // 更新vuex的inputInfo最新值
    subjectChange(e) {
      let inputInfo = this.inputInfo;
      inputInfo[this.index]["subject"] = e.target.value;
      this.setInputInfo(inputInfo);
    },

    choiceChange(value) {
      let inputInfo = this.inputInfo;
      inputInfo[this.index]["choice"] = value;
      setlocalStorage("inputInfo", inputInfo);
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
    },

    optionChange(e) {
      let inputInfo = this.inputInfo;
      inputInfo[this.index]["optionList"] = this.radioItem;
      this.setInputInfo(inputInfo);
    }
  }
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
        margin-left: 10px;

        .choice-text {
          font-size: 14px;
        }
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
