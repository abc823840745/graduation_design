<style lang="less">
 .student-question-ask {
    .teacher-questions-page-nav {
      text-align: center;
      margin-top: 20px;
    }
  }
</style>
<template>
  <div class="student-question-ask">
    <div class="top-btn-wrap">
      <span>学年：</span>
      <Select v-model="year" @on-change="changeYear" style="width:140px;margin-right:10px;">
        <Option v-for="(item, index) in year_options" :key="index" :value="item.year" :label="item.label"></Option>
      </Select>
      <span>学期：</span>
      <Select v-model="semester" @on-change="changeSemester" style="width:120px;margin-right:10px;">
        <Option :value="1" label="第一学期"></Option>
        <Option :value="2" label="第二学期"></Option>
      </Select>
      <span>课程：</span>
      <Select v-model="course_id" :disabled="course_list.length==0" @on-change="changeCourse" style="width:160px;margin-right:10px;">
        <Option v-for="(item,index) in course_list" :key="index" :value="item.id" :label="item.name"></Option>
      </Select>
      <span></span>
      <Button type="primary" icon="ios-refresh-circle" @click="refreshList">刷新列表</Button>
    </div>
    <Table
      size="large"
      :loading="questions_table_loading"
      border
      :columns="questions_columns"
      :data="questions_data"
      @on-row-click="clickTableRow"
      style="margin-top:20px;cursor:pointer;"
    ></Table>
    <div class="teacher-questions-page-nav">
      <Page :current="current" :total="total" :page-size="page_size" @on-change="changePage" />
    </div>
    <!-- 修改问题弹层 -->
    <Modal
        v-model="is_show_edit"
        title="修改问题"
        width="700"
        :loading="edit_loading">
        <Form label-position="top">
          <FormItem label="提问标题">
            <Input v-model="edit_title" placeholder="请输入提问的标题"></Input>
          </FormItem>
          <FormItem label="问题描述">
            <!-- <Input type="textarea" v-model="ask_question_data.content"></Input> -->
            <mavon-editor style="height: 400px" ref="md" @imgAdd="$imgAdd" v-model="edit_content" @change="renderEditor"></mavon-editor>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="is_show_edit=false">取消</Button>
          <Button type="primary" size="large" @click="saveQuestionEdit">确定</Button>
        </div>
    </Modal>
    <!-- 修改问题弹层 -->
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { getTeaCourseList, getStuCourseList, getMyAskQuestion, deleteCourseQuestion, queryAuditByCourse, editMyAskQuestion, getQuestionDetail, uploadImage } from '@/api/course'
export default {
  name: 'student-answer-ask',
  data () {
    return {
      total: 0,
      page_size: 10,
      current: 1,
      year: '',
      year_options: [],
      semester: 1,
      course_id: '',
      course_list: [],
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
          title: "提问时间",
          key: "date",
          width: 160,
          render: (h, params) => {
            return h("span", getMyDate(new Date(params.row.created_at).getTime(), "yyyy-MM-dd hh:mm"));
          }
        },
        {
          title: "审核状态",
          key: "status",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h("Tag", 
                {
                  style: {
                    marginRight: "10px"
                  },
                  props: {
                    type: "dot",
                    color: params.row.audit_status=='ing'?'warning':(params.row.audit_status=='fail'?'error':'success')
                  }
                },
                params.row.audit_status=='ing'?'待审核':(params.row.audit_status=='fail'?'未通过':'通过')
              ),
              h(
                "Button",
                {
                  style: {
                    display: params.row.audit_status=='success'?'none':''
                  },
                  props: {
                    type: "info",
                    ghost: true,
                    shape: 'circle'
                  },
                  on: {
                    click: (e) => {
                      e.stopPropagation();
                      this.showEditModal(params.row.id)
                    }
                  }
                },
                "修改"
              )
            ])
          }
        },
        {
          title: "问题状态",
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
                      this.$router.push('/student/answering/detail/'+params.row.id)
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
                              this.getQusetionsList()
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
      // 修改问题弹出层
      is_show_edit: false,
      edit_loading: true,
      current_edit_id: '',
      edit_title: '',
      edit_content: '',
      render_edit_content: ''
    }
  },
  components: {
    mavonEditor
  },
  methods: {
    // 点击表格行
    clickTableRow(row, index) {
      this.$router.push('/student/answering/detail/'+row.id)
    },
    // 初始化学年列表
    createYearList(){
      let cur_year = new Date().getFullYear()
      const cur_month = new Date().getMonth() + 1
      if(cur_month < 9){
        cur_year-=1
      }
      for(let i=0;i<4;i++){
        this.year_options.push({
          year: cur_year - i,
          label: `${cur_year - i} - ${cur_year - i + 1} 学年`
        })
      }
      this.year = this.year_options[0].year
    },
    changeYear(year){
      console.log(year)
      this.getStuCourseList(()=>{
        this.getQusetionsList()
      })
    },
    changeSemester(semester){
      console.log(semester)
      this.getStuCourseList(()=>{
        this.getQusetionsList()
      })
    },
    changeCourse(id){
      console.log(id)
      this.is_passed = 'passed'
      this.getQusetionsList()
    },
    changePage(page){
      console.log('页码改变 '+page)
      this.getQusetionsList()
    },
    // 获取课程列表(学生)
    getStuCourseList(cb = () => {}) {
      getStuCourseList({
        year: this.year,
        semester: this.semester,
        offset: 1,
        limit: 100
      }).then((res)=>{
        console.log(res)
        this.course_list = res.data.courseList
        this.course_id = ''
        if(res.data.courseList.length > 0){
          this.course_id = res.data.courseList[0].id
        }
        this.current = 1
        cb()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取课程列表失败');
        cb()
      })
    },
    // 获取答疑列表
    getQusetionsList(cb = () => {}) {
      this.questions_table_loading = true;
      getMyAskQuestion({
        year: this.year,
        semester: this.semester,
        offset: this.current,
        limit: this.page_size
      }).then((res)=>{
        console.log(res)
        this.questions_table_loading = false;
        this.total = res.data.count
        this.questions_data = res.data.questionList
        cb()
      }).catch((err)=>{
        console.log(err)
        this.questions_table_loading = false;
        this.$Message.error('获取答疑列表失败');
        cb()
      })
    },
    // 删除答疑
    deleteCourseQuestion(id, cb = ()=>{}) {
      deleteCourseQuestion({
        id
      }).then((res)=>{
        console.log(res)
        this.$Message.success('删除成功');
        cb()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('删除失败');
        cb()
      })
    },
    renderEditor(val, render) {
      console.log(val,render)
      this.render_edit_content = render
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
    // 获取答疑详情
    getQuestionDetail(id, cb = ()=>{}) {
      getQuestionDetail({
        id
      }).then((res)=>{
        console.log(res)
        this.edit_title = res.data.questionDetail.title
        this.edit_content = res.data.questionDetail.content
        cb()
      }).catch((err)=>{
        console.log(err)
      })
    },
    // 弹出修改弹层
    showEditModal(id) {
      this.current_edit_id = id
      this.getQuestionDetail(id, ()=>{
        this.is_show_edit = true
      })
    },
    // 提交修改
    saveQuestionEdit() {
      if(!/^.{6,50}$/.test(this.edit_title)) {
        this.$Message.warning('问题长度必须大于6个字符，且在50个字符以内');
        return false
      }
      if(!(this.edit_content.length >= 10)) {
        this.$Message.warning('问题描述至少填写10个字符');
        return false
      }
      editMyAskQuestion({
        question_id: this.current_edit_id,
        title: this.edit_title,
        content: this.render_edit_content
      }).then((res)=>{
        console.log(res)
        this.is_show_edit = false
        this.$Modal.success({
          title: '修改成功',
          content: '已重新提交审核'
        });
        this.getQusetionsList()
      }).catch((err)=>{
        console.log(err)
        this.is_show_edit = false
        this.$Message.error('提交失败');
      })
    },
    // 刷新列表
    refreshList() {
      this.getQusetionsList()
    }
  },
  created () {
    // 初始化学年列表
    this.createYearList()
    this.getStuCourseList(()=>{
      this.getQusetionsList()
    })
  },
  mounted () {

  }
}
</script>