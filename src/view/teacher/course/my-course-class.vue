<style lang="less">
.teacher-my-course-class {
  .course-detail-top {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 14px 20px;
    border-radius: 10px;
    color: #666;
    box-shadow: 2px 2px 2px #eee;
    .course-title {
      font-size: 18px;
      .title-code {
        font-weight: 500;
        font-size: 14px;
        color: #888;
      }
    }
    .course-sub-title {
      font-size: 14px;
      line-height: 27px;
    }
  }
  .course-detail-intro {
    position: relative;
    margin: 0 4px 4px 0;
    padding: 0 10px 10px 10px;
    border-radius: 10px;
    min-height: 400px;
    background-color: #fff;
    box-shadow: 2px 2px 2px #eee;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    color: #888;
    .edit-course-intro {
      position: absolute;
      left: 10px;
      top: 10px;
      cursor: pointer;
      z-index: 1000;
    }
  }
  .course-detail-teacher-talk {
    padding: 14px 20px;
    border-radius: 10px;
    color: #666;
    background-color: #fff;
    box-shadow: 2px 2px 2px #eee;
    margin-top: 10px;
  }
  .down-top-btn {
    margin-bottom: 10px;
  }
  .class-file-page-nav {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
<template>
  <div class="teacher-my-course-class">
    <div class="course-detail-top">
      <h2 class="course-title">
        <span>{{ course_time_name }} </span>
        <span class="title-code">{{ course_name }}</span>
      </h2>
      <p class="course-sub-title">
        <Button size="small" shape="circle" @click="returnCourse" type="primary"
          >返回课程</Button
        >
      </p>
    </div>
    <div class="course-detail-navbar">
      <Tabs v-model="cur_tab" @on-click="changeTab">
        <TabPane label="课程介绍" name="keynote">
          <div class="course-detail-intro">
            <div class="edit-course-intro">
              <Upload
                :before-upload="handleUpload"
                accept="application/pdf"
                action="//jsonplaceholder.typicode.com/posts/"
              >
                <Button type="dashed" shape="circle" icon="ios-copy-outline"
                  >上传 / 修改本课讲义</Button
                >
              </Upload>
            </div>
            <my-pdf v-if="course_desc_url" :src="course_desc_url" :click_change="true" :full_screen="true"></my-pdf>
            <span v-else>教师尚未上传本课讲义</span>
            <Spin size="large" fix v-if="loadingStatus"></Spin>
          </div>
          <div class="course-detail-teacher-talk">
            <Card :bordered="false" :dis-hover="true">
              <p slot="title">本课简介</p>
              <Button
                shape="circle"
                slot="extra"
                type="primary"
                size="small"
                @click.prevent="openClassIntro"
                icon="ios-create-outline"
              ></Button>
              <p>{{ course_desc_text || "教师尚未修改本课介绍" }}</p>
            </Card>
          </div>
        </TabPane>
        <TabPane label="附件区" name="download">
          <div class="down-top-btn">
            <Button
              shape="circle"
              type="primary"
              @click.native="openUploadPanel"
              >上传文件</Button
            >
          </div>
          <Table
            size="large"
            :loading="download_file_table_loading"
            border
            :columns="download_file_columns"
            :data="download_file_data"
          ></Table>
          <div class="class-file-page-nav">
            <Page
              :current="course_class_offset"
              :total="course_class_total"
              :page-size="course_class_limit"
              @on-change="changeCourseClassPage"
            />
          </div>
        </TabPane>
        <TabPane label="作业区" name="homework"></TabPane>
      </Tabs>
    </div>
    <Modal
      v-model="showUploadPanel"
      title="上传附件"
      :loading="upload_class_file_loading"
      @on-ok="saveUpload"
      @on-cancel="cancelUpload"
      :mask-closable="false"
      okText="保存"
    >
      <Upload
        :before-upload="handleUploadClassFileBegin"
        multiple
        type="drag"
        action="//jsonplaceholder.typicode.com/posts/"
      >
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>可选多个文件，也可以拖拽文件到此上传</p>
        </div>
      </Upload>
      <div class="show-class-upload-list">
        <p v-for="(item, index) in class_upload_file_list" :key="index">
          <span>{{ item.name }}</span>
          <Button @click="delClassUploadList(index)" type="text">删除</Button>
        </p>
      </div>
      <Spin size="large" fix v-if="loadingFileStatus"></Spin>
    </Modal>
  </div>
</template>
<script>
import { getMyDate } from "@/libs/tools";
import myPdf from "@/view/pdf/pdf";
import {
  getCourseClassDetail,
  uploadCourseClassIntro,
  getCourseClassFileList,
  uploadCourseClassFile,
  deleteCourseClassFile,
  editCourseClassIntroText
} from "@/api/course";
export default {
  name: "my-course-class",
  data() {
    return {
      current: 1,
      total: 20,
      page_size: 10,
      cur_tab: "keynote",
      showUploadPanel: false,
      upload_class_file_loading: true,
      intro_pdf_url: "",
      // 上传课程介绍文件
      file: null,
      loadingStatus: false,
      // 上传课时附件
      class_upload_file: null,
      class_upload_file_list: [],
      loadingFileStatus: false,
      // 课时详情
      course_name: "",
      course_code: "",
      course_time_name: "",
      course_desc_url: "",
      course_desc_text: "",
      // 课时附件页码
      course_class_limit: 10,
      course_class_offset: 1,
      course_class_total: 0,
      // 附件区表格
      download_file_table_loading: true,
      download_file_columns: [
        {
          title: "文件名",
          key: "file_name",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.file_name)
            ]);
          }
        },
        {
          title: "上传时间",
          key: "created_at",
          width: 160,
          render: (h, params) => {
            return h(
              "span",
              getMyDate(
                new Date(params.row.created_at).getTime(),
                "yyyy-MM-dd hh:mm"
              )
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    shape: "circle",
                    to: params.row.file_url,
                    target: "_blank"
                  },
                  style: {
                    marginRight: "5px"
                  }
                },
                "下载"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    shape: "circle"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "确定要删除该文件？",
                        content: "<p>删除后将无法恢复</p>",
                        loading: true,
                        onOk: () => {
                          console.log(params.index);
                          this.deleteClassFile(params.row.id, () => {
                            this.$Modal.remove();
                          });
                        }
                      });
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      download_file_data: []
    };
  },
  components: {
    myPdf
  },
  methods: {
    // 获取课时详情
    getCourseClassDetail(to_id) {
      getCourseClassDetail({
        id: to_id || this.$route.params.class_id
      })
        .then(res => {
          console.log(res);
          let detail = res.data.courseTimeDetail;
          this.course_name = detail.course_name;
          this.course_code = detail.course_code;
          this.course_time_name = detail.course_time_name;
          this.course_desc_url = detail.desc_url;
          this.course_desc_text = detail.desc_text;
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("获取课程详情失败");
        });
    },
    // 上传课程介绍函数
    handleUpload(file) {
      if (file.type != "application/pdf") {
        this.$Message.error("请选择PDF文件上传");
        return false;
      }
      this.loadingStatus = true;
      this.file = file;
      // 创建form对象
      let formData = new FormData();
      // 通过append向form对象添加数据
      formData.append("file", this.file);
      formData.append("id", this.$route.params.class_id);
      uploadCourseClassIntro(formData)
        .then(res => {
          console.log(res);
          this.file = null;
          this.loadingStatus = false;
          this.$Message.success("上传成功");
          this.getCourseClassDetail();
        })
        .catch(err => {
          console.log(err);
          this.file = null;
          this.loadingStatus = false;
          this.$Message.error("上传失败");
        });
      return false;
    },
    // 上传课时附件
    handleUploadClassFileBegin(file) {
      console.log(file);
      this.class_upload_file_list.push(file);
      return false;
    },
    // 删除待上传列表附件
    delClassUploadList(i) {
      this.class_upload_file_list.splice(i, 1);
    },
    // 附件上传触发
    handleUploadClassFile() {
      this.loadingFileStatus = true;
      this.class_upload_file = new FormData();
      for (let k in this.class_upload_file_list) {
        this.class_upload_file.append("file", this.class_upload_file_list[k]);
      }
      this.class_upload_file.append(
        "course_time_id",
        this.$route.params.class_id
      );
      uploadCourseClassFile(this.class_upload_file)
        .then(res => {
          console.log(res);
          this.class_upload_file = null;
          this.$Message.success("上传成功");
          this.loadingFileStatus = false;
          this.showUploadPanel = false;
          this.getClassFileList(() => {
            this.download_file_table_loading = false;
          });
        })
        .catch(err => {
          console.log(err);
          this.class_upload_file = null;
          this.loadingFileStatus = false;
          this.showUploadPanel = false;
          this.$Message.error("上传失败");
        });
    },
    // 获取课时附件列表
    getClassFileList(cb = () => {}, to_id) {
      getCourseClassFileList({
        course_time_id: to_id || this.$route.params.class_id,
        offset: this.course_class_offset,
        limit: this.course_class_limit
      })
        .then(res => {
          console.log(res);
          this.course_class_total = res.data.count;
          this.download_file_data = res.data.courseTimeFileList;
          cb();
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("获取附件列表失败");
        });
    },
    // 返回课程
    returnCourse() {
      this.$router.push(
        `/teacher/course/my-course-detail/${this.$route.params.id}`
      );
    },
    // 打开上传附件modal
    openUploadPanel() {
      this.showUploadPanel = true;
    },
    // 保存并开始上传附件
    saveUpload() {
      this.handleUploadClassFile();
    },
    // 取消上传附件
    cancelUpload() {
      this.class_upload_file_list = [];
      this.class_upload_file = null;
    },
    // 删除上传附件
    deleteClassFile(file_id, cb = () => {}) {
      deleteCourseClassFile({
        id: file_id
      })
        .then(res => {
          console.log(res);
          this.$Message.success("删除成功");
          this.getClassFileList();
          cb();
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("删除失败");
          cb();
        });
    },
    // 更改课时列表页码
    changeCourseClassPage(page) {
      this.course_class_offset = page;
      this.getClassFileList();
    },
    // 修改课时介绍
    editClassIntro() {
      if(!this.edit_class_intro) {
        this.$Message.warning('请输入课时介绍');
        return false
      }
      editCourseClassIntroText({
        id: this.$route.params.class_id,
        content: this.edit_class_intro
      })
        .then(res => {
          console.log(res);
          this.$Message.success("修改成功");
          this.edit_class_intro = "";
          this.getCourseClassDetail();
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("修改失败");
        });
    },
    // 打开修改课时介绍modal
    openClassIntro() {
      this.$Modal.confirm({
        render: h => {
          return h("div", [
            h(
              "p",
              {
                style: {
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "700",
                  marginBottom: "10px"
                }
              },
              "请输入本课介绍"
            ),
            h("Input", {
              props: {
                type: "textarea",
                rows: 4,
                value: this.edit_class_intro,
                autofocus: true,
                placeholder: "请输入本课时介绍",
                size: "large"
              },
              on: {
                input: val => {
                  this.edit_class_intro = val;
                }
              }
            })
          ]);
        },
        onOk: () => {
          this.editClassIntro();
        },
        onCancel: () => {
          this.edit_class_intro = "";
        }
      });
    },
    // 本课时作业页面跳转
    changeTab(name) {
      if (name == "homework") {
        this.$router.push("/teacher/homework/task-center");
      }
    }
  },
  created() {
    this.getCourseClassDetail();
    this.getClassFileList(() => {
      this.download_file_table_loading = false;
    });
  },
  mounted() {},
  beforeRouteUpdate(to, from, next) {
    console.log(to, from);
    this.getCourseClassDetail(to.params.class_id);
    this.getClassFileList(() => {
      this.download_file_table_loading = false;
    }, to.params.class_id);
    next(vm => {});
  }
};
</script>
