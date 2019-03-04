<template>
  <div class="containter">
    <MultipleChoice
      semesterTip="学期选择"
      :defaultValue.sync="semester"
      :semesterList="semesterList"
      class="flex-start"
    />

    <div class="course-list-wrap">
      <div class="course-item" v-for="(item, index) in courseList" :key="index">
        <h3>{{ item.name }}</h3>
        <p class="course-code">课程代码：{{ item.code }}</p>
        <p class="course-code">教学班：{{ item.classCode }}</p>
        <ButtonGroup class="course-btn">
          <Button
            shape="circle"
            type="info"
            @click.native="goNext()"
            class="select-course-btn"
          >
            选择课程
          </Button>
        </ButtonGroup>
      </div>
    </div>

    <Page :total="30" class="mar-top page" />
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import myMixin from "@/view/global/mixin";

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice
  },

  data() {
    return {
      semester: "2018-2019上学期",
      semesterList: this.getSchoolYear(),
      courseList: [
        {
          name: "新媒体实训",
          code: "GT2004",
          classCode: "ACM01"
        },
        {
          name: "JavaScript编程",
          code: "GT2004",
          classCode: "ACM01"
        },
        {
          name: "vue应用程序开发",
          code: "GT2004",
          classCode: "ACM01"
        },
        {
          name: "新媒体概论",
          code: "GT2004",
          classCode: "ACM01"
        },
        {
          name: "PhotoShop",
          code: "GT2004",
          classCode: "ACM01"
        },
        {
          name: "Java",
          code: "GT2004",
          classCode: "ACM01"
        },
        {
          name: "Flash",
          code: "GT2004",
          classCode: "ACM01"
        },
        {
          name: "html5",
          code: "GT2004",
          classCode: "ACM01"
        },
        {
          name: "React",
          code: "GT2004",
          classCode: "ACM01"
        },
        {
          name: "Angular",
          code: "GT2004",
          classCode: "ACM01"
        }
      ]
    };
  },

  methods: {
    goNext() {
      this.$emit("goNext");
    }
  }
};
</script>

<style lang="less" scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .page {
    align-self: flex-end;
    padding-right: 0.5%;
  }

  .course-list-wrap {
    display: flex;
    flex-wrap: wrap;
    margin: 0;

    .course-item {
      width: 220px;
      padding: 20px;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 2px 2px 2px #eee;
      margin-top: 20px;
      margin-right: 20px;
      text-align: center;
      color: #666;
      cursor: pointer;

      h3 {
        font-weight: 700;
        font-size: 16px;
      }

      .course-code {
        font-size: 12px;
      }

      .course-btn {
        margin-top: 10px;
        display: flex;
        justify-content: center;

        .select-course-btn {
          width: 200px;
        }
      }
    }
  }

  .course-containter {
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding-top: 3%;

    .card {
      width: 18.5%;
      height: 97px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .course-touch {
        width: 100%;
        height: 97px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .card-containter {
        width: 163px;
        height: auto;
        display: flex;

        .left-con {
          width: 40px;
          display: flex;
          align-items: center;

          .circle {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;

            p {
              color: #fff;
              font-size: 15px;
            }
          }
        }

        .right-con {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-left: 5%;
          overflow: hidden;
          text-overflow: ellipsis; //文本溢出显示省略号
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;

          p {
            font-size: 14px;
            font-weight: bold;
          }
        }
      }
    }

    .card-fill {
      width: 197px;
      height: 0;
    }
  }

  .flex-start {
    align-self: flex-start;
  }

  .mar-top {
    margin-top: 20px;
  }

  .table-con {
    width: 100%;
  }

  .content {
    margin-top: 20px;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    justify-content: center;
  }

  .course-name {
    width: 20%;
    height: 120px;
    display: flex;
    background: gainsboro;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 20px;
    border-radius: 10px;
    margin-right: 50px;
    margin-bottom: 20px;
  }

  .course-name:nth-child(4n) {
    margin-right: 0;
  }

  .select-con {
    display: flex;
    align-self: flex-start;
    width: 100%;
  }

  .select-title {
    margin-right: 10px;
  }

  .select-list {
    width: 200px;
  }

  .select-list-con {
    display: flex;
    align-items: center;
  }
}
</style>