<template>
  <div class="teacher-homework-main df">
    <div class="main-left-con df-fdc">
      <Echart :data="mainData" />

      <div class="table-con df-fdc">
        <Table border class="table mb-10" :columns="columns" :data="mainData" />
      </div>
    </div>

    <div class="main-right-con">
      <SliderBar />
    </div>
  </div>
</template>

<script>
import Echart from "@teaHomework/smart/echart";
import SliderBar from "@teaHomework/smart/slider-bar";
import { mapActions, mapState } from "vuex";
import { getTeaCourseStudentList } from "@/api/course";
import { getCurSchoolYear } from "@tools";
import myMixin from "@/view/global/mixin";

export default {
  mixins: [myMixin],

  components: {
    Echart,
    SliderBar
  },

  computed: {
    ...mapState({
      teaId: state => state.user.stu_nmuber,
      courseList: state => state.homework.courseList
    })
  },

  watch: {
    async courseList(newVal, oldVal) {
      await this.getStuNum();
      await this.getMainData();
    }
  },

  data() {
    return {
      arr: [],
      mainData: [],
      columns: [
        {
          title: "课程名",
          key: "course"
        },
        {
          title: "未完成学生总数",
          key: "unfinished"
        },
        {
          title: "完成学生总数",
          key: "finished"
        }
      ]
    };
  },

  methods: {
    ...mapActions(["getTeaMainInfo"]),

    async getMainData() {
      let res = await this.getTeaMainInfo({
        teach_id: this.teaId,
        semester: getCurSchoolYear(),
        obj: this.arr
      });
      this.mainData = res;
    },

    async getStuNum() {
      let arr = [];
      await Promise.all(
        this.courseList.map(async item => {
          let res = await getTeaCourseStudentList({
            id: item["id"]
          });
          arr.push({
            num: res.data.studentList.length,
            course: item["name"]
          });
        })
      );
      this.arr = arr;
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../../global/public.less";

.teacher-homework-main {
  width: 100%;

  .main-left-con {
    width: 70%;

    .echart-containter {
      width: 100%;
      display: flex;
    }

    .table-con {
      align-items: flex-end;
      width: 96.5%;
      padding-top: 3%;
      padding-left: 3%;
      box-sizing: border-box;

      .table {
        width: 100%;
      }
    }
  }

  .main-right-con {
    width: 30%;
  }
}
</style>
