<template>
  <div class="containter">
    <CourseSelect @goNext="goNext" v-show="!showSubHouse" />
    <SubjectHouse
      v-show="showSubHouse"
      :courseInfo="courseInfo"
      @backCourse="backCourse"
    />
  </div>
</template>

<script>
export default {
  components: {
    CourseSelect: () => import("@teaHomework/smart/course-sel"),
    SubjectHouse: () => import("@teaHomework/smart/subject-house")
  },

  data() {
    return {
      showSubHouse: false,
      courseInfo: {}
    };
  },

  methods: {
    goNext(info) {
      this.showSubHouse = true;
      this.courseInfo = info;
    },

    backCourse() {
      this.showSubHouse = false;
    }
  }
};
</script>

<style lang='less' scoped>
.containter {
  width: 100%;
  height: auto;
}
</style>
