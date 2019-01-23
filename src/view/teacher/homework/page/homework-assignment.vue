<template>
  <div class="containter">
    <course-select
      v-if="!showCreSub"
      :goCreSub='goCreSub'
    />
    <my-homework v-else />
  </div>
</template>

<script>
import courseSelect from "../smart/course-select";
import myHomework from "../smart/my-homework";
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
