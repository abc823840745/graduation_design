<style lang="less">
 
</style>
<template>
  <div class="course-notes">
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
        <Option v-for="(item,index) in course_list" :key="index" :value="item.name" :label="item.name"></Option>
      </Select>
    </div>
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
import { getTeaCourseList, getStuCourseList, getQusetionsList, deleteCourseQuestion } from '@/api/course'
export default {
  name: 'course-notes',
  data () {
    return {
      total: 0,
      page_size: 10,
      current: 1,
      year: '',
      year_options: [],
      semester: 1,
      course_name: '',
      course_list: [],
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
      this.getStuCourseList(()=>{
        
      })
    },
    changeSemester(semester){
      console.log(semester)
      this.getStuCourseList(()=>{
        
      })
    },
    changeCourse(name){
      console.log(name)
      
    },
    changePage(page){
      console.log('页码改变 '+page)
      
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
        if(this.course_list.length != 0){
          this.course_name = res.data.courseList[0].name
        }
        this.current = 1
        cb()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取课程列表失败');
        cb()
      })
    },
  },
  created () {
    // 初始化学年列表
    this.createYearList()
    this.getStuCourseList(()=>{
      
    })
  },
  mounted () {

  }
}
</script>
