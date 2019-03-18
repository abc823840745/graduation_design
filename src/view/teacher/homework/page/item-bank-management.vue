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
import CourseSelect from "@teaHomework/smart/course-sel";
import SubjectHouse from "@teaHomework/smart/subject-house";

export default {
  components: {
    CourseSelect,
    SubjectHouse
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
