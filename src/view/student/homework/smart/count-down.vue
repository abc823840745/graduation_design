<template>
  <div>
    <slot :remainingTime="remainingTime">
      {{ remainingTime }}
    </slot>
  </div>
</template>

<script>
import { getlocalStorage, setlocalStorage } from "@tools";
import { mapMutations, mapState } from "vuex";

export default {
  props: {
    isStartTimer: {
      // 是否启动定时器
      type: Boolean,
      default: false
    },

    initialTime: {
      // 初始化的时间(单位秒)
      type: Number,
      default: 10
    },

    timeTnterval: {
      // 时间间隔(单位秒)
      type: Number,
      default: 1
    }
  },

  watch: {
    initialTime(newVal, oldVal) {
      this.remainingTime = newVal;
    },

    isStartTimer(newVal, oldVal) {
      this.timer && clearTimeout(this.timer);
      this.isStartTimer && this.startTimer();
    }
  },

  computed: {
    ...mapState({
      fintime: state => state.homework.fintime
    })
  },

  data() {
    return {
      remainingTime:
        Number.isNaN(this.initialTime) ||
        !this.initialTime ||
        this.initialTime <= 0
          ? 0
          : this.initialTime, // 剩余的时间
      timer: null, // 定时器
      isStopTimer: false // 是否停止定时器
    };
  },

  beforeDestroy() {
    this.stopTimer();
  },

  methods: {
    ...mapMutations(["setRemainTime"]),

    startTimer() {
      this._countDown();
    },

    _countDown() {
      if (this.isStopTimer || this.remainingTime <= 0) {
        this.stopTimer();
        this.setRemainTime(this.remainingTime);
        return this.$emit("callBack");
      }
      if (this.remainingTime - 1 <= 0) {
        this.isStopTimer = true;
      }
      this.remainingTime = this.remainingTime - 1;
      this.setRemainTime(this.remainingTime);
      let curDate = new Date();
      let fintime = new Date(fintime);

      // 判断是否超过老师规定的完成时间
      if (curDate >= fintime) {
        this.stopTimer();
      }
      this.timer = setTimeout(this.startTimer, this.timeTnterval * 1000);
    },

    stopTimer() {
      this.isStopTimer = true;
      this.timer && clearTimeout(this.timer);
    }
  }
};
</script>

<style>
</style>
