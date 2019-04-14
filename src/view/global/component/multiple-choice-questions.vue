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
      <div v-if="type !== 'create'" class="df-fdc mt-10">
        <p>题目：</p>
        <pre class="pre">{{ info["subject"] }}</pre>
      </div>

      <!-- 输入题目 -->
      <mavon-editor
        v-if="type === 'create'"
        class="mb-10 mavonEditor"
        :subfield="false"
        :placeholder="`第${info['title'].slice(0, 1) || 1}题题目`"
        :toolbars="toolbars"
        :value="info['subject']"
        @change="subjectChange"
      />

      <!-- 多选框选择 -->
      <div class="radio-list mb-10">
        <p>答案:</p>
        <CheckboxGroup v-model="choice" @on-change="choiceChange">
          <Checkbox
            class="checkbox-item"
            v-for="item in checkBoxItem"
            :key="item['label']"
            :label="item['label']"
            :disabled="isDisabled"
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
          </Checkbox>
        </CheckboxGroup>
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
          :min="0"
          :step="10"
          :value="parseInt(info['score'], 10)"
          @on-change="scoreChange"
        ></InputNumber>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { setlocalStorage, getlocalStorage, debounce } from "@tools";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";

export default {
  props: {
    index: Number, // 题目索引
    type: String
  },

  components: {
    mavonEditor
  },

  watch: {
    choice(newVal, oldVal) {
      if (newVal && Array.isArray(newVal)) {
        return (this.choice = newVal);
      } else if (newVal) {
        return (this.choice = newVal.split(","));
      }
    },

    originInputInfo(newVal, oldVal) {
      this.subject = newVal[this.index]["subject"];
    },

    inputInfo(newVal, oldVal) {
      this.subject = newVal[this.index]["subject"];
    }
  },

  computed: {
    ...mapState({
      inputInfo: state => state.homework.inputInfo,
      experId: state => state.homework.experId,
      originInputInfo: state => state.homework.originInputInfo
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
      choice: [],
      checkBoxItem: [
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
      ],
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: false, // 上角标
        subscript: false, // 下角标
        quote: false, // 引用
        ol: false, // 有序列表
        ul: false, // 无序列表
        link: false, // 链接
        imagelink: false, // 图片链接
        code: true, // code
        table: false, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: false, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: false, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: false, // 单双栏模式
        preview: false // 预览
      }
      // subject: ""
    };
  },

  mounted() {
    this.setChoice();
    this.setCheckBoxItem();
  },

  methods: {
    ...mapMutations(["setInputInfo"]),

    setChoice() {
      if (this.info["choice"]) {
        this.choice = this.info["choice"];
      }
    },

    setCheckBoxItem() {
      let optionList = this.info["optionList"].map((item, index) => {
        return {
          label: item["label"],
          option: item["option"]
        };
      });
      let flag = optionList.some(item => item.option);
      if (flag) {
        this.checkBoxItem = optionList;
      }
    },

    // 更新vuex的inputInfo最新值
    subjectChange: debounce(
      function(value, render) {
        let inputInfo = this.inputInfo;
        inputInfo[this.index]["subject"] = value;
        this.setInputInfo(inputInfo);
      },
      1000,
      true
    ),

    choiceChange(value) {
      let inputInfo = this.inputInfo;
      inputInfo[this.index]["choice"] = this.choice;
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
      inputInfo[this.index]["optionList"] = this.checkBoxItem;
      this.setInputInfo(inputInfo);
    }
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

  .pre {
    font-size: 16px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .mavonEditor {
    width: 660px;
    min-height: 200px;
    min-width: 300px;
    z-index: 1;
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
      margin-left: 9px;

      .choice-text {
        font-size: 14px;
        margin-right: 10px;
        margin-left: 5px;
      }
    }
  }

  .reference-answer {
    margin-top: 10px;
  }
}
</style>
