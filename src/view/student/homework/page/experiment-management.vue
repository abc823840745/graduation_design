<template>
  <div class="containter">
    <div class="containter" v-if="curDirectory !== 3">
      <Modal v-model="showModal" title="上传" @on-ok="dialogOk">
        <Alert show-icon
          >只能上传单个文件或文件夹，如果上传有误，请重新上传即可</Alert
        >

        <Upload
          type="drag"
          :max-size="2048"
          :format="['doc', 'docx']"
          :action="uploadUrl"
          :on-exceeded-size="handleMaxSize"
          :on-format-error="handleFormatErr"
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
        :columns="columns"
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

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice
  },

  computed: {
    // getAllCourse() {
    //   return this.$tools
    //     .getSessionStorage("formatLesson")
    //     .map(item => item["courseName"]);
    // },

    uploadUrl() {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro;
      const uploadUrl = baseUrl + "/upload/teacher/exper";
      return uploadUrl;
    },

    getAllCourse() {
      return [
        {
          course: "新媒体综合实训",
          stuclass: "ATM",
          teacher: "程亮"
        },
        {
          course: "就业与创业指导",
          stuclass: "ATM",
          teacher: "程亮"
        }
      ];
    },

    ...mapState({
      userName: state => state.user.userName
    })
  },

  data() {
    return {
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
          tip: "课时选择",
          value: "所有课时",
          list: this.getClassHourList(),
          onChange: this.classHourChange
        }
      ],
      columns: [
        {
          title: "课程名称",
          key: "course"
        },
        {
          title: "课时",
          key: "week"
        },
        {
          title: "实验名称",
          key: "exper_name"
        },
        {
          title: "完成时间",
          key: "exper_fintime",
          sortable: true
        },
        {
          title: "完成状态",
          key: "status",
          sortable: true
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("上传作业", h, () => {
                this.showModal = true;
                this.itemInfo = this.tableData[params.index];
              }),
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
    ...mapActions(["getStuClassHW", "stuSubmitClassHW", "stuUploadAgain"]),

    dialogOk() {
      console.log("上传");
    },

    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件超过大小限制",
        desc: "文件大小不能查过2M！"
      });
    },

    handleFormatErr(file) {
      this.$Notice.warning({
        title: "文件格式应该为doc"
      });
    },

    async handleSuccess(result) {
      let { id, exper_name, status } = this.itemInfo;
      let { localpath, url, filename } = result;
      if (status === "未完成") {
        let res = await this.stuSubmitClassHW({
          id,
          name: exper_name,
          localpath,
          localname: filename,
          webpath: url,
          submit_time: this.$tools.getCurDate()
        });
        if (res["status"] === 1) {
          this.$Notice.success({
            title: "上传成功！"
          });
        }
      } else {
        let res = await this.stuUploadAgain({
          id,
          name: exper_name,
          localpath,
          localname: filename,
          webpath: url,
          submit_time: this.$tools.getCurDate()
        });
        if (res["status"] === 1) {
          this.$Notice.success({
            title: "重新上传成功！"
          });
        }
      }
      await this.getTableData();
    },

    async getTableData() {
      let res = await this.getStuClassHW({
        // TODO: 暂时写死，课程信息由课程接口返回
        obj: this.getAllCourse,
        semester: this.getCurSchoolYear(),
        student: this.userName
      });
      this.tableData = res;
    },

    async yearChange(value) {
      // TODO: 每次将value存入vuex
      let res = await this.getStuClassHW({
        // TODO: 暂时写死，课程信息由课程接口返回
        obj:
          this.selectList[1]["value"] === "所有课程"
            ? this.getAllCourse
            : [
                {
                  course: this.selectList[1]["value"],
                  stuclass: "ATM",
                  teacher: "程亮"
                }
              ],
        semester: value,
        classHour:
          this.selectList[2]["value"] === "所有课时"
            ? undefined
            : this.selectList[2]["value"],
        student: this.userName
      });
      console.log(res);
      this.tableData = res;
    },

    async courseChange(value) {
      let res = await this.getStuClassHW({
        obj: [
          {
            course: value,
            stuclass: "ATM",
            teacher: "程亮"
          }
        ],
        semester: this.selectList[0]["value"],
        classHour:
          this.selectList[2]["value"] === "所有课时"
            ? undefined
            : this.selectList[2]["value"],
        student: this.userName
      });
      this.tableData = res;
    },

    async classHourChange(value) {
      let res = await this.getStuClassHW({
        obj:
          this.selectList[1]["value"] === "所有课程"
            ? this.getAllCourse
            : [
                {
                  course: this.selectList[1]["value"],
                  stuclass: "ATM",
                  teacher: "程亮"
                }
              ],
        semester: this.selectList[0]["value"],
        classHour: value === "所有课时" ? undefined : value,
        student: this.userName
      });
      this.tableData = res;
    },

    async finishChange(value) {
      // TODO:完成状态
    },

    async changePage(page) {
      let res = await this.getTeaClassHW({
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
