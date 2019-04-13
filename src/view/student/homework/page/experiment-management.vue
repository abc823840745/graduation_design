<template>
  <div class="containter">
    <div class="containter" v-if="curDirectory !== 3">
      <Modal v-model="showModal" title="上传">
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

        <div slot="footer">
          <Button type="primary" size="large" long @click="dialogOk"
            >返回</Button
          >
        </div>
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
      </div>

      <Table
        border
        :loading="loading"
        class="table-con mar-top"
        :columns="columns"
        :data="tableInfo['tableData']"
      />

      <Page
        class="mar-top page"
        :total="tableInfo['count']"
        :page-size="10"
        @on-change="getTableData"
      />
    </div>
  </div>
</template>

<script>
import myMixin from "@/view/global/mixin";
import config from "@/config";
import { mapActions, mapState } from "vuex";
import { getCurSchoolYear } from "@tools";

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice: () => import("@teaHomework/smart/multiple-choice")
  },

  computed: {
    ...mapState({
      userName: state => state.user.userName,
      stuId: state => state.user.stu_nmuber,
      courseList: state => state.homework.courseList,
      tableInfo: state => state.homework.experMangerInfo
    }),

    uploadUrl() {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro;
      const uploadUrl = baseUrl + "/upload/teacher/exper";
      return uploadUrl;
    }
  },

  data() {
    return {
      curDirectory: 1, // 当前的目录
      loading: true,
      showModal: false,
      selectList: [
        {
          tip: "学期选择",
          value: getCurSchoolYear(),
          list: this.getSchoolYear(),
          onChange: this.changeYear
        },
        {
          tip: "课程选择",
          value: "所有课程",
          list: [
            {
              value: "所有课程",
              label: "所有课程"
            }
          ],
          onChange: this.changeCourse
        },
        {
          tip: "课时选择",
          value: "所有课时",
          list: [
            {
              value: "所有课时",
              label: "所有课时"
            }
          ],
          onChange: this.changeClassHour
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
          title: "开始时间",
          key: "exper_startime",
          sortable: true,
          minWidth: 10
        },
        {
          title: "截止时间",
          key: "exper_fintime",
          sortable: true,
          minWidth: 10
        },
        {
          title: "完成状态",
          key: "status",
          sortable: true,
          render: (h, params) => {
            let text = params.row.status;
            let btnColor = text === "已完成" ? "success" : "error";
            return h("div", [this.statusBtnStyle(text, h, btnColor)]);
          }
        },
        {
          title: "操作",
          key: "operation",
          minWidth: 50,
          render: (h, params) => {
            let { exper_startime, exper_webpath } = params.row;
            return h("div", [
              this.btnStyle("上传作业", h, () => {
                this.goUpload(params);
              }),
              this.btnStyle(
                "下载实验",
                h,
                () => {
                  this.goDownload(params);
                },
                "success"
              )
            ]);
          }
        }
      ]
    };
  },

  async mounted() {
    await this.setCourseSelList();
    await this.getTableData();
  },

  methods: {
    ...mapActions(["getStuClassHW", "stuSubmitClassHW", "stuUploadAgain"]),

    dialogOk() {
      this.showModal = false;
    },

    goUpload(params) {
      let { index } = params;
      let { exper_startime } = params.row;
      let curDate = new Date();
      let startDate = new Date(exper_startime);
      if (curDate >= startDate) {
        this.showModal = true;
        this.itemInfo = this.tableInfo["tableData"][index];
      } else {
        this.$Notice.warning({
          title: "还没到开始时间！"
        });
      }
    },

    goDownload(params) {
      let { exper_webpath } = params.row;
      window.open(exper_webpath);
    },

    // 获取表格数据
    async getTableData(page = 1) {
      await this.getTableList("getStuClassHW", page);
    },

    // 选择学年
    async changeYear(value) {
      await this.yearChange("getStuClassHW", value);
    },

    // 选择课程
    async changeCourse(value) {
      await this.courseChange("getStuClassHW", value);
    },

    // 选择学时
    async changeClassHour(value) {
      await this.classHourChange("getStuClassHW", value);
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
      await this.getTableData(this.tableInfo["page"]);
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
