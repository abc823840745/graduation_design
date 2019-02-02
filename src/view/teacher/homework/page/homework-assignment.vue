<template>
  <div class="containter">
    <CourseSelect
      v-show="!showCreSub"
      @goCreSub='goCreSub'
    />

    <MyHomework
      v-show="showCreSub"
      @goBack='goBack'
    />
  </div>
</template>

<script>
import CourseSelect from "@teaHomework/smart/course-select";
import MyHomework from "@teaHomework/smart/my-homework";

export default {
  components: {
    CourseSelect,
    MyHomework
  },

  data() {
    return {
      showCreSub: false
    };
  },

  methods: {
    goCreSub() {
      this.showCreSub = true;
    },
    goBack() {
      this.showCreSub = false;
    }
  }
};
</script>

<style>
.containter {
  width: 100%;
  height: auto;
}
</style>
