<template>
  <div class="containter">
    <CourseSelect @goNext="goNext" />

    <MyHomework :modalOpen.sync="modalOpen" />
  </div>
</template>

<script>
import CourseSelect from "@teaHomework/smart/course-select";
import MyHomework from "@teaHomework/smart/my-homework";
import myMixin from "@/view/global/mixin";
import { mapActions } from "vuex";

export default {
  mixins: [myMixin],

  props: {
    sumbitInfo: Object
  },

  components: {
    CourseSelect,
    MyHomework
  },

  data() {
    return {
      modalOpen: false
    };
  },

  methods: {
    goNext() {
      this.modalOpen = true;
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../../global/public.less";

.containter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;

  p {
    font-size: 15px;
  }

  .create-subject-con {
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 100%;
  }

  .multiple-choice /deep/ .select-list {
    width: 250px;
  }

  .mar-top {
    margin-top: 20px;
  }

  .show-dialog-btn {
    width: 322px;
    margin-bottom: 30px;
  }
}
</style>
