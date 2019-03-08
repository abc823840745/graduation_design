<template>
  <div class="containter">
    <CourseSelect @goNext="goNext" />

    <MyHomework
      :modalOpen.sync="modalOpen"
      :submitInfo="submitInfo"
      :courseId="courseId"
      type="create"
    />
  </div>
</template>

<script>
import CourseSelect from "@teaHomework/smart/course-select";
import MyHomework from "@teaHomework/smart/my-homework";
import myMixin from "@/view/global/mixin";

export default {
  mixins: [myMixin],

  components: {
    CourseSelect,
    MyHomework
  },

  data() {
    return {
      modalOpen: false,
      courseId: 0,
      submitInfo: {
        semester: "",
        course: "",
        course_id: 0,
        teacher: this.$store.state.user.userName
      }
    };
  },

  methods: {
    goNext(info) {
      let { id, name, semester } = info;
      let submitInfo = this.submitInfo;
      submitInfo["semester"] = semester;
      submitInfo["course"] = name;
      submitInfo["course_id"] = id;
      this.submitInfo = submitInfo;
      this.courseId = id;
      console.log(this.submitInfo, this.courseId);
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
