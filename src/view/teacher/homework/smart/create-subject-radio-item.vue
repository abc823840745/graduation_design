<template>
  <div
    class="containters"
    v-if="!$tools.isEmptyObject(inputInfo)"
  >
    <div class="mar-bottom">
      <p class="input-title">{{inputInfo['title']}}</p>
      <p
        class="subjectText"
        v-if="!ifEdit"
      >{{inputInfo['subject']}}</p>
      <Input
        v-if="ifEdit"
        v-model="subject"
        :placeholder="inputInfo['placeholder']"
        clearable
        style="width: 220px"
      />
      <div class="radio-list">
        <span>答案:</span>
        <RadioGroup
          v-model="radioChoice"
          @on-change="onChangeRadio"
        >
          <Radio
            class="radio-item"
            label='A'
          >A</Radio>
          <Radio
            class="radio-item"
            label='B'
          >B</Radio>
          <Radio
            class="radio-item"
            label='C'
          >C</Radio>
          <Radio
            class="radio-item"
            label='D'
          >D</Radio>
        </RadioGroup>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    inputInfo: Object,
    ifEdit: { default: true, type: Boolean }
  },

  data() {
    return {
      subject: this.inputInfo["subject"],
      radioChoice: this.inputInfo["choice"]
    };
  },

  methods: {
    onChangeSubject() {
      this.$emit("onChangenSubject", { subject: this.subject });
    },

    onChangeRadio() {
      this.$emit("onChangeRadio", { radioChoice: this.radioChoice });
    }
  }
};
</script>

<style  lang="less" scoped>
.containters {
  width: 100%;
  p,
  span {
    font-size: 15px;
  }
  .mar-bottom {
    margin-bottom: 30px;
    .input-title {
      margin-bottom: 5px;
    }
    .radio-list {
      width: 100%;
      margin-top: 10px;
      display: flex;
      align-items: center;
      .radio-item {
        margin-left: 20px;
      }
    }
  }
  .subjectText {
    width: 220px;
    height: auto;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
}
</style>
