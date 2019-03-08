<style lang="less">
.select_bar {
  margin-bottom: 20px;
  .st {
    display: inline-block;
    margin-left: 10px;
    line-height: 24px;
  }
}
.class_wrap {
  overflow: hidden;
  .class_box {
    position: relative;
    float: left;
    // border: 1px solid #ddd;
    // margin: 8px;
    // border-radius: 10px;
    // width: 220px;
    // height: 100px;
    // padding: 24px 10px 10px 10px;
    // background-color: #fff;
    // font-size: 12px;
    // color: #666;
    // text-align: center;
    width: 220px;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 2px 2px 2px #eee;
    margin-right: 20px;
    text-align: center;
    color: #666;
    cursor: pointer;
    .class_name {
      font-weight: 600;
      font-size: 14px;
    }
    .course_code,.class_code {
      margin: 0 4px;
    }
    .course-btn {
      margin-top: 10px;
    }
  }
}
.page_nav {
  text-align: center;
  margin-top: 20px;
}
</style>
<template>
  <div>
    <div class="select_bar">
      <span class="st">学年：</span>
      <Select v-model="year" @on-change="changeYear" style="width:140px;margin-right:10px;">
        <Option v-for="(item, index) in year_options" :key="index" :value="item.year" :label="item.label"></Option>
      </Select>
      <span class="st">学期：</span>
      <Select v-model="semester" @on-change="changeSemester" placeholder="请选择学期" style="width:120px;margin-right:10px;">
        <Option value="1">第一学期</Option>
        <Option value="2">第二学期</Option>
      </Select>
      <Button type="primary" @click="openRefreshCourse">刷新课程</Button>
    </div>
    <div class="class_wrap">
      <div class="class_box" v-for="(item,index) in course_list" :key="index">
        <h3 class="class_name">{{item.name}}</h3>
        <p class="course_code">教学班：{{item.code}}</p>
        <p class="class_code">课室：{{item.classes}}</p>
        <ButtonGroup class="course-btn">
          <Button shape="circle" type="info"  @click.native="goCourseDetail(item)">进入课程</Button>
        </ButtonGroup>
      </div>
    </div>
    <div class="page_nav">
      <Page :total="total" :current="current" :page-size="page_size" />
    </div>
    <!-- 刷新课表modal -->
    <Modal v-model="show_refresh_course" width="360">
        <p slot="header" style="color:#666;text-align:center;font-size:18px;">
          <span>刷新课表</span>
        </p>
        <div style="text-align:center">
          <p style="margin: 10px 0;font-size:16px;">Myscse帐号：</p>
          <Input v-model="myscse_account" placeholder="请输入Myscse帐号" style="width: 300px" />
          <p style="margin: 10px 0;font-size:16px;">Myscse密码：</p>
          <Input v-model="myscse_password" type="password" placeholder="请输入Myscse密码" style="width: 300px" />
        </div>
        <div slot="footer">
            <Button type="primary" size="large" long :loading="refresh_loading" @click="refreshCourse()">马上刷新</Button>
        </div>
    </Modal>
    <!-- 刷新课表modal end -->
  </div>
</template>
<script>
import { getStuCourseList } from '@/api/course'
export default {
  name: 'my-course',
  data () {
    return {
      current: 1,
      page_size: 10,
      total: 0,
      year: '',
      semester: "1",
      year_options: [],
      course_list: [],
      show_refresh_course: false,
      refresh_loading: false,
      myscse_account: '',
      myscse_password: ''
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
    changeYear (e) {
      console.log(e)
      this.getCourseList()
    },
    changeSemester (e) {
      console.log(e)
      this.getCourseList()
    },
    goCourseDetail (item) {
      console.log(item)
      this.$router.push(`course-detail/${item.id}`)
    },
    openRefreshCourse(){
      this.show_refresh_course = true
    },
    refreshCourse(){
      this.refresh_loading = true
      this.refreshCourseList(()=>{
        this.refresh_loading = false
        this.show_refresh_course = false
        this.myscse_account = '',
        this.myscse_password = ''
      })
    },
    // 获取学生课程列表
    getCourseList(){
      getStuCourseList({
        year: this.year,
        semester: this.semester,
        offset: this.current,
        limit: this.page_size
      }).then((res)=>{
        this.course_list = res.data.courseList
        this.total = res.data.count
      }).catch((err)=>{
        console.log(err)
        this.course_list = []
        this.total = 0
        this.$Message.error('获取失败');
      })
    },
    // 刷新课表
    refreshCourseList(cb = () => {}){
      getStuCourseList({
        year: this.year,
        semester: this.semester,
        offset: this.current,
        limit: this.page_size,
        method: 'update',
        number: this.myscse_account,
        password: this.myscse_password
      }).then((res)=>{
        this.course_list = res.data.courseList
        this.total = res.data.count
        cb()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取失败');
        cb()
      })
    }
  },
  created () {
    // 初始化学年列表
    this.createYearList()
    this.getCourseList()
  },
  mounted () {}
}
</script>
