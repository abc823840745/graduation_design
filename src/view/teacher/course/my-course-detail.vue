<style lang="less">
.teacher-my-course-detail {
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
    padding: 0 20px;
    border-radius: 10px;
    height: 400px;
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
  .teacher-questions-page-nav {
     text-align: center;
     margin-top: 20px;
  }
}
</style>
<template>
  <div class="teacher-my-course-detail">
    <div class="course-detail-top">
      <h2 class="course-title">
        新媒体实训
        <span class="title-code">[GT2004]</span>
      </h2>
      <p class="course-sub-title">
        <Button size="small" shape="circle" @click.native="checkStudentList" type="primary">查看学生名单</Button>
      </p>
    </div>
    <div class="course-detail-navbar">
      <Tabs v-model="cur_tab">
        <TabPane label="课程介绍" name="course_intro">
          <div class="course-detail-intro">
            <div class="edit-course-intro">
              <Button
                type="dashed"
                shape="circle"
                icon="ios-copy-outline"
                @click.native="openUploadCourseIntro"
              >上传 / 修改讲义</Button>
            </div>正在从服务器获取课程介绍讲义...
          </div>
          <div class="course-detail-teacher-talk">
            <Card :bordered="false" :dis-hover="true">
              <p slot="title">教师寄语</p>
              <p>期望老师的关爱能让你愉快畅游在知识的海洋，同学的帮忙能给你带来更多的感动。为你下半学期的进步鼓掌！</p>
            </Card>
          </div>
          <Modal
            v-model="showUploadCourseIntro"
            title="上传课程介绍"
            :loading="upload_course_loading"
            ok-text="保存"
            @on-ok="uploadCourseIntro"
            @on-cancel="cancelUploadCourseIntro"
          >
            <Upload action="//jsonplaceholder.typicode.com/posts/">
              <Button icon="ios-cloud-upload-outline">点此上传课程介绍</Button>
            </Upload>
          </Modal>
          <Modal v-model="showStudentList" fullscreen title="当前课程学生名单" :footer-hide="true">
            <Table
            size="large"
            :loading="students_table_loading"
            border
            :columns="students_columns"
            :data="students_data"
          ></Table>
          </Modal>
        </TabPane>
        <TabPane label="课时管理" name="class_manage">
          <Table
            size="large"
            :loading="class_table_loading"
            border
            :columns="class_columns"
            :data="class_data"
          ></Table>
        </TabPane>
        <TabPane label="答疑区" name="course_question">
          <Table
            size="large"
            :loading="questions_table_loading"
            border
            :columns="questions_columns"
            :data="questions_data"
          ></Table>
          <div class="teacher-questions-page-nav">
            <Page :current="current" :total="total" :page-size="page_size" @on-change="changePage" />
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
export default {
  name: "my-course-detail",
  data() {
    return {
      total: 20,
      page_size: 10,
      current: 1,
      course_current_number: 2,
      showStudentList: false,
      showUploadCourseIntro: false,
      upload_course_loading: true,
      cur_tab: "course_intro",
      // 课时表格
      class_table_loading: true,
      class_columns: [
        {
          title: "课时名称",
          key: "class_name",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.class_name)
            ]);
          }
        },
        {
          title: "创建时间",
          key: "date",
          width: 160,
          render: (h, params) => {
            return h("span", getMyDate(params.row.date, "yyyy-MM-dd hh:mm"));
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
                    shape: "circle"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      console.log(params.index);
                      this.$router.push('./'+this.$route.params.id+'/'+params.index)
                    }
                  }
                },
                "进入课时"
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
                          title: '确定要删除该课时？',
                          content: '<p>删除后将清空课时所有数据</p>',
                          loading: true,
                          onOk: () => {
                            console.log(params.index);
                            setTimeout(() => {
                                this.$Modal.remove();
                                this.$Message.success('删除成功');
                            }, 2000);
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
      class_data: [
        {
          id: 1,
          class_name: "课程介绍及环境配置安装详解",
          date: "1546764772000",
          address: "New York No. 1 Lake Park"
        }
      ],
      // 学生名单表格
      students_table_loading: true,
      students_columns: [
        {
          title: "学生姓名",
          key: "student_name",
          width: 180,
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.student_name)
            ]);
          }
        },
        {
          title: "学号",
          key: "student_number",
          width: 160,
          render: (h, params) => {
            return h("span", params.row.student_number);
          }
        },
        {
          title: "专业",
          key: "major",
          minWidth: 250
        }
      ],
      students_data: [
        {
          id: 1,
          student_name: "骆镜濠",
          student_number: "1540624155",
          major: "网络与新媒体（新媒体设计与开发）"
        },
        {
          id: 2,
          student_name: "陈柳新",
          student_number: "1540624156",
          major: "网络与新媒体（新媒体设计与开发）"
        }
      ],
      // 答疑区表格
      questions_table_loading: true,
      questions_columns: [
        {
          title: "问题",
          key: "question_title",
          minWidth: 240,
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.question_title)
            ]);
          }
        },
        {
          title: "学生",
          key: "student_name",
          width: 160,
          render: (h, params) => {
            return h("span", params.row.student_name);
          }
        },
        {
          title: "学号",
          key: "student_number",
          width: 160
        },
        {
          title: "提问时间",
          key: "date",
          width: 160,
          render: (h, params) => {
            return h("span", getMyDate(params.row.date, "yyyy-MM-dd hh:mm"));
          }
        },
        {
          title: "状态",
          key: "status",
          width: 140,
          render: (h, params) => {
            return h("Tag", 
              {
                props: {
                  type: "dot",
                  color: params.row.status==0?'primary':(params.row.status==1?'success':'error')
                }
              },
              params.row.status==0?'未解决':(params.row.status==1?'已解决':'已关闭')
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
                    shape: "circle"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.$router.push('/teacher/course/teacher-question-detail/'+params.index)
                    }
                  }
                },
                "问题详情"
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
                          title: '确定要删除该问题？',
                          content: '<p>删除后将无法恢复</p>',
                          loading: true,
                          onOk: () => {
                            console.log(params.index);
                            setTimeout(() => {
                                this.$Modal.remove();
                                this.$Message.success('删除成功');
                            }, 2000);
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
      questions_data: [
        {
          id: 1,
          question_title: "环境安装报错无法解决",
          student_name: "陈柳新",
          student_number: "1546764772",
          date: 1546764772000,
          status: 0
        },
        {
          id: 2,
          question_title: "附件区下载的软件无法打开",
          student_name: "骆镜濠",
          student_number: "1546764772",
          date: 1546764772000,
          status: 1
        },
        {
          id: 3,
          question_title: "PPT第一页有错误",
          student_name: "扬子江",
          student_number: "1546764772",
          date: 1546764772000,
          status: 2
        }
      ],
    };
  },
  methods: {
    checkStudentList() {
      console.log("打开进入课程的学生名单");
      this.showStudentList = true;
    },
    openUploadCourseIntro() {
      this.showUploadCourseIntro = true;
    },
    uploadCourseIntro() {
      console.log("开始上传");
      setTimeout(() => {
        this.$Modal.remove();
        this.showUploadCourseIntro = false;
        this.$Message.success("保存成功");
      }, 2000);
    },
    cancelUploadCourseIntro() {
      console.log("取消上传");
      this.showUploadCourseIntro = false;
    },
    changePage(page){
      console.log('页码改变'+page)
    }
  },
  created() {
    setTimeout(() => {
      this.class_table_loading = false;
      this.students_table_loading = false;
      this.questions_table_loading = false;
    }, 3000);
  },
  mounted() {}
};
</script>
