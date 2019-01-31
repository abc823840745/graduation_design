<template>
  <div class="containter">
    <course-select
      v-show="!showCreSub"
      @goCreSub='goCreSub'
    />

    <my-homework
      v-show="showCreSub"
      @goBack='goBack'
    />
  </div>
</template>

<script>
import courseSelect from "@teaHomework/smart/course-select";
import myHomework from "@teaHomework/smart/my-homework";

export default {
  data() {
    return {
      showCreSub: false
    };
  },
  components: {
    courseSelect,
    myHomework
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
