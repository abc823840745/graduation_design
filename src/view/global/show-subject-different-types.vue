<template>
  <div class="show-subject-different-types-con">
    <RadioItem
      v-if="inputInfo['subjectType'] === '单选题'"
      :type='type'
      :info='inputInfo'
    />

    <CheckBoxItem
      v-if="inputInfo['subjectType'] === '多选题'"
      :type='type'
      :info='inputInfo'
    />

    <EssayQuestion
      v-if="inputInfo['subjectType'] === '问答题'"
      :type='type'
      :info='inputInfo'
    />

    <FillTheQuestion
      v-if="inputInfo['subjectType'] === '填空题'"
      :type='type'
      :info='inputInfo'
    />

  </div>
</template>

<script>
import RadioItem from "@/view/global/radio-item";
import CheckBoxItem from "@/view/global/check-box-item";
import EssayQuestion from "@/view/global/essay-question";
import FillTheQuestion from "@/view/global/fill-the-question";

export default {
  props: {
    inputInfo: Object,
    type: String // 四种状态，老师评分、老师新建、学生做题、学生查看作业状态
  },

  components: {
    RadioItem,
    CheckBoxItem,
    EssayQuestion,
    FillTheQuestion
  },

  data() {
    return {};
  }
};
</script>

<style lang='less' scoped>
.show-subject-different-types-con {
  width: 100%;
  height: auto;
}
</style>
