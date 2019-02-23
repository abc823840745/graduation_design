<template>
  <div class="slider-bar w100">
    <h2 class="mb-10">{{userName}}，{{getDayType()}}</h2>
    <p>{{getToday()}}</p>

    <Divider />

    <h2 class="mb-10">本学期的课程：</h2>

    <p
      v-for="item in formatLesson"
      :key="item['className']"
    >
      {{item['courseName']}}
    </p>

  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      userName: state => state.user.userName
    })
  },

  mounted() {},
  data() {
    return {
      formatLesson: this.$tools.getSessionStorage("formatLesson")
    };
  },
  methods: {
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
