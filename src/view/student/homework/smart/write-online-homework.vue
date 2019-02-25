<template>
  <div class="containter">
    <div class="header-bar">
      <div class="homework-info">
        <span>课程：nodejs实验</span>
        <span>实验：堂上构建简单服务器</span>
        <span>时间：20分钟</span>
      </div>

      <div class="count-down-con">
        <P class="count-down-text">倒计时：</P>
        <P class="count-down-text primary-color">
          <CountDown
            :isStartTimer="isStartTimer"
            :initialTime="1200"
            @callBack="endTimeDoing"
          >
            <h2 slot-scope="{ remainingTime }">
              {{ $tools.formatSeconds(remainingTime) }}
            </h2>
          </CountDown>
        </P>
      </div>
    </div>

    <Divider />

    <SubjectType
      class="mb-30"
      v-for="(item, index) in inputInfo"
      type="testing"
      :key="index"
      :inputInfo="item"
    />
  </div>
</template>

<script>
import SubjectType from "@/view/global/component/show-subject-different-types";
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
          referenceAnswer: "",
          weighting: 5
        },
        {
          subjectType: "多选题",
          subject: "钢铁是怎么炼成的?",
          title: "2、多选题",
          choice: [],
          referenceAnswer: "",
          weighting: 5
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
          referenceAnswer: "",
          weighting: 20
        },
        {
          subjectType: "问答题",
          subject: "钢铁是怎么炼成的?",
          title: "4、主观题",
          choice: "",
          referenceAnswer: "",
          weighting: 20
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

    endTimeDoing() {
      this.isStartTimer = false;
      console.log("结束后的回调");
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../global/public.less";

.containter {
  width: 100%;
  height: auto;
  padding: 0 1%;

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
    top: 1%;
    right: 5%;
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