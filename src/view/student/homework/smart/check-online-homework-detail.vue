<template>
  <div class="containters">
    <div>

      <div class="header-bar">
        <div class="homework-info">
          <span>在线作业</span>
          <span>课程：nodejs实验</span>
          <span>实验：堂上构建简单服务器</span>
          <span>时间：20分钟</span>
        </div>
      </div>

      <Divider />

      <RadioItem
        :inputInfo='inputInfo[0]'
        :ifEdit="false"
      />

      <RadioItem
        :inputInfo='inputInfo[1]'
        :ifEdit="false"
      />

      <div class="mar-bottom">
        <p class="input-title">{{inputInfo[2]['title']}}</p>
        <p class="subjectText">{{inputInfo[2]['subject']}}</p>
        <div class="radio-list">
          答案:
          <CheckboxGroup v-model="inputInfo[2]['choice']">
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
            v-if="inputInfo[2]['score']!==0"
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
          评分：<span class="scope">{{inputInfo[2]['score']}}</span>
        </div>
      </div>

      <div class="mar-bottom">
        <p class="input-title">{{inputInfo[3]['title']}}</p>
        <p class="input-title subjectText">{{inputInfo[3]['subject']}}</p>
        <p>答案: {{inputInfo[3]['choice']}}&nbsp;&nbsp;&nbsp;
          <Icon
            v-if="inputInfo[3]['score']!==0"
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
          评分：<span class="scope">{{inputInfo[3]['score']}}</span>
        </div>
      </div>

      <div class="bottom-bar">
        <p class="total-score">总评分:
          <span class="total-score score">80</span>
        </p>
        <Button
          type="primary"
          @click="$emit('goBack')"
        >上一步</Button>
      </div>
    </div>

  </div>
</template>

<script>
import RadioItem from "@teaHomework/smart/online-detail-radio-item";

export default {
  name: "check-online-homework-detail",

  components: {
    RadioItem
  },

  data() {
    return {
      inputInfo: [
        {
          subject: "钢铁是怎么炼成的?",
          title: "1、单选题",
          placeholder: "第一题题目",
          choice: "A",
          score: 20
        },
        {
          subject: "钢铁是怎么炼成的?",
          title: "2、单选题",
          placeholder: "第二题题目",
          choice: "B",
          score: 20
        },
        {
          subject: "钢铁是怎么炼成的?",
          title: "3、多选题",
          placeholder: "第三题题目",
          choice: ["A", "B"],
          score: 0
        },
        {
          subject: "钢铁是怎么炼成的?",
          title: "4、主观题",
          placeholder: "第四题题目",
          choice: "飞龙在天双龙出海",
          score: 40
        }
      ]
    };
  },

  methods: {}
};
</script>

<style lang="less" scoped>
.containters {
  width: 100%;
  height: auto;
  padding-left: 3%;

  .header-bar {
    width: 100%;

    .homework-info {
      span {
        font-size: 15px;
        margin-right: 3%;
      }
    }
  }

  .bottom-bar {
    display: flex;
    align-items: center;

    .total-score {
      font-size: 18px;
      margin-right: 9%;

      .score {
        color: #2d8cf0;
      }
    }
  }

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
