<template>
  <div class="fill-the-queation-con df-aic">
    <div class="fill-the-queation-left-con">
      <!-- 标题 -->
      <h2 class="input-title">
        {{ `${info["title"]}` }}

        <span class="ml-5" v-if="type !== 'create'">
          {{ `(${info["weighting"]}分)` }}
        </span>
      </h2>

      <div v-if="type === 'score' || type === 'check'">
        <div
          class="df-aic w100"
          v-for="(item, index) in info['subject']"
          :key="index"
        >
          <div class="mb-20 w100">
            <!-- 显示的题目 -->
            <div class="df mb-10 w100">
              <p>({{ index + 1 }})</p>
              <p class="ml-5" v-if="type !== 'create'">
                {{ item["subject"] }}
              </p>
            </div>

            <!-- 参考答案和显示的回答 -->
            <div class="df-fdc">
              <p class="mb-10">
                回答：
                <span class="blue">
                  {{ item["answer"] }}
                </span>
              </p>

              <div v-if="type === 'check' || type === 'score'">
                <p>
                  参考答案：
                  <span class="green">
                    {{ item["referenceAnswer"] }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="df mb-10"
        v-for="(item, index) in info['subject']"
        :key="index"
        v-show="type === 'create' || type === 'testing'"
      >
        <div class="df-fdc">
          <!-- 显示的题目 -->
          <div class="df mb-10 w100">
            <p>({{ index + 1 }})</p>
            <p v-if="type !== 'create'" class="ml-10">{{ item["subject"] }}</p>
          </div>

          <!-- 输入题目 -->
          <div class="df-aic mb-10" v-if="type === 'create'">
            <Input
              type="textarea"
              :rows="3"
              :value="item['subject']"
              @on-change="subjectChange($event, index)"
              :placeholder="`请输入题目`"
              clearable
              style="width: 400px"
            />

            <Button class="add-fill-item-btn" @click="addFillItem(index)"
              >添加填空项</Button
            >

            <Button
              v-if="item['showCreSubjectBtn']"
              class="add-fill-item-btn"
              @click="addNewSubject"
              >添加填空题</Button
            >

            <Button
              type="error"
              class="add-fill-item-btn"
              @click="$emit('delFillSubject', index)"
              >删除该题</Button
            >
          </div>

          <!-- 填写填空题答案 -->
          <Input
            class="mb-10"
            type="textarea"
            :rows="3"
            :value="
              type === 'create'
                ? item['referenceAnswer']
                : type === 'testing'
                ? item['answer']
                : ''
            "
            @on-change="choiceChange($event, index)"
            placeholder="请输入填空题答案"
            clearable
            style="width: 400px"
          />
        </div>
      </div>

      <div class="df-aic mb-10" v-if="type === 'create'">
        <span>分值：</span>
        <InputNumber
          :max="100"
          :min="1"
          :value="info['weighting']"
          @on-change="weightingChange"
        ></InputNumber>
      </div>

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
    pIndex: Number, // 题目索引
    type: String
  },

  computed: {
    ...mapState({
      inputInfo: state => state.homework.inputInfo
    }),

    info() {
      return this.inputInfo[this.pIndex];
    }
  },

  data() {
    return {};
  },

  methods: {
    ...mapMutations(["setInputInfo"]),

    // 更新vuex的inputInfo最新值
    subjectChange(e, index) {
      let inputInfo = this.inputInfo;
      inputInfo[this.pIndex]["subject"][index]["subject"] = e.target.value;
      this.setInputInfo(inputInfo);
    },

    choiceChange(e, index) {
      let inputInfo = this.inputInfo;
      inputInfo[this.pIndex]["subject"][index]["referenceAnswer"] =
        e.target.value;
      this.setInputInfo(inputInfo);
    },

    weightingChange(value, index) {
      let inputInfo = this.inputInfo;
      inputInfo[this.pIndex]["weighting"] = value;
      this.setInputInfo(inputInfo);
    },

    scoreChange(value) {
      let inputInfo = this.inputInfo;
      inputInfo[this.pIndex]["score"] = value;
      this.setInputInfo(inputInfo);
    },

    // 添加填空项
    addFillItem(index) {
      let inputInfo = this.inputInfo;
      let strArr = inputInfo[index]["subject"].split(" ");
      strArr.push(" _____ ");
      inputInfo[index]["subject"] = strArr.join("");
      this.setInputInfo(inputInfo);
    },

    // 添加题目
    addNewSubject() {
      let inputInfo = this.inputInfo;
      inputInfo[this.pIndex]["subject"].forEach((item, index) => {
        if (item["showCreSubjectBtn"]) {
          item["showCreSubjectBtn"] = false;
        }
      });
      inputInfo[this.pIndex]["subject"].push({
        subject: "",
        answer: "",
        showCreSubjectBtn: true
      });
      this.setInputInfo(inputInfo);
    },

    // 删除题目
    delSubject(index) {
      let inputInfo = this.inputInfo;
      inputInfo[this.pIndex]["subject"].splice(index, 1);
      this.setInputInfo(inputInfo);
    }
  }
};
</script>

<style lang='less' scoped>
@import "../public.less";

.fill-the-queation-con {
  width: 100%;
  height: auto;

  p,
  span {
    font-size: 15px;
    line-height: 27px;
  }

  .add-fill-item-btn {
    margin-left: 10px;
  }

  .radio-list {
    width: 100%;
    margin-top: -10px;
    display: flex;
    align-items: center;
  }

  .show-subject {
    font-size: 20px;
  }

  .fill-the-queation-left-con {
    width: 100%;

    .input-title {
      margin-bottom: 5px;
    }

    .subtitle {
      height: 70px;
      margin-right: 10px;
    }
  }

  .output-score {
    color: green;
  }
}
</style>
