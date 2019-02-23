<template>
  <div class="homework-detail-con">
    <div>

      <h2>作业评分</h2>

      <Divider />

      <SubjectType
        class="mb-30"
        v-for="(item,index) in inputInfo"
        type='score'
        :key="index"
        :inputInfo='item'
      />

      <div class="bottom-bar">
        <p class="total-score">总评分:
          <span class="total-score score">80</span>
        </p>
      </div>

      <div class="btnGround">
        <Button
          type="primary"
          @click="submit"
          long
        >提交评分</Button>

        <Button
          type="primary"
          @click="$emit('goBack')"
          long
        >返回</Button>
      </div>
    </div>

  </div>
</template>

<script>
import SubjectType from "@/view/global/component/show-subject-different-types";

export default {
  name: "check-online-homework-detail",

  components: {
    SubjectType
  },

  data() {
    return {
      inputInfo: [
        {
          subjectType: "单选题",
          subject:
            "我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？",
          title: "1、单选题",
          choice: "A",
          referenceAnswer: "A",
          score: 60,
          weighting: 20
        },
        {
          subjectType: "多选题",
          subject:
            "我们是机车吗？我们是机车吗我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？",
          title: "2、多选题",
          choice: ["B"],
          referenceAnswer: ["A"],
          score: 60,
          weighting: 20
        },
        {
          subjectType: "填空题",
          subject: [
            {
              subject:
                "《红楼梦》又名_________ ，是中国古典现实主义小说发展的顶峰。全书共置120回，前80回为曹雪芹所作，后40回一般认为是_________ 续写。《红楼梦》又名_________ ，是中国古典现实主义小说发展的顶峰。全书共置120回，前80回为曹雪芹所作，后40回一般认为是_________ 续写。",
              answer:
                "石头记 高鹗我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？",
              showCreSubjectBtn: false
            },
            {
              subject:
                "《红楼梦》又名_________ ，是中国古典现实主义小说发展的顶峰。全书共置120回，前80回为曹雪芹所作，后40回一般认为是_________ 续写。",
              answer:
                "石头记 高鹗我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？",
              showCreSubjectBtn: false
            }
          ],
          title: "3、填空题",
          choice: "填空题的回答",
          referenceAnswer:
            "填空题的参考答案我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？",
          score: 60,
          weighting: 20
        },
        {
          subjectType: "问答题",
          subject:
            "我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？",
          title: "4、问答题",
          choice:
            "我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？",
          referenceAnswer:
            "我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？我们是机车吗？",
          score: 60,
          weighting: 20
        }
      ]
    };
  },

  methods: {
    submit() {
      if (
        !this.inputInfo[0]["subject"] ||
        !this.inputInfo[0]["choice"] ||
        !this.inputInfo[1]["subject"] ||
        !this.inputInfo[1]["choice"] ||
        !this.inputInfo[2]["subject"] ||
        this.inputInfo[2]["choice"].length === 0
      ) {
        return this.$Message.error("缺少必填信息");
      }
      alert("提交表单");
    },

    goBack() {
      console.log("goback");
    },

    onChangeScore(data) {
      let inputInfo = { ...inputInfo };
      inputInfo[0]["score"] = data.score;
      this.inputInfo = inputInfo;
    },

    onChangeScore2(data) {
      let inputInfo = { ...inputInfo };
      inputInfo[1]["score"] = data.score;
      this.inputInfo = inputInfo;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../global/public.less";

.homework-detail-con {
  width: 100%;
  height: auto;
  padding: 1%;

  .bottom-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4%;

    .total-score {
      font-size: 18px;

      .score {
        color: #2d8cf0;
      }
    }
  }

  p {
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
    }

    .checkbox-item {
      margin-left: 10px;
    }
  }

  .btnGround {
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .btnGround button:nth-of-type(1) {
    margin-right: 5%;
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
