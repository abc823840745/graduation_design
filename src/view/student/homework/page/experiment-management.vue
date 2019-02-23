<template>
  <div class="containter">
    <div class="containter" v-if="curDirectory !== 3">
      <Modal v-model="showModal" title="上传" @on-ok="dialogOk">
        <Alert show-icon
          >只能上传单个文件或文件夹，如果上传有误，请重新上传即可</Alert
        >

        <Upload
          ref="upload"
          type="drag"
          :max-size="2048"
          :format="['jpg', 'png', 'jpeg']"
          :action="uploadUrl"
          :on-exceeded-size="handleMaxSize"
          :on-success="handleSuccess"
        >
          <div style="padding: 20px 0">
            <Icon
              type="ios-cloud-upload"
              size="52"
              style="color: #3399ff"
            ></Icon>
            <p>点击或者把文件拖拽到这里</p>
          </div>
        </Upload>
      </Modal>

      <div class="select-con">
        <MultipleChoice
          v-for="(item, index) in selectList"
          :key="index"
          :defaultValue.sync="item['value']"
          :semesterTip="item['tip']"
          :semesterList="item['list']"
          @onChange="item['onChange']"
          class="multiple-choice"
        />

        <Input
          class="search-item"
          search
          enter-button
          placeholder="请输入关键词"
        />
      </div>

      <Table
        border
        class="table-con mar-top"
        :columns="columns1"
        :data="tableData"
      />

      <Page class="mar-top page" :total="30" @on-change="changePage" />
    </div>
  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import myMixin from "@/view/global/mixin";
import config from "@/config";
import { mapActions, mapState } from "vuex";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;
const uploadUrl = baseUrl + "/upload/work";

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice
  },

  computed: {
    allCourse() {
      return this.$tools
        .getSessionStorage("formatLesson")
        .map(item => item["courseName"]);
    }
  },

  data() {
    return {
      uploadUrl,
      curDirectory: 1, // 当前的目录
      showModal: false,
      selectList: [
        {
          tip: "学期选择",
          value: this.getCurSchoolYear(),
          list: this.getSchoolYear(),
          onChange: this.yearChange
        },
        {
          tip: "课程选择",
          value: "所有课程",
          list: this.getCourseList(),
          onChange: this.courseChange
        },
        {
          tip: "周数选择",
          value: "所有周数",
          list: this.getWeekList(),
          onChange: this.weekChange
        },
        {
          tip: "完成状态",
          value: "所有状态",
          list: this.getFinishList(),
          onChange: () => {
            console.log("haha");
          }
        }
      ],
      columns1: [
        {
          title: "课程",
          key: "course"
        },
        {
          title: "实验",
          key: "name"
        },
        {
          title: "周数",
          key: "week",
          sortable: true
        },
        {
          title: "完成时间",
          key: "fintime",
          sortable: true
        },
        {
          title: "状态",
          key: "status"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("上传作业", h, () => (this.showModal = true)),
              this.btnStyle("下载实验", h, () => console.log("下载"), "success")
            ]);
          }
        }
      ],
      tableData: []
    };
  },

  async mounted() {
    await this.getTableData();
  },

  methods: {
    ...mapActions(["getClassHomework"]),

    async getTableData() {
      let res = await this.getClassHomework({
        course: this.allCourse,
        semester: this.getCurSchoolYear()
      });
      this.tableData = res;
    },

    dialogOk() {
      console.log("上传");
    },

    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件超过大小限制",
        desc: "文件大小不能查过2M！"
      });
    },

    handleSuccess(res, file, fileList) {
      console.log(res, file, fileList);
      this.$Notice.success({
        title: "上传成功！",
        desc: ""
      });
    },

    async yearChange(value) {
      let res = await this.getClassHomework({
        course:
          this.selectList[1]["value"] === "所有课程" ? this.allCourse : value,
        semester: value,
        week:
          this.selectList[2]["value"] === "所有周数"
            ? undefined
            : this.selectList[2]["value"]
      });
      this.tableData = res;
    },

    async courseChange(value) {
      let res = await this.getClassHomework({
        course: value === "所有课程" ? this.allCourse : value,
        semester: this.selectList[0]["value"],
        week:
          this.selectList[2]["value"] === "所有周数"
            ? undefined
            : this.selectList[2]["value"]
      });
      this.tableData = res;
    },

    async weekChange(value) {
      let res = await this.getClassHomework({
        course:
          this.selectList[1]["value"] === "所有课程"
            ? this.allCourse
            : this.selectList[1]["value"],
        semester: this.selectList[0]["value"],
        week: value === "所有周数" ? undefined : value
      });
      this.tableData = res;
    },

    async finishChange(value) {
      // TODO:完成状态
    },

    async changePage(page) {
      let res = await this.getClassHomework({
        page,
        course:
          this.selectList[1]["value"] === "所有课程"
            ? this.allCourse
            : this.selectList[1]["value"],
        semester: this.selectList[0]["value"],
        week:
          this.selectList[2]["value"] === "所有周数"
            ? undefined
            : this.selectList[2]["value"]
      });
      this.tableData = res;
    }
  }
};
</script>

<style lang='less' scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .mar-top {
    margin-top: 1.5%;
  }

  .table-con {
    width: 100%;
  }

  .page {
    align-self: flex-end;
  }

  .select-con {
    display: flex;
    align-self: flex-start;
    flex-wrap: wrap;
    width: 100%;

    .multiple-choice {
      margin-bottom: 10px;
    }

    .multiple-choice /deep/ .select-list {
      margin-right: 30px;
    }

    .search-item {
      margin-top: -1px;
      width: 271px;
    }
  }
}
</style>
