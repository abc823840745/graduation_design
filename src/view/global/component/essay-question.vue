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

      <!-- 输入答案 -->
      <mavon-editor
        v-if="type === 'create' || type === 'testing'"
        class="mt-10 mb-10 mavonEditor"
        :subfield="false"
        placeholder="请输入问答题答案"
        :toolbars="toolbars"
        :value="info['choice']"
        @change="choiceChange"
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
      <div class="df-aic mb-10">
        <div class="df-fdc" v-if="type === 'check' || type === 'score'">
          <p>{{ answerTip }}回答：</p>
          <pre class="blue pre">{{ info["choice"] }}</pre>
        </div>
      </div>

      <!-- 参考答案 -->
      <div class="mb-10" v-if="type === 'check' || type === 'score'">
        <p>参考答案：</p>
        <pre class="green pre">{{ info["referenceAnswer"] }}</pre>
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

  computed: {
    ...mapState({
      inputInfo: state => state.homework.inputInfo,
      experId: state => state.homework.experId,
      originInputInfo: state => state.homework.originInputInfo
    }),

    info() {
      return this.inputInfo[this.index];
    },

    answerTip() {
      switch (this.type) {
        case "score":
          return "学生";
        default:
          return "你的";
      }
    }
  },

  data() {
    return {
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
    };
  },

  methods: {
    ...mapMutations(["setInputInfo"]),

    // 更新vuex的inputInfo最新值
    subjectChange: debounce(function(value, render) {
      let inputInfo = this.inputInfo;
      inputInfo[this.index]["subject"] = value;
      this.setInputInfo(inputInfo);
    }),

    choiceChange: debounce(function(value, render) {
      let inputInfo = this.inputInfo;
      inputInfo[this.index]["choice"] = value;
      this.setInputInfo(inputInfo);
    }),

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

  .pre {
    font-size: 16px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .mavonEditor {
    width: 650px;
    min-height: 200px;
    min-width: 300px;
    z-index: 1;
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
