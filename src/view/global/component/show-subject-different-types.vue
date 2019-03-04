<template>
  <div class="show-subject-different-types-con">
    <RadioItem
      v-if="inputInfo[index]['subjectType'] === '单选题'"
      :type="type"
      :index="index"
    />

    <CheckBoxItem
      v-if="inputInfo[index]['subjectType'] === '多选题'"
      :type="type"
      :index="index"
    />

    <EssayQuestion
      v-if="inputInfo[index]['subjectType'] === '问答题'"
      :type="type"
      :index="index"
    />

    <FillTheQuestion
      v-if="inputInfo[index]['subjectType'] === '填空题'"
      @delFillSubject="delFillSubject"
      :type="type"
      :pIndex="index"
    />
  </div>
</template>

<script>
import RadioItem from "@/view/global/component/single-choice-question";
import CheckBoxItem from "@/view/global/component/multiple-choice-questions";
import EssayQuestion from "@/view/global/component/essay-question";
import FillTheQuestion from "@/view/global/component/fill-the-question";
import { mapState } from "vuex";

export default {
  props: {
    index: Number, // 题目索引
    type: String // 四种状态，老师评分、老师新建、学生做题、学生查看作业状态
  },

  components: {
    RadioItem,
    CheckBoxItem,
    EssayQuestion,
    FillTheQuestion
  },

  computed: {
    ...mapState({
      inputInfo: state => state.homework.inputInfo
    })
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
