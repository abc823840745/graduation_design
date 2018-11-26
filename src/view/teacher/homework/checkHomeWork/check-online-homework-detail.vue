<template>
  <div class="containter">
    <div>

      <radio-item title="1、单选题" subject='钢铁是怎么炼成的?' :radioChoice="firstChoice" @onChangeScore="onChangeScore" />

      <radio-item title="2、单选题" subject='钢铁是怎么炼成的?' :radioChoice="secondChoice" @onChangeScore="onChangeScore2" />

      <div class="mar-bottom">
        <p class="input-title">3、多选题</p>
        <p class="subjectText">钢铁是怎么炼成的?</p>
        <div class="radio-list">
          答案:
          <CheckboxGroup v-model="thirdChoice">
            <Checkbox label="A" class="checkbox-item" disabled></Checkbox>
            <Checkbox label="B" class="checkbox-item" disabled></Checkbox>
            <Checkbox label="C" class="checkbox-item" disabled></Checkbox>
            <Checkbox label="D" class="checkbox-item" disabled></Checkbox>
          </CheckboxGroup>
        </div>
        <div class="radio-list">
          评分：
          <InputNumber :max="100" :min="0" :step="10" v-model="score3"></InputNumber>
        </div>
      </div>

      <div class="mar-bottom">
        <p class="input-title">4、主观题</p>
        <p class="input-title subjectText">钢铁是怎么炼成的?</p>
        <p>答案: hahahahahah</p>
        <div class="radio-list">
          评分：
          <InputNumber :max="100" :min="0" :step="10" v-model="score4"></InputNumber>
        </div>
      </div>

      <div class="btnGround">
        <Button type="primary" @click="goBack">上一步</Button>
        <Button type="primary" @click="submit" class="btn-mar">提交</Button>
      </div>
    </div>

  </div>
</template>

<script>
import RadioItem from '../smart/online-detail-radio-item';
export default {
  name: 'check-online-homework-detail',
  data() {
    return {
      firstSubject: '',
      secondSubject: '',
      thirdSubject: '',
      fourthSubject: '',
      firstChoice: 'A',
      secondChoice: 'B',
      thirdChoice: ['A', 'B'],
      score1: 60,
      score2: 60,
      score3: 60,
      score4: 60,
    };
  },
  components: {
    RadioItem,
  },
  methods: {
    submit() {
      if (
        !this.firstSubject ||
        !this.firstChoice ||
        !this.secondSubject ||
        !this.secondChoice ||
        !this.thirdSubject ||
        this.thirdChoice.length === 0
      ) {
        return this.$Message.error('缺少必填信息');
      }
      alert('提交表单');
    },
    goBack() {
      console.log('goback');
    },

    onChangeScore(data) {
      this.score1 = data.score;
    },
    onChangeScore2(data) {
      this.score2 = data.score;
    },
  },
};
</script>

<style lang="less" scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  p {
    font-size: 14px;
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
      justify-content: flex-start;
      .radio-item {
        margin-left: 10px;
      }
    }
    .checkbox-item {
      margin-left: 10px;
    }
  }
  .btnGround {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn-mar {
    margin-left: 40px;
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
