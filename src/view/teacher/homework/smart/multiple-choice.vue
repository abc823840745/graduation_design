<template>
  <div class="select-list-con">
    <h3 class="select-title">{{ semesterTip }}:</h3>
    <Select
      v-model="semester"
      class="select-list"
      @on-change="$emit('onChange', $event)"
    >
      <Option
        v-for="item in semesterList"
        :value="item.value"
        :key="item.value"
        >{{ item.label }}</Option
      >
    </Select>
  </div>
</template>

<script>
export default {
  name: "homework-info",

  props: {
    semesterTip: String,
    defaultValue: String,
    semesterList: Array
  },

  watch: {
    defaultValue(newVal, oldVal) {
      this.semester = newVal;
    },

    semester(newVal, oldVal) {
      this.$emit("update:defaultValue", newVal);
    }
  },

  data() {
    return {
      semester: this.defaultValue
    };
  }
};
</script>

<style lang="less" scoped>
.select-title {
  margin-right: 10px;
}

.select-list {
  width: 200px;
}

.select-list-con {
  display: flex;
  align-items: center;
}
</style>
