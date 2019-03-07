<template>
  <div class="containter">
    <MultipleChoice
      semesterTip="学期选择"
      :defaultValue.sync="semesterList['value']"
      :semesterList="semesterList['list']"
      @onChange="semesterList['onChange']"
      class="flex-start"
    />

    <div class="course-list-wrap" v-show="courseList.length > 0">
      <div class="course-item" v-for="(item, index) in courseList" :key="index">
        <h3>{{ item.name }}</h3>
        <p class="course-code">课程代码：{{ item.code }}</p>
        <p class="course-code">教学班：{{ item.classes }}</p>
        <ButtonGroup class="course-btn">
          <Button
            shape="circle"
            type="info"
            @click.native="goNext(index)"
            class="select-course-btn"
          >
            选择课程
          </Button>
        </ButtonGroup>
      </div>
    </div>

    <div v-show="courseList.length === 0" class="none-data">
      <p>暂无数据</p>
    </div>

    <Page class="mar-top page" :total="totalCount" @on-change="changePage" />
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import myMixin from "@/view/global/mixin";
import { getTeaCourseList, getStuCourseList } from "@/api/course";
import { mapState } from "vuex";

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice
  },

  computed: {
    ...mapState({
      role: state => state.user.role,
      courseList: state => state.homework.courseList
    })
  },

  data() {
    return {
      totalCount: 0,
      semesterList: {
        value: this.getCurSchoolYear(),
        list: this.getSchoolYear(),
        onChange: this.changeYear
      }
    };
  },

  async mounted() {
    await this.getCourseList(this.semesterList["value"]);
  },

  methods: {
    goNext(index) {
      let obj = this.courseList[index];
      obj["semester"] = this.semesterList["value"];
      this.$emit("goNext", obj);
    },

    // 获取课程列表
    async getCourseList(curSemester, page) {
      let { year, semester } = this.$tools.dateFormat(curSemester);
      let res = await getTeaCourseList({
        year,
        semester,
        offset: page,
        limit: 10
      });
      this.totalCount = res.data.count;
      this.setCourseList(res.data.courseList);
    },

    // 切换页数
    async changePage(page) {
      await getCourseList(this.semesterList["value"], page);
    },

    // 学年选择筛选
    async changeYear(value) {
      await this.getCourseList(value);
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

  .none-data {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 400px;
  }

  .course-list-wrap {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: auto;
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