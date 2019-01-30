<template>
  <div class="containter">

    <div class="select-con">
      <multiple-choice
        ref="haha"
        semesterTip='学期选择'
        :defaultValue='semester'
        :semesterList='semesterList'
      />

      <Input
        class="search-item"
        search
        enter-button
        placeholder="请输入课程名"
      />
    </div>

    <download />
  </div>
</template>

<script>
import download from "@stuHomework/smart/course-download";
import multipleChoice from "@teaHomework/smart/multiple-choice";

export default {
  name: "course-detail",
  data() {
    return {
      semester: "2017-2018第二学期",
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
  components: {
    download,
    multipleChoice
  },
  methods: {}
};
</script>

<style lang='less' scoped>
.containter {
  width: 100%;
  height: auto;
  .select-con {
    display: flex;
    width: 100%;
  }
  .search-item {
    margin-left: 4%;
    width: 20%;
  }
  .select-title {
    margin-right: 10px;
  }
  .select-list {
    width: 200px;
  }
  .select-list-con {
    align-self: flex-start;
    display: flex;
    align-items: center;
  }
}
</style>
