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
      <div v-if="type !== 'create'" class="df-fdc mt-10">
        <p>题目：</p>
        <pre style="font-size:16px;">{{ info["subject"] }}</pre>
      </div>

      <!-- 输入题目 -->
      <mavon-editor
        class="mavonEditor"
        v-if="type === 'create'"
        :subfield="false"
        :placeholder="`第${info['title'].slice(0, 1)}题题目`"
        :toolbars="toolbars"
        :value="info['subject']"
        @change="subjectChange"
      />

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
import { setlocalStorage, getlocalStorage } from "@tools";
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

    isDisabled() {
      return this.type === "score" || this.type === "check" ? true : false;
    },

    info() {
      return this.inputInfo[this.index];
    }
  },

  // watch: {
  //   originInputInfo(newVal, oldVal) {
  //     this.subject = newVal[this.index]["subject"];
  //   },
  //   inputInfo(newVal, oldVal) {
  //     this.subject = newVal[this.index]["subject"];
  //   }
  // },

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
    subjectChange(value, render) {
      let inputInfo = this.inputInfo;
      inputInfo[this.index]["subject"] = value;
      this.setInputInfo(inputInfo);
    },

    choiceChange(value) {
      let inputInfo = this.inputInfo;
      inputInfo[this.index]["choice"] = value;
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

  .mavonEditor {
    width: 650px;
    min-height: 200px;
    min-width: 300px;
    z-index: 1;
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
