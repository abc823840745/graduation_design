<template>
  <div class="containter">
    <div class="select-list-con">
      <p class="select-title">学期选择:</p>
      <Select
        v-model="semester"
        class="select-list"
      >
        <Option
          v-for="item in semesterList"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}</Option>
      </Select>
    </div>
    <div class="content">
      <div
        class="course-name"
        v-for="(item,index) in 12"
        :key="index"
        @click="goCreSub"
      >
        课程名字
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: "other",
  props: {
    goCreSub: Function
  },
  data() {
    return {
      semester: "",
      semesterList: [
        {
          value: "2016-2017第一学期",
          label: "2016-2017第一学期"
        },
        {
          value: "2016-2017第二学期",
          label: "2016-2017第二学期"
        },
        {
          value: "2017-2018第一学期",
          label: "2017-2018第一学期"
        },
        {
          value: "2017-2018第二学期",
          label: "2017-2018第二学期"
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.containter {
  width: 100%;
  height: auto;
  .content {
    margin-top: 20px;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    justify-content: center;
  }
  .course-name {
    width: 20%;
    height: 120px;
    display: flex;
    background: gainsboro;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 20px;
    border-radius: 10px;
    margin-right: 50px;
    margin-bottom: 20px;
  }
  .course-name:nth-child(4n) {
    margin-right: 0;
  }
  .select-con {
    display: flex;
    align-self: flex-start;
    width: 100%;
  }
  .select-title {
    margin-right: 10px;
  }
  .select-list {
    width: 200px;
  }
  .select-list-con {
    margin-left: 2.5%;
    display: flex;
    align-items: center;
  }
}
</style>