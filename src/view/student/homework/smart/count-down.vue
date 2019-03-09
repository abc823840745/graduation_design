<template>
  <div>
    <slot :remainingTime="remainingTime">
      {{ remainingTime }}
    </slot>
  </div>
</template>

<script>
import { setlocalStorage } from "@tools";

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

  mounted() {
    this.timer && clearTimeout(this.timer);
    this.isStartTimer && this.startTimer();
  },

  beforeDestroy() {
    this.stopTimer();
  },

  methods: {
    startTimer() {
      this._countDown();
    },

    _countDown() {
      if (this.isStopTimer || this.remainingTime <= 0) {
        this.stopTimer();
        return this.$emit("callBack");
      }
      if (this.remainingTime - 1 <= 0) {
        this.isStopTimer = true;
      }
      this.remainingTime = this.remainingTime - 1;
      setlocalStorage("remainTime", this.remainingTime);
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
