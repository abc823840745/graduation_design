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
  .class_introduce {
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
  }
  .course-detail-page-nav {
    margin-top: 20px;
    text-align: center;
  }
  .course-add-question-btn {
    margin-bottom: 10px;
  }
</style>
<template>
  <div class="course_detail">
    <div class="top_title">
      <h2 class="class_title">{{course_name}} <span class="course-code">[{{course_code}} - {{course_classes}}]</span></h2>
    </div>
    <Tabs value="intro">
        <TabPane label="课程介绍" name="intro">
          <div class="course-detail-teacher-talk">
            <Card :bordered="false" :dis-hover="true">
              <p slot="title">课程介绍</p>
              <p>{{course_desc_text}}</p>
            </Card>
          </div>
          <div class="class_introduce">
            <my-pdf v-if="course_desc_url" :src="course_desc_url" :click_change="true" :full_screen="true"></my-pdf>
          </div>
        </TabPane>
        <TabPane label="课时列表" name="classlist">
          <Table
            size="large"
            border
            :loading="class_table_loading"
            :columns="class_columns"
            :data="class_data"
            @on-row-click="clickTableRow"
            style="cursor:pointer;"
          ></Table>
          <div class="course-detail-page-nav">
            <Page :current="course_class_offset" :total="course_class_total" :page-size="course_class_limit" @on-change="changeCourseClassPage" />
          </div>
        </TabPane>
        <TabPane label="课程答疑" name="question">
          <div class="course-add-question-btn">
            <Button type="primary" @click="show_my_askquestion = true">我要提问</Button>
          </div>
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
    <!-- 提问modal -->
    <Modal
        :fullscreen="true"
        v-model="show_my_askquestion"
        title="我要提问"
        :mask-closable="false">
        <Form label-position="top">
          <FormItem label="提问标题">
            <Input v-model="ask_question_data.title" placeholder="请输入提问的标题"></Input>
          </FormItem>
          <FormItem label="问题描述">
            <mavon-editor style="height: 400px" ref="md" @imgAdd="$imgAdd" placeholder="请输入问题描述" v-model="ask_question_data.content"  @change="renderEditor"></mavon-editor>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancelAskQuestion">取消</Button>
          <Button type="primary" size="large" @click="askQusetion">确定</Button>
        </div>
    </Modal>
    <!-- 提问modal end -->
  </div>
</template>
<script>
import myPdf from '@/view/pdf/pdf'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { getCourseDetail, getCourseClassList, getCourseQusetionsList, askQuestionByStudent, uploadImage } from '@/api/course'
import { getMyDate } from '@/libs/tools'
export default {
  name: 'course-index',
  data () {
    return {
      // 课程详情
      course_name: '',
      course_code: '',
      course_classes: '',
      course_desc_url: '',
      course_desc_text: '',
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
                    this.$router.push(`/student/homework/experiment-management`)
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
          width: 120,
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
                      this.$router.push('/student/answering/detail/'+params.row.id)
                    }
                  }
                },
                "问题详情"
              )
            ]);
          }
        }
      ],
      questions_data: [],
      // 提问
      show_my_askquestion: false,
      ask_question_data: {
        title: '',
        content: '',
        render_answer_content: ''
      }
    }
  },
  components: {
    myPdf,
    mavonEditor
  },
  methods: {
    // 点击表格行
    clickTableRow(row, index) {
      this.$router.push(`${this.$route.params.id}/${row.id}`)
    },
    goClass (id) {
      this.$router.push(`${this.$route.params.id}/${id}`)
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
    // 获取课时列表
    getCourseClassList(cb = ()=>{}, to_id) {
      this.class_table_loading = true
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
      this.getCourseClassList(()=>{
        this.class_table_loading = false
      })
    },
    // 获取该课程答疑列表
    getCourseQusetionsList(cb = ()=>{}, to_id) {
      this.questions_table_loading = true
      getCourseQusetionsList({
        course_id: to_id || this.$route.params.id,
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
    renderEditor(val, render) {
      this.ask_question_data.render_answer_content = render
    },
    // 编辑器上传图片 绑定@imgAdd event uploadImage
    $imgAdd(pos, $file){
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('file', $file);
        uploadImage(formdata).then((res)=> {
          console.log(res);
          // this.file = null;
          // this.loadingStatus = false;
          this.$Message.success('上传成功')
          let url = res.data.urls[0].filePath
          this.$refs.md.$img2Url(pos, url);
        }).catch((err)=>{
          console.log(err)
          // this.file = null;
          // this.loadingStatus = false;
          this.$Message.error('上传失败')
        })
    },
    // 提问
    askQusetion() {
      // 提问验证格式拦截
      if(!/^.{6,50}$/.test(this.ask_question_data.title)) {
        this.$Message.warning('问题长度必须大于6个字符，且在50个字符以内');
        return false
      }
      if(!this.ask_question_data.content) {
        this.$Message.warning('问题描述至少填写10个字符');
        return false
      }
      askQuestionByStudent({
        course_id: this.$route.params.id,
        title: this.ask_question_data.title,
        content: this.ask_question_data.render_answer_content
      }).then((res)=>{
        console.log(res)
        // 提交成功后清空内容
        this.ask_question_data.title = ''
        this.ask_question_data.content = ''
        this.$Modal.success({
          title: '提交成功',
          content: '等待教师审核后才可公开，可在「答疑管理」→「我的提问」查询审核状态'
        });
        this.show_my_askquestion = false
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('提问提交失败');
      })
    },
    // 取消提问
    cancelAskQuestion() {
      this.ask_question_data.title = ''
      this.ask_question_data.content = ''
      this.show_my_askquestion = false
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

  },
  beforeRouteUpdate(to, from, next) {
    console.log('update')
    this.getCourseDetail(to.params.id)
    this.getCourseClassList(()=>{
      this.class_table_loading = false
    }, to.params.id)
    this.getCourseQusetionsList(()=>{
      this.questions_table_loading = false
    }, to.params.id)
    next(vm => {
      
    });
  },
}
</script>
