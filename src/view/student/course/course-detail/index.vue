<style lang="less" scoped>
  .top_title {
    // overflow: hidden;
    // padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 14px 20px;
    border-radius: 10px;
    color: #666;
    box-shadow: 2px 2px 2px #eee;
    .class_title {
      font-size: 18px;
      font-weight: 700;
      float: left;
      line-height: 32px;
      .course-code {
        font-weight: 500;
        color: #888;
        font-size: 14px;
      }
    }
    .return_btn {
      float: right;
    }
  }
  .course-detail-teacher-talk {
    padding: 14px 20px;
    border-radius: 10px;
    color: #666;
    background-color: #fff;
    box-shadow: 2px 2px 2px #eee;
    margin-bottom: 20px;
  }
  .course-detail-page-nav {
    margin-top: 20px;
    text-align: center;
  }
</style>
<template>
  <div class="course_detail">
    <div class="top_title">
      <h2 class="class_title">{{course_name}} <span class="course-code">[{{course_code}} - {{course_classes}}]</span></h2>
      <Button class="return_btn" type="primary" shape="circle" @click="$router.go(-1)" icon="md-arrow-back">返回</Button>
    </div>
    <Tabs value="intro">
        <TabPane label="课程介绍" name="intro">
          <div class="course-detail-teacher-talk">
            <Card :bordered="false" :dis-hover="true">
              <p slot="title">课程介绍</p>
              <p>期望老师的关爱能让你愉快畅游在知识的海洋，同学的帮忙能给你带来更多的感动。为你下半学期的进步鼓掌！</p>
            </Card>
          </div>
          <div class="class_introduce">
            <iframe width="100%" height="500" scrolling="no" frameborder="no"
          :src="`${baseUrl}web/viewer.html?file=${baseUrl}web/intro.pdf`"></iframe>
          </div>
        </TabPane>
        <TabPane label="课时列表" name="classlist">
          <Table size="large" border :loading="class_table_loading" :columns="class_columns" :data="class_data"></Table>
          <div class="course-detail-page-nav">
            <Page :current="course_class_offset" :total="course_class_total" :page-size="course_class_limit" @on-change="changeCourseClassPage" />
          </div>
        </TabPane>
        <TabPane label="课程答疑" name="question">
          <Table
            size="large"
            :loading="questions_table_loading"
            border
            :columns="questions_columns"
            :data="questions_data"
          ></Table>
          <div class="course-detail-page-nav">
            <Page :current="course_question_offset" :total="course_question_total" :page-size="course_question_limit" @on-change="changeQuestionPage" />
          </div>
        </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { getCourseDetail, getCourseClassList, getCourseQusetionsList } from '@/api/course'
import { getMyDate } from '@/libs/tools'
export default {
  name: 'course-index',
  data () {
    return {
      baseUrl: process.env.BASE_URL,
      // 课程详情
      course_name: '',
      course_code: '',
      course_classes: '',
      course_desc_url: '',
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
          title: '操作',
          key: 'action',
          width: 220,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  shape: "circle"
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.goClass(params.row.id)
                  }
                }
              }, '进入本课'),
              h('Button', {
                props: {
                  type: 'error',
                  shape: "circle"
                },
                on: {
                  click: () => {

                  }
                }
              }, '查看作业')
            ])
          }
        }
      ],
      // 课时页码
      course_class_limit: 10,
      course_class_offset: 1,
      course_class_total: 0,
      class_data: [],
      // 答疑列表
      course_question_limit: 10,
      course_question_offset: 1,
      course_question_total: 0,
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
                    click: () => {
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
    }
  },
  components: {
    // pdf
  },
  methods: {
    goClass (id) {
      this.$router.push(`${this.$route.params.id}/${id}`)
    },
    // 获取课程详情
    getCourseDetail() {
      getCourseDetail({
        id: this.$route.params.id
      }).then((res)=>{
        console.log(res)
        let detail = res.data.courseDetail
        this.course_name = detail.name
        this.course_code = detail.code
        this.course_classes = detail.classes
        this.course_desc_url = detail.desc_url
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取课程详情失败');
      })
    },
    // 获取课时列表
    getCourseClassList(cb = ()=>{}) {
      this.class_table_loading = true
      getCourseClassList({
        course_id: this.$route.params.id,
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
      this.getCourseClassList(()=>{
        this.class_table_loading = false
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
      this.getCourseQusetionsList(()=>{
        this.questions_table_loading = false
      })
    },
  },
  created () {
    this.getCourseDetail()
    this.getCourseClassList(()=>{
      this.class_table_loading = false
    })
    this.getCourseQusetionsList(()=>{
      this.questions_table_loading = false
    })
  },
  mounted () {

  }
}
</script>
