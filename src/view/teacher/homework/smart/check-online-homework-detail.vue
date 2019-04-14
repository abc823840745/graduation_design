<template>
  <div class="homework-detail-con">
    <div>
      <SubjectType
        class="mb-30"
        v-for="(item, index) in inputInfo"
        type="score"
        :key="index"
        :index="index"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "check-online-homework-detail",

  components: {
    SubjectType: () =>
      import("@/view/global/component/show-subject-different-types")
  },

  computed: {
    ...mapState({
      inputInfo: state => state.homework.inputInfo
    })
  },

  data() {
    return {};
  },

  methods: {
    goBack() {
      console.log("goback");
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../global/public.less";

.homework-detail-con {
  width: 100%;
  height: auto;
  padding: 0 1%;

  .bottom-bar {
    display: flex;
    justify-content: space-between;

    .total-score {
      font-size: 18px;

      .score {
        color: #2d8cf0;
      }
    }
  }

  p {
    font-size: 15px;
  }

  .mar-bottom {
    margin-bottom: 30px;

    .input-title {
      margin-bottom: 5px;
    }

    .radio-list {
      width: 100%;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .radio-item {
        margin-left: 10px;
      }
    }

    .checkbox-item {
      margin-left: 10px;
    }
  }

  .btnGround {
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .btnGround button:nth-of-type(1) {
    margin-right: 5%;
  }

  .subjectText {
    width: 220px;
    height: auto;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
}
</style>
