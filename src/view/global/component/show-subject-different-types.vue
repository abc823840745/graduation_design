<template>
  <div class="show-subject-different-types-con" v-if="inputInfo.length > 0">
    <RadioItem
      v-if="info['subjectType'] === '单选题'"
      :type="type"
      :index="index"
    />

    <CheckBoxItem
      v-if="info['subjectType'] === '多选题'"
      :type="type"
      :index="index"
    />

    <EssayQuestion
      v-if="info['subjectType'] === '问答题'"
      :type="type"
      :index="index"
    />

    <FillTheQuestion
      v-if="info['subjectType'] === '填空题'"
      @delFillSubject="delFillSubject"
      :disabled="disabled"
      :type="type"
      :pIndex="index"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    index: Number, // 题目索引
    disabled: Boolean, // 是否屏蔽填空题按钮
    type: String // 四种状态，老师评分、老师新建、学生做题、学生查看作业状态
  },

  components: {
    RadioItem: () => import("@/view/global/component/single-choice-question"),
    CheckBoxItem: () =>
      import("@/view/global/component/multiple-choice-questions"),
    EssayQuestion: () => import("@/view/global/component/essay-question"),
    FillTheQuestion: () => import("@/view/global/component/fill-the-question")
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
    delFillSubject(index) {
      this.$emit("delFillSubject", index);
    }
  }
};
</script>

<style lang='less' scoped>
.show-subject-different-types-con {
  width: 100%;
  height: auto;
}
</style>
