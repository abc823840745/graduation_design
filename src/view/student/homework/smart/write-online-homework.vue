<template>
  <Modal
    fullscreen
    title="完成在线作业"
    v-model="showModal"
    @on-ok="handleOk"
    @on-cancel="$emit('handleCancel')"
  >
    <div class="containter">
      <div class="header-bar">
        <Alert
          ><span class="alert-text">课程：nodejs实验</span>
          <span class="alert-text">实验：堂上构建简单服务器</span>
          <span class="alert-text">时间：20分钟</span></Alert
        >

        <div class="count-down-con">
          <P class="count-down-text">倒计时：</P>
          <P class="count-down-text primary-color">
            <CountDown
              ref="countDown"
              :isStartTimer="isStartTimer"
              :initialTime="1200"
              @callBack="endTimeDoing"
            >
              <h2 slot-scope="{ remainingTime }">
                {{ $tools.formatSeconds(remainingTime) }}
              </h2>
            </CountDown>
          </P>
        </div>
      </div>

      <SubjectType
        class="mb-30"
        v-for="(item, index) in inputInfo"
        type="testing"
        :index="index"
        :key="index"
      />
    </div>
  </Modal>
</template>

<script>
import SubjectType from "@/view/global/component/show-subject-different-types";
import CountDown from "@stuHomework/smart/count-down";
import { mapState } from "vuex";

export default {
  name: "online-homework",

  props: {
    modalOpen: Boolean
  },

  components: {
    SubjectType,
    CountDown
  },

  watch: {
    modalOpen(newVal, oldVal) {
      this.showModal = newVal;
    },

    showModal(newVal, oldVal) {
      this.$emit("update:modalOpen", newVal);
    }
  },

  computed: {
    ...mapState({
      inputInfo: state => state.homework.inputInfo
    })
  },

  data() {
    return {
      isStartTimer: true, // 是否开启定时器
      showModal: false
    };
  },

  methods: {
    endTimeDoing() {
      this.isStartTimer = false;
      console.log("结束后的回调");
    },

    handleOk() {
      let remainingTime = this.$refs.countDown.remainingTime;
      this.$emit("handleOk", remainingTime);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../global/public.less";

.containter {
  width: 100%;
  height: auto;
  padding: 0 1%;

  .header-bar {
    width: 100%;
    margin-bottom: 10px;

    .homework-info {
      display: flex;
      margin-bottom: 20px;

      h2 {
        font-size: 16px;
        margin-right: 3%;
      }
    }
  }

  .alert-text {
    font-size: 15px;
    font-weight: bold;
    margin-right: 20px;
  }

  p,
  span {
    font-size: 15px;
  }

  .mar-bottom {
    width: 100%;
    margin-bottom: 30px;

    .input-title {
      margin-bottom: 5px;
    }

    .radio-list {
      width: 100%;
      margin-top: 10px;
      display: flex;

      .checkbox-item {
        margin-left: 20px;
      }
    }

    .text-input {
      width: 50%;
      margin-top: 10px;
    }
  }

  .count-down-con {
    position: fixed;
    top: 1%;
    right: 5%;
    display: flex;
    align-items: center;

    .count-down-text {
      font-size: 16px;
    }
  }

  .primary-color {
    color: #2d8cf0;
  }

  .submitBtn {
    width: 10%;
  }

  .submitBtn:nth-of-type(1) {
    margin-right: 10px;
  }

  .subjectText {
    width: 50%;
    height: auto;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }

  .btnGround {
    width: 100%;
    display: flex;
    align-items: center;
  }
}
</style>