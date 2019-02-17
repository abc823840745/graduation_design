<template>
  <div class="containter">

    <div class="header-bar">
      <div class="homework-info">
        <span>在线作业</span>
        <span>课程：nodejs实验</span>
        <span>实验：堂上构建简单服务器</span>
        <span>时间：20分钟</span>
      </div>

      <div class="count-down-con">
        <P class="count-down-text">倒计时：</P>
        <P class="count-down-text primary-color">
          <CountDown
            :isStartTimer='isStartTimer'
            :initialTime='1200'
            @callBack='endTimeDoing'
          >
            <h2 slot-scope="{remainingTime}">
              {{$tools.formatSeconds(remainingTime)}}
            </h2>
          </CountDown>
        </P>
      </div>
    </div>

    <Divider />

    <SubjectType
      class="mb-30"
      v-for="(item,index) in inputInfo"
      type='testing'
      :key="index"
      :inputInfo='item'
    />

    <!-- <RadioItem
      :inputInfo='inputInfo[0]'
      :ifEdit="false"
      @onChangeRadio="onChangeRadio"
    />
    <RadioItem
      :inputInfo='inputInfo[1]'
      :ifEdit="false"
      @onChangeRadio="onChangeRadio2"
    />

    <div class="mar-bottom">
      <p class="input-title">{{inputInfo[2]['title']}}</p>
      <p class="subjectText">{{inputInfo[2]['subject']}}</p>
      <div class="radio-list">
        <span>答案:</span>
        <CheckboxGroup v-model="inputInfo[2]['choice']">
          <Checkbox
            label="A"
            class="checkbox-item"
          ></Checkbox>
          <Checkbox
            label="B"
            class="checkbox-item"
          ></Checkbox>
          <Checkbox
            label="C"
            class="checkbox-item"
          ></Checkbox>
          <Checkbox
            label="D"
            class="checkbox-item"
          ></Checkbox>
        </CheckboxGroup>
      </div>

    </div>

    <div class="mar-bottom">
      <p class="input-title">{{inputInfo[3]['title']}}</p>
      <p class="subjectText">{{inputInfo[3]['subject']}}</p>
      <Input
        v-model="inputInfo[3]['choice']"
        type="textarea"
        :autosize="{minRows: 3,maxRows: 5}"
        placeholder="请输入你的答案"
        class="text-input"
      />
    </div> -->

    <div class="btnGround">
      <Button
        type="primary"
        @click="submit"
        class="submitBtn"
        long
      >提交</Button>
      <Button
        type="primary"
        @click="$emit('goBack')"
        class="submitBtn"
        long
      >上一步</Button>
    </div>
  </div>
</template>

<script>
import SubjectType from "@/view/global/show-subject-different-types";
import CountDown from "@stuHomework/smart/count-down";

export default {
  name: "online-homework",

  components: {
    SubjectType,
    CountDown
  },

  data() {
    return {
      inputInfo: [
        {
          subjectType: "单选题",
          subject: "钢铁是怎么炼成的?",
          title: "1、单选题",
          choice: "",
          referenceAnswer: ""
        },
        {
          subjectType: "多选题",
          subject: "钢铁是怎么炼成的?",
          title: "2、多选题",
          choice: [],
          referenceAnswer: ""
        },
        {
          subjectType: "填空题",
          subject: [
            {
              subject:
                "《红楼梦》又名_________ ，是中国古典现实主义小说发展的顶峰。全书共置120回，前80回为曹雪芹所作，后40回一般认为是_________ 续写。",
              answer: "",
              showCreSubjectBtn: false
            },
            {
              subject:
                "《红楼梦》又名_________ ，是中国古典现实主义小说发展的顶峰。全书共置120回，前80回为曹雪芹所作，后40回一般认为是_________ 续写。",
              answer: "",
              showCreSubjectBtn: false
            }
          ],
          title: "3、填空题",
          choice: "",
          referenceAnswer: ""
        },
        {
          subjectType: "问答题",
          subject: "钢铁是怎么炼成的?",
          title: "4、主观题",
          choice: "",
          referenceAnswer: ""
        }
      ],
      isStartTimer: true // 是否开启定时器
    };
  },

  methods: {
    // 监听子组件传过来的radio值
    onChangeRadio(data) {
      this.inputInfo[0]["choice"] = data.radioChoice;
    },

    onChangeRadio2(data) {
      this.inputInfo[1]["choice"] = data.radioChoice;
    },

    submit() {
      console.log(this.inputInfo[0]["choice"], this.inputInfo[1]["choice"]);
    },

    endTimeDoing() {
      this.isStartTimer = false;
      console.log("结束后的回调");
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../public.less";

.containter {
  width: 100%;
  height: auto;
  padding-left: 5%;
  .header-bar {
    width: 100%;
    .homework-info {
      span {
        font-size: 15px;
        margin-right: 3%;
      }
    }
  }
  p,
  span {
    font-size: 15px;
  }
  .mar-bottom {
    width: 100%;
    margin-bottom: 30px;
    .input-title {
      margin-bottom: 5px;
    }
    .radio-list {
      width: 100%;
      margin-top: 10px;
      display: flex;
      .checkbox-item {
        margin-left: 20px;
      }
    }
    .text-input {
      width: 50%;
      margin-top: 10px;
    }
  }
  .count-down-con {
    position: fixed;
    top: 18%;
    right: 10%;
    display: flex;
    align-items: center;
    .count-down-text {
      font-size: 16px;
    }
  }
  .primary-color {
    color: #2d8cf0;
  }
  .submitBtn {
    width: 10%;
  }
  .submitBtn:nth-of-type(1) {
    margin-right: 10px;
  }
  .subjectText {
    width: 50%;
    height: auto;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
  .btnGround {
    width: 100%;
    display: flex;
    align-items: center;
  }
}
</style>