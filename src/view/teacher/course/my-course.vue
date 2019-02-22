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
        <p class="course-code">教学班：{{item.class_code}}</p>
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

export default {
  name: 'my-course',
  data () {
    return {
      total: 20,
      page_size: 10,
      current: 1,
      year: '2019',
      semester: 1,
      course_list: [
        {
          id: 1,
          name: '新媒体实训',
          code: 'GT2004',
          class_code: 'ACM01'
        },
        {
          id: 2,
          name: '二维图像处理',
          code: 'GT2005',
          class_code: 'ATG02'
        },
        {
          id: 3,
          name: '中国近现代史',
          code: 'GT2006',
          class_code: 'ATH01'
        },
        {
          id: 4,
          name: '后期剪辑合成',
          code: 'GT2007',
          class_code: 'AfM03'
        },
        {
          id: 5,
          name: '外国文学赏析',
          code: 'GT2008',
          class_code: 'ALV01'
        }
      ],
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
    },
    changeSemester(semester){
      console.log(semester)
    },
    changePage(page){
      console.log(page)
    },
    goCourse(id){
      this.$router.push('/teacher/course/my-course-detail/' + id)
    },
    createCourse(){
      this.showCreateCourse = true;
      this.course_name = '';
      this.course_code = '';
      this.course_class_code = '';
    },
    sendCreateCourse(){
      this.create_loading = true;
      setTimeout(() => {
        this.showCreateCourse = false;
        this.create_loading = false;
        this.$Message.success('创建成功');
      }, 2000);
    },
    deleteCourse(id){
      this.$Modal.confirm({
          title: '确定要删除该课程？',
          content: '<p>删除后将清空课程所有数据</p>',
          loading: true,
          onOk: () => {
            console.log(id)
            setTimeout(() => {
                this.$Modal.remove();
                this.$Message.success('删除成功');
            }, 2000);
          }
      });
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
