<style lang="less">
  .teacher-my-course-questions {
    .teacher-questions-page-nav {
      text-align: center;
      margin-top: 20px;
    }
  }
</style>
<template>
  <div class="teacher-my-course-questions">
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
      <Select v-model="course_name" @on-change="changeCourse" style="width:160px;margin-right:10px;">
        <Option value="all" label="全部"></Option>
        <Option v-for="(item,index) in course_list" :key="index" :value="item.name" :label="item.name"></Option>
      </Select>
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
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
import { getTeaCourseList, getStuCourseList, getQusetionsList, deleteCourseQuestion, getNewNotify } from '@/api/course'
export default {
  name: 'student-answer-index',
  data () {
    return {
      total: 0,
      page_size: 10,
      current: 1,
      year: '',
      year_options: [],
      semester: 1,
      course_name: 'all',
      course_list: [],
      // 答疑区表格
      questions_table_loading: true,
      questions_columns: [
        {
          title: "问题",
          key: "title",
          minWidth: 300,
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
          title: "课程",
          key: "course_name",
          width: 200,
          render: (h, params) => {
            return h("span", params.row.course_name);
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
              ),
              h(
                "Button",
                {
                  style: {
                    display:"none",
                  },
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
    }
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
    changeCourse(name){
      console.log(name)
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
        this.course_name = 'all'
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
      getQusetionsList({
        year: this.year,
        semester: this.semester,
        course_name: this.course_name == 'all' ? null : this.course_name,
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
    // 获取新通知
    getNewNotify() {
      getNewNotify({}).then((res)=>{
        console.log(res)
      }).catch((err)=>{
        console.log(err)
      })
    }
  },
  created () {
    // 初始化学年列表
    this.createYearList()
    this.getStuCourseList(()=>{
      this.getQusetionsList()
    })
    console.log('会执行created')
  },
  mounted () {

  },
}
</script>
