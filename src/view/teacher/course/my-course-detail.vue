<style lang="less">
.teacher-my-course-detail {
  .top-btn-area {
    margin-bottom: 20px;
  }
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
  .teacher-questions-page-nav {
     text-align: right;
     margin-top: 20px;
  }
  .new-class-btn {
    margin-bottom: 10px;
  }
  .course-detail-page-nav {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
<template>
  <div class="teacher-my-course-detail">
    <div class="course-detail-top">
      <h2 class="course-title">
        {{course_name}}
        <span class="title-code">[{{course_code}} - {{course_classes}}]</span>
      </h2>
      <p class="course-sub-title">
        <Button size="small" shape="circle" @click="checkStudentList" type="primary">本班学生名单</Button>
      </p>
    </div>
    <div class="course-detail-navbar">
      <Tabs v-model="cur_tab">
        <TabPane label="课程介绍" name="course_intro">
          <div class="course-detail-intro">
            <div class="edit-course-intro">
              <Upload
                  :before-upload="handleUpload"
                  accept="application/pdf"
                  action="//jsonplaceholder.typicode.com/posts/">
                  <Button
                    type="dashed"
                    shape="circle"
                    icon="ios-copy-outline"
                  >上传 / 修改课程介绍</Button>
              </Upload>
            </div>
            <my-pdf v-if="course_desc_url" :src="course_desc_url" :click_change="true" :full_screen="true"></my-pdf>
            <span v-else>教师尚未上传课程介绍</span>
            <Spin size="large" fix v-if="loadingStatus"></Spin>
          </div>
          <div class="course-detail-teacher-talk">
            <Card :bordered="false" :dis-hover="true">
              <p slot="title">课程介绍</p>
              <p>{{course_desc_text}}</p>
            </Card>
          </div>
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
          <!-- 新建课时 -->
          <Button type="success" class="new-class-btn" shape="circle" @click="showCreateCourseClass()">新建课时</Button>
          <!-- 新建课时 end -->
          <Table
            size="large"
            :loading="class_table_loading"
            border
            :columns="class_columns"
            :data="class_data"
          ></Table>
          <div class="course-detail-page-nav">
            <Page :current="course_class_offset" :total="course_class_total" :page-size="course_class_limit" @on-change="changeCourseClassPage" />
          </div>
        </TabPane>
        <TabPane label="答疑区" name="course_question">
          <div class="top-btn-area">
            <Button type="primary" icon="ios-refresh-circle" @click="refreshList">刷新列表</Button>
          </div>
          <Table
            size="large"
            :loading="questions_table_loading"
            border
            :columns="questions_columns"
            :data="questions_data"
            @on-row-click="clickTableRow"
            style="cursor:pointer;"
          ></Table>
          <div class="teacher-questions-page-nav">
            <Page :current="course_question_offset" :total="course_question_total" :page-size="course_question_limit" @on-change="changeQuestionPage" />
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
import myPdf from '@/view/pdf/pdf'
import { getMyDate } from '@/libs/tools'
import { getCourseDetail, getTeaCourseStudentList, getCourseClassList, createTeaCourseClass, deleteTeaCourseClass, uploadCourseIntro, getCourseQusetionsList, deleteCourseQuestion } from '@/api/course'
export default {
  name: "teacher-my-course-detail",
  data() {
    return {
      total: 20,
      page_size: 10,
      current: 1,
      course_current_number: 2,
      showStudentList: false,
      cur_tab: "course_intro",
      intro_pdf_url: '',
      // 上传文件
      file: null,
      loadingStatus: false,
      // 课程详情
      course_name: '',
      course_code: '',
      course_classes: '',
      course_desc_url: '',
      course_desc_text: '',
      // 课时页码
      course_class_limit: 10,
      course_class_offset: 1,
      course_class_total: 0,
      // 答疑列表
      course_question_limit: 10,
      course_question_offset: 1,
      course_question_total: 0,
      // 课时表格
      class_table_loading: true,
      class_columns: [
        {
          title: "课时名称",
          key: "name",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.name)
            ]);
          }
        },
        {
          title: "创建时间",
          key: "created_at",
          width: 160,
          render: (h, params) => {
            return h("span", getMyDate(new Date(params.row.created_at).getTime(), "yyyy-MM-dd hh:mm"));
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
                      this.$router.push('./'+this.$route.params.id+'/'+params.row.id)
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
                            this.deleteCourseClass(params.row.id, ()=>{
                              this.$Modal.remove();
                            })
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
      class_data: [],
      // 创建课时存储姓名
      create_class_name: '',
      // 学生名单表格
      students_table_loading: true,
      students_columns: [
        {
          title: "学生姓名",
          key: "username",
          width: 180,
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.username)
            ]);
          }
        },
        {
          title: "学号",
          key: "stu_number",
          width: 160,
          render: (h, params) => {
            return h("span", params.row.stu_number);
          }
        },
        {
          title: "专业",
          key: "major",
          minWidth: 250
        }
      ],
      students_data: [],
      // 答疑区表格
      questions_table_loading: true,
      questions_columns: [
        {
          title: "问题",
          key: "title",
          minWidth: 240,
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.title)
            ]);
          }
        },
        {
          title: "学生",
          key: "username",
          width: 160,
          render: (h, params) => {
            return h("span", params.row.username);
          }
        },
        {
          title: "学号",
          key: "number",
          width: 160
        },
        {
          title: "提问时间",
          key: "date",
          width: 160,
          render: (h, params) => {
            return h("span", getMyDate(new Date(params.row.created_at).getTime(), "yyyy-MM-dd hh:mm"));
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
                  color: params.row.status=='unsolved'?'primary':(params.row.status=='resolved'?'success':'error')
                }
              },
              params.row.status=='unsolved'?'未解决':(params.row.status=='resolved'?'已解决':'已关闭')
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
                      this.$router.push('/teacher/answering/detail/'+params.row.id)
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
                    click: (e) => {
                      e.stopPropagation();
                      this.$Modal.confirm({
                          title: '确定要删除该问题？',
                          content: '<p>删除后将无法恢复</p>',
                          loading: true,
                          onOk: () => {
                            console.log(params.index);
                            this.deleteCourseQuestion(params.row.id, ()=>{
                              this.$Modal.remove();
                              this.$Message.success('删除成功');
                            })
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
      questions_data: [],
    };
  },
  components: {
    myPdf
  },
  methods: {
    // 点击表格行
    clickTableRow(row, index) {
      this.$router.push('/teacher/answering/detail/'+row.id)
    },
    checkStudentList() {
      console.log("打开进入课程的学生名单");
      this.showStudentList = true;
      this.getTeaCourseStudentList(()=>{
        this.students_table_loading = false
      })
    },
    // 上传函数
    handleUpload (file) {
      if(file.type != 'application/pdf') {
        this.$Message.error('请选择PDF文件上传')
        return false;
      }
      this.loadingStatus = true
      this.file = file;
      // 创建form对象
      let formData = new FormData();
      // 通过append向form对象添加数据
      formData.append('file', this.file);
      formData.append('id', this.$route.params.id);
      uploadCourseIntro(formData).then((res)=> {
        console.log(res);
        this.file = null;
        this.loadingStatus = false;
        this.$Message.success('上传成功')
        this.getCourseDetail()
      }).catch((err)=>{
        console.log(err)
        this.file = null;
        this.loadingStatus = false;
        this.$Message.error('上传失败')
      })
      return false;
    },
    // 获取课程详情
    getCourseDetail(to_id) {
      getCourseDetail({
        id: to_id || this.$route.params.id
      }).then((res)=>{
        console.log(res)
        let detail = res.data.courseDetail
        this.course_name = detail.name
        this.course_code = detail.code
        this.course_classes = detail.classes
        this.course_desc_url = detail.desc_url
        this.course_desc_text = detail.desc_text
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取课程详情失败');
      })
    },
    // 获取学生名单
    getTeaCourseStudentList(cb = ()=>{}, to_id) {
      getTeaCourseStudentList({
        id: to_id || this.$route.params.id
      }).then((res)=>{
        console.log(res)
        this.students_data = res.data.studentList
        cb()
      }).catch((err)=>{
        console.log(err)
        cb()
        this.$Message.error('获取学生名单失败');
      })
    },
    // 获取课时列表
    getCourseClassList(cb = ()=>{}, to_id) {
      getCourseClassList({
        course_id: to_id || this.$route.params.id,
        offset: this.course_class_offset,
        limit: this.course_class_limit
      }).then((res)=>{
        console.log(res)
        this.course_class_total = res.data.count
        this.class_data = res.data.courseTimeList
        cb()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取课时列表失败');
        cb()
      })
    },
    // 更改课时列表页码
    changeCourseClassPage(page) {
      this.course_class_offset = page
      this.getCourseClassList()
    },
    // 打开创建窗口
    showCreateCourseClass() {
      this.$Modal.confirm({
        render: (h) => {
          return h('div', [
            h('p', {
              style: {
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '10px'
              }
            }, '请输入课时名称'),
            h('Input', {
              props: {
                value: this.create_class_name,
                autofocus: true,
                placeholder: '请输入课时名称',
                size: 'large'
              },
              on: {
                input: (val) => {
                    this.create_class_name = val;
                }
              }
            })
          ])
        },
        onOk: ()=>{
          this.createCourseClass(this.create_class_name)
        },
        onCancel: ()=>{
          this.create_class_name = ''
        }
      })
    },
    // 创建课时
    createCourseClass(name) {
      if(!name) {
        this.$Message.warning('请输入课时名称');
        return false
      }
      createTeaCourseClass({
        name,
        course_id: this.$route.params.id
      }).then((res)=>{
        console.log(res)
        this.$Message.success('创建成功');
        this.create_class_name = ''
        this.getCourseClassList()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('创建课时失败');
      })
    },
    // 删除课时
    deleteCourseClass(id, cb = ()=>{}) {
      deleteTeaCourseClass({
        id
      }).then((res)=>{
        console.log(res)
        this.$Message.success('删除成功');
        cb()
        this.getCourseClassList()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('删除失败');
        cb()
      })
    },
    // 获取该课程答疑列表
    getCourseQusetionsList(cb = ()=>{}) {
      this.questions_table_loading = true
      getCourseQusetionsList({
        course_id: this.$route.params.id,
        offset: this.course_question_offset,
        limit: this.course_question_limit
      }).then((res)=>{
        console.log(res)
        this.questions_data = res.data.questionList
        this.course_question_total = res.count
        cb()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取答疑列表失败');
        cb()
      })
    },
    // 改变答疑列表页码
    changeQuestionPage(page){
      this.course_question_offset = page
    },
    // 删除答疑
    deleteCourseQuestion(id, cb = ()=>{}) {
      deleteCourseQuestion({
        id
      }).then((res)=>{
        console.log(res)
        this.getCourseQusetionsList()
        cb()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('删除失败');
        cb()
      })
    },
    // 刷新列表
    refreshList() {
      this.getCourseQusetionsList(()=>{
        this.questions_table_loading = false;
      })
    }
  },
  created() {
    this.getCourseDetail()
    this.getCourseClassList(()=>{
      this.class_table_loading = false;
    })
    this.getCourseQusetionsList(()=>{
      this.questions_table_loading = false;
    })
  },
  mounted() {},
  beforeRouteUpdate(to, from, next) {
    console.log('update')
    this.getCourseDetail(to.params.id)
    this.getCourseClassList(()=>{
      this.class_table_loading = false;
    }, to.params.id)
    this.getCourseQusetionsList(()=>{
      this.questions_table_loading = false;
    }, to.params.id)
    next(vm => {
      
    });
  },
};
</script>
