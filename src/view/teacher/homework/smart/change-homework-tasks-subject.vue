<template>
  <div class="containters">

    <h2>修改任务信息</h2>

    <Divider />

    <SubjectType
      class="mar-bottom"
      v-for="(item,index) in inputInfo"
      type='create'
      :key="index"
      :inputInfo='item'
    />

    <div class="btnGround">
      <Button
        type="primary"
        size='large'
        @click="$emit('goBack')"
      >上一步</Button>

      <Button
        type="primary"
        size='large'
        @click="submit"
      >提交</Button>
    </div>

  </div>
</template>

<script>
import SubjectType from "@/view/global/component/show-subject-different-types";

export default {
  name: "create-subject",

  props: {
    homeworkInfo: Object
  },

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
      this.$Message.success("成功");
    },

    onChangeSubject(data) {
      this.inputInfo[0]["subject"] = data.subject;
    },

    onChangeSubject2(data) {
      this.inputInfo[1]["subject"] = data.subject;
    },

    onChangeRadio(data) {
      this.inputInfo[0]["choice"] = data.radioChoice;
    },

    onChangeRadio2(data) {
      this.inputInfo[1]["choice"] = data.radioChoice;
    }
  }
};
</script>

<style lang="less" scoped>
.containters {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  padding: 0 1%;

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

      .radio-item {
        margin-left: 15px;
      }
    }

    .checkbox-item {
      margin-left: 21px;
    }
  }

  .btnGround {
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
