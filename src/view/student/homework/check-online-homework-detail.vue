<template>
  <div class="containter">
    <div>

      <radio-item
        title="1、单选题"
        :subject='firstSubject'
        :radioChoice="firstChoice"
        :outputScore="score1"
        :ifEdit="false"
      />

      <radio-item
        title="2、单选题"
        :subject='secondSubject'
        :radioChoice="secondChoice"
        :outputScore="score2"
        :ifEdit="false"
      />

      <div class="mar-bottom">
        <p class="input-title">3、多选题</p>
        <p class="subjectText">{{thirdSubject}}</p>
        <div class="radio-list">
          答案:
          <CheckboxGroup v-model="thirdChoice">
            <Checkbox
              label="A"
              class="checkbox-item"
              disabled
            ></Checkbox>
            <Checkbox
              label="B"
              class="checkbox-item"
              disabled
            ></Checkbox>
            <Checkbox
              label="C"
              class="checkbox-item"
              disabled
            ></Checkbox>
            <Checkbox
              label="D"
              class="checkbox-item"
              disabled
            ></Checkbox>
          </CheckboxGroup>
          <Icon
            v-if="score3!==0"
            type="md-checkmark"
            size='23'
            color='green'
          />
          <Icon
            v-else
            type="md-close"
            size='23'
            color='red'
          />
        </div>
        <div class="radio-list">
          评分：<span class="scope">{{score3}}</span>
        </div>
      </div>

      <div class="mar-bottom">
        <p class="input-title">4、主观题</p>
        <p class="input-title subjectText">{{fourthSubject}}</p>
        <p>答案: {{fourthChoice}}&nbsp;&nbsp;&nbsp;
          <Icon
            v-if="score4!==0"
            type="md-checkmark"
            size='23'
            color='green'
          />
          <Icon
            v-else
            type="md-close"
            size='23'
            color='red'
          />
        </p>

        <div class="radio-list">
          评分：<span class="scope">{{score4}}</span>
        </div>
      </div>

      <!-- <div class="btnGround">
        <Button
          type="primary"
          @click="goback"
        >上一步</Button>
      </div> -->

      <div>
        <p class="total-score">总评分:
          <span class="total-score score">80</span>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import RadioItem from '@/view/teacher/homework/smart/online-detail-radio-item';
export default {
  name: 'check-online-homework-detail',
  data() {
    return {
      firstSubject: '钢铁是怎么炼成的?',
      secondSubject: '钢铁是怎么炼成的?',
      thirdSubject: '钢铁是怎么炼成的?',
      fourthSubject: '钢铁是怎么炼成的?',
      firstChoice: 'A',
      secondChoice: 'B',
      thirdChoice: ['A', 'B'],
      fourthChoice: '飞龙在天双龙出海',
      score1: 20,
      score2: 20,
      score3: 0,
      score4: 40,
    };
  },
  components: {
    RadioItem,
  },
  methods: {
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
  p,
  span {
    font-size: 14px;
  }
  .total-score{
    font-size: 18px;
    .score{
      color: #2d8cf0;
    }
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
      .scope {
        color: #2d8cf0;
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
