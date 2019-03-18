<template>
  <div class="containter">
    <CourseSelect @goNext="goNext" v-show="!showSubHouse" />
    <SubjectHouse v-show="showSubHouse" />
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
      showSubHouse: false
    };
  },

  methods: {
    goNext(info) {
      console.log(info);
      this.showSubHouse = true;
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
