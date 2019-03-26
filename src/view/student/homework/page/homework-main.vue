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
import Echart from "@stuHomework/smart/echart";
import SliderBar from "@teaHomework/smart/slider-bar";
import { mapActions, mapState } from "vuex";
import myMixin from "@/view/global/mixin";
import { getCurSchoolYear } from "@tools";

export default {
  mixins: [myMixin],

  components: {
    Echart,
    SliderBar
  },

  computed: {
    ...mapState({
      stuId: state => state.user.stu_nmuber,
      courseList: state => state.homework.courseList
    }),

    params() {
      return this.courseList.map(item => ({
        teach_id: item["teacherNum"],
        course: item["name"]
      }));
    }
  },

  watch: {
    async courseList(newVal, oldVal) {
      await this.getMainData();
    }
  },

  data() {
    return {
      columns: [
        {
          title: "课程名",
          key: "course"
        },
        {
          title: "待完成实验数量",
          key: "unfinished"
        },
        {
          title: "已完成实验数量",
          key: "finished"
        }
      ],
      mainData: []
    };
  },

  methods: {
    ...mapActions(["getStuMainInfo"]),

    async getMainData() {
      let res = await this.getStuMainInfo({
        stu_id: this.stuId,
        semester: getCurSchoolYear(),
        obj: this.params
      });
      this.mainData = res;
    }
  }
};
</script>

<style lang='less' >
@import "../../../global/public.less";

.teacher-homework-main {
  .w(100%);

  .main-left-con {
    .w(70%);

    .echart-containter {
      .w(100%);
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
    .w(30%);
  }
}
</style>