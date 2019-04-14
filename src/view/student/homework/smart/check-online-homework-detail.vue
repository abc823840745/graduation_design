<template>
  <div class="containters">
    <div>
      <SubjectType
        class="mar-bottom"
        v-for="(item, index) in inputInfo"
        type="check"
        :key="index"
        :index="index"
        :inputInfo="item"
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
  }
};
</script>

<style lang="less" scoped>
.containters {
  width: 100%;
  height: auto;
  padding: 0 1%;

  .header-bar {
    width: 100%;

    .homework-info {
      span {
        font-size: 15px;
        margin-right: 3%;
      }
    }
  }

  .bottom-bar {
    display: flex;
    align-items: center;

    .total-score {
      font-size: 18px;
      margin-right: 9%;

      .score {
        color: #2d8cf0;
      }
    }
  }

  p,
  span {
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

      .scope {
        color: #2d8cf0;
      }
    }

    .checkbox-item {
      margin-left: 10px;
    }
  }

  .btnGround {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-mar {
    margin-left: 40px;
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
