<style lang="less">
  .teacher-question-audit {
    .teacher-questions-page-nav {
      text-align: center;
      margin-top: 20px;
    }
  }
</style>
<template>
  <div class="teacher-question-audit">
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
      <Select v-model="course_id" @on-change="changeCourse()" style="width:160px;margin-right:10px;">
        <Option v-for="(item,index) in course_list" :key="index" :value="item.id" :label="item.name"></Option>
      </Select>
    </div>
    <Table
      size="large"
      :loading="questions_table_loading"
      border
      :columns="questions_columns"
      :data="questions_data"
      style="margin-top:20px"
    ></Table>
    <div class="teacher-questions-page-nav">
      <Page :current="current" :total="total" :page-size="page_size" @on-change="changePage" />
    </div>
    <!-- 审核弹层 -->
    <Modal
        v-model="isShowAudit"
        title="设置审核状态"
        :loading="audit_loading"
        width="300"
        @on-ok="saveAudit(index)">
        <Select v-model="current_Select_status" style="width:200px">
            <Option value="success">通过</Option>
            <Option value="fail">拒绝</Option>
        </Select>
    </Modal>
    <!-- 审核弹层end -->
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
import { getTeaCourseList, getCourseClassList, getQusetionsList, deleteCourseQuestion, queryAuditByCourse, setQuestionAudit } from '@/api/course'
export default {
  name: 'teacher-question-audit',
  data () {
    return {
      total: 0,
      page_size: 10,
      current: 1,
      year: '',
      year_options: [],
      semester: 1,
      course_list: [],
      course_id: '',
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
          title: "审核状态",
          key: "audit_status",
          width: 140,
          render: (h, params) => {
            return h("Tag", 
              {
                props: {
                  type: "dot",
                  color: params.row.audit_status=='ing'?'warning':(params.row.audit_status=='fail'?'error':'success')
                }
              },
              params.row.audit_status=='ing'?'待审核':(params.row.audit_status=='fail'?'未通过':'通过')
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 260,
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
                    shape: "circle"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.current_select_id = params.row.id
                      this.showAuditPanel()
                    }
                  }
                },
                "审核"
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
      // 审核弹层
      isShowAudit: false,
      audit_loading: true,
      current_select_id: 0,
      current_Select_status: 'success'
    }
  },
  methods: {
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
      this.getTeaCourseList(()=>{
        
      })
    },
    changeSemester(semester){
      console.log(semester)
      this.getTeaCourseList(()=>{
        
      })
    },
    changeCourse(id){
      console.log(id)
    },
    changePage(page){
      console.log('页码改变 '+page)
      
    },
    // 获取课程列表(教师)
    getTeaCourseList(cb = () => {}) {
      this.notes_offset = 1
      getTeaCourseList({
        year: this.year,
        semester: this.semester,
        offset: 1,
        limit: 100
      }).then((res)=>{
        console.log(res)
        this.course_list = res.data.courseList
        this.course_id = ''
        this.questions_data = []
        if(this.course_list.length != 0){
          this.course_id = res.data.courseList[0].id
          this.queryAuditByCourse()
        }
        this.current = 1
        cb()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取课程列表失败');
        cb()
      })
    },
    // 获取未审核列表
    queryAuditByCourse() {
      this.questions_table_loading = true
      queryAuditByCourse({
        course_id: this.course_id,
        offset: 1,
        limit: 100
      }).then((res)=>{
        console.log(res)
        this.questions_data = res.data.questionList
        this.questions_table_loading = false
      }).catch((err)=>{
        console.log(err)
        this.questions_table_loading = false
        this.$Message.error('获取审核列表失败');
      })
    },
    // 弹层审核状态弹层
    showAuditPanel() {
      this.isShowAudit = true
      this.current_Select_status = 'success'
    },
    // 设置审核状态
    saveAudit() {
      setQuestionAudit({
        question_id: this.current_select_id,
        audit_status: this.current_Select_status || 'fail'
      }).then((res)=>{
        console.log(res)
        this.isShowAudit = false
        this.$Message.success('审核成功');
        this.queryAuditByCourse()
      }).catch((err)=>{
        console.log(err)
        this.isShowAudit = false
        this.$Message.error('审核失败');
      })
    }
  },
  created () {
    // 初始化学年列表
    this.createYearList()
    this.getTeaCourseList(()=>{
      
    })
  },
  mounted () {

  }
}
</script>
