<style lang="less">
 .teacher-my-course {
   .course-list-wrap {
     display: flex;
     flex-wrap: wrap;
     margin: 0;
     .course-item {
       width: 220px;
       padding: 20px;
       border-radius: 10px;
       background-color: #fff;
       box-shadow: 2px 2px 2px #eee;
       margin-top: 20px;
       margin-right: 20px;
       text-align: center;
       color: #666;
       cursor: pointer;
       h3 {
         font-weight: 700;
         font-size: 16px;
       }
       .course-code {
        font-size: 12px;
       }
       .course-btn {
         margin-top: 10px;
       }
     }
   }
   .course-page-nav {
     text-align: center;
     margin-top: 20px;
   }
 }
</style>
<template>
  <div class="teacher-my-course">
    <div class="top-btn-wrap">
      <span>学年：</span>
      <DatePicker type="year" placeholder="请选择学年" @on-change="changeYear" :clearable="false" v-model="year" :value="new Date()" style="width: 120px;margin-right:10px;"></DatePicker>
      <span>学期：</span>
      <Select v-model="semester" @on-change="changeSemester" style="width:120px;margin-right:10px;">
        <Option :value="1" label="第一学期"></Option>
        <Option :value="2" label="第二学期"></Option>
      </Select>
      <Button type="primary" @click.native="createCourse">创建课程</Button>
    </div>
    <div class="course-list-wrap">
      <div class="course-item" v-for="(item,index) in course_list" :key="index">
        <h3>{{item.name}}</h3>
        <p class="course-code">课程代码：{{item.code}}</p>
        <p class="course-code">教学班：{{item.classes}}</p>
        <ButtonGroup class="course-btn">
          <Button shape="circle" type="info" @click.native="goCourse(item.id)">进入课程</Button>
          <Button shape="circle" type="error" @click.native="deleteCourse(item.id)">删除课程</Button>
        </ButtonGroup>
      </div>
    </div>
    <div class="course-page-nav">
      <Page :current="current" :total="total" :page-size="page_size" @on-change="changePage" />
    </div>
    <Modal v-model="showCreateCourse" width="360">
      <p slot="header" style="color:#666;text-align:center;font-size:18px;">
        <span>创建课程</span>
      </p>
      <div style="text-align:center">
        <p style="margin: 10px 0;font-size:16px;">课程名称：</p>
        <Input v-model="course_name" placeholder="请输入课程全称（请确保与Myscse统一）" style="width: 300px" />
        <p style="margin: 10px 0;font-size:16px;">课程代码：</p>
        <Input v-model="course_code" placeholder="请输入课程代码" style="width: 300px" />
        <p style="margin: 10px 0;font-size:16px;">教学班：</p>
        <Input v-model="course_class_code" placeholder="请输入本课程教学班代号" style="width: 300px" />
      </div>
      <div slot="footer">
          <Button type="primary" size="large" long :loading="create_loading" @click="sendCreateCourse">马上创建</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getTeaCourseList, createTeaCourse, delTeaCourse } from '@/api/course'
export default {
  name: 'my-course',
  data () {
    return {
      total: 0,
      page_size: 10,
      current: 1,
      year: new Date(),
      semester: 1,
      course_list: [],
      showCreateCourse: false,
      create_loading: false,
      course_name: '',
      course_code: '',
      course_class_code: ''
    }
  },
  methods: {
    changeYear(year){
      console.log(year)
      this.getCourseList()
    },
    changeSemester(semester){
      console.log(semester)
      this.getCourseList()
    },
    changePage(page){
      console.log(page)
      this.getCourseList()
    },
    goCourse(id){
      this.$router.push('/teacher/course/my-course-detail/' + id)
    },
    // 获取课程列表
    getCourseList() {
      getTeaCourseList({
        year: this.year.getFullYear(),
        semester: this.semester,
        offset: this.current,
        limit: this.page_size
      }).then((res)=>{
        console.log(res)
        this.total = res.data.count
        this.course_list = res.data.courseList
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取课程列表失败');
      })
    },
    createCourse(){
      this.showCreateCourse = true;
      this.course_name = '';
      this.course_code = '';
      this.course_class_code = '';
    },
    // 创建课程
    sendCreateCourse(){
      this.create_loading = true;
      createTeaCourse({
        name: this.course_name,
        code: this.course_code,
        classes: this.course_class_code,
        year: this.year.getFullYear(),
        semester: this.semester
      }).then((res)=>{
        console.log(res)
        this.showCreateCourse = false;
        this.create_loading = false;
        this.$Message.success('创建成功');
        this.getCourseList()
      }).catch((err)=>{
        console.log(err)
        this.showCreateCourse = false;
        this.create_loading = false;
        this.$Message.error('创建失败');
      })
    },
    deleteCourse(id){
      this.$Modal.confirm({
          title: '确定要删除该课程？',
          content: '<p>删除后将清空课程所有数据</p>',
          loading: true,
          onOk: () => {
            console.log(id)
            delTeaCourse({
              id
            }).then((res)=>{
              console.log(res)
              this.$Modal.remove();
              this.$Message.success('删除成功');
              this.getCourseList()
            }).catch((err)=>{
              console.log(err)
              this.$Modal.remove();
              this.$Message.success('删除失败');
            })
          }
      });
    }
  },
  created () {
    this.getCourseList()
  },
  mounted () {

  }
}
</script>
