<template>
  <div class="containter">

    <div class="select-con">
      <RadioGroup
        type="button"
        v-model="buttonSize"
      >
        <Radio label="download">课件下载</Radio>
        <Radio label=upload>作业上传</Radio>
      </RadioGroup>

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
    <download v-if="buttonSize === 'download'" />
    <upload v-else />
  </div>
</template>

<script>
import download from "../smart/course-download";
import upload from "../smart/course-upload";
import multipleChoice from "@/view/teacher/homework/smart/multiple-choice";

export default {
  name: "course-detail",
  data() {
    return {
      buttonSize: "download",
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
    upload,
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
    margin-left: 2.5%;
    align-self: flex-start;
    display: flex;
    align-items: center;
  }
}
</style>
