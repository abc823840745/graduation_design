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

      <SubjectType
        class="mar-bottom"
        v-for="(item,index) in inputInfo"
        type='check'
        :key="index"
        :inputInfo='item'
      />

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
import SubjectType from "@/view/global/show-subject-different-types";

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
          subject: "钢铁是怎么炼成的?",
          title: "1、单选题",
          choice: "A",
          referenceAnswer: "A",
          score: 20
        },
        {
          subjectType: "多选题",
          subject: "钢铁是怎么炼成的?",
          title: "2、多选题",
          choice: ["A", "B"],
          referenceAnswer: ["A", "B"],
          score: 20
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
          choice: "填空题回答",
          referenceAnswer: "填空题参考答案",
          score: 0
        },
        {
          subjectType: "问答题",
          subject: "钢铁是怎么炼成的?",
          title: "4、问答题",
          choice: "飞龙在天双龙出海",
          referenceAnswer: "问答题参考答案",
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
