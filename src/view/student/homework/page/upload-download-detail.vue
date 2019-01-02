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
export default {
  name: "course-detail",
  data() {
    return {
      buttonSize: "download"
    };
  },
  components: {
    download,
    upload
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
    width: 18%;
  }
}
</style>
