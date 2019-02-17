<template>
  <div class="fill-the-queation-con df-aic">
    <div class="fill-the-queation-left-con">
      <h2 class="input-title">{{info['title']}}</h2>

      <!-- 题目、答案和参考答案 -->
      <div v-if="type === 'score' || type === 'check'">
        <div
          class="df-aic w100"
          v-for="(item,index) in subjectList"
          :key='index'
        >
          <div class="mb-20 w100">
            <div class="df mb-10 w100">
              <p>({{index+1}})</p>
              <p v-if="type !== 'create'">{{item['subject']}}</p>
            </div>

            <div class="df-fdc">
              <div
                class="mb-10"
                v-if="type === 'check' || type === 'score'"
              >
                <p>参考答案：
                  <span class='green'>
                    {{info['referenceAnswer']}}
                  </span>
                </p>
              </div>

              <p>回答：
                <span class="blue">
                  {{item['answer']}}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入和添加填空项 -->
      <div
        class="df mb-10"
        v-for="(item,index) in subjectList"
        :key="index"
        v-show="type === 'create' || type === 'testing'"
      >
        <div class="df-fdc">
          <div class="df mb-10 w100">
            <p>({{index+1}})</p>
            <p v-if="type !== 'create'">{{item['subject']}}</p>
          </div>

          <div
            class="df-aic mb-10"
            v-if="type === 'create'"
          >
            <Input
              type="textarea"
              :rows="3"
              v-model="item['choice']"
              :placeholder="`请输入题目`"
              clearable
              style="width: 250px"
            />

            <Button
              class="add-fill-item-btn"
              @click="addFillItem(index)"
            >添加填空项</Button>

            <Button
              v-if="item['showCreSubjectBtn']"
              class="add-fill-item-btn"
              @click="addNewSubject"
            >添加填空题</Button>
          </div>

          <Input
            type="textarea"
            :rows="3"
            v-model="item['answer']"
            placeholder="请输入填空题答案"
            clearable
            style="width: 250px"
          />
        </div>
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
    info: Object,
    type: String
  },

  data() {
    return {
      choice: this.info["choice"],
      answer: "",
      score: 60,
      subjectList: this.info["subject"]
    };
  },

  methods: {
    addFillItem(index) {
      let subjectList = this.subjectList;
      let strArr = subjectList[index]["choice"].toString().split();
      strArr.push(" ____ ");
      subjectList[index]["choice"] = strArr.join("");
      this.subjectList = subjectList;
    },

    addNewSubject() {
      let subjectList = this.subjectList;
      subjectList.forEach((item, index) => {
        if (item["showCreSubjectBtn"]) {
          item["showCreSubjectBtn"] = false;
        }
      });
      subjectList.push({
        choice: "",
        answer: "",
        showCreSubjectBtn: true
      });
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../public.less";

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
