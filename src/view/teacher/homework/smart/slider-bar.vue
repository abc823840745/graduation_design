<template>
  <div class="slider-bar w100">
    <h2 class="mb-10">{{ userName }}，{{ getDayType() }}</h2>
    <p>{{ getToday() }}</p>

    <Divider />

    <h2 class="mb-10">本学期的课程：</h2>

    <p v-for="item in courseList" :key="item['className']">
      {{ item["name"] }}
    </p>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { getTeaCourseList } from "@/api/course";
import myMixin from "@/view/global/mixin";

export default {
  mixins: [myMixin],

  computed: {
    ...mapState({
      userName: state => state.user.userName,
      role: state => state.user.role,
      courseList: state => state.homework.courseList
    })
  },

  data() {
    return {
      formatLesson: this.$tools.getSessionStorage("formatLesson"),
      year: new Date()
    };
  },

  async mounted() {
    // TODO: 获取学生课程列表
    await this.getCourseList();
  },

  methods: {
    ...mapMutations(["setCourseList"]),

    async getCourseList() {
      if (this.role === "student") return;
      let { year, semester } = this.$tools.dateFormat(this.getCurSchoolYear());
      let res = await getTeaCourseList({
        year,
        semester,
        offset: 1,
        limit: 999
      });
      this.setCourseList(res.data.courseList);
    },

    getDayType() {
      let date = new Date();
      let hours = date.getHours();
      if (hours >= 6 && hours <= 12) return "早上好";
      if (hours > 12 && hours <= 18) return "下午好";
      return "晚上好";
    },

    getToday() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let dayNum = date.getDay();
      return `${year}年${month < 10 ? "0" + month : month}月${
        day < 10 ? "0" + day : day
      }日 星期${dayNum}`;
    }
  }
};
</script>

<style lang='less' scoped>
.slider-bar {
  height: auto;

  p {
    font-size: 15px;
    margin-bottom: 5px;
  }
}
</style>
