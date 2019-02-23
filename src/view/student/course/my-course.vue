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
      <Select v-model="year" @on-change="changeYear" placeholder="请选择学年" style="width:80px">
        <Option v-for="item in year_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <span class="st">学期：</span>
      <Select v-model="term" @on-change="changeTerm" placeholder="请选择学期" style="width:120px;margin-right:10px;">
        <Option value="1">第一学期</Option>
        <Option value="2">第二学期</Option>
      </Select>
      <Button type="primary" @click.native="refreshCourse">刷新课程</Button>
    </div>
    <div class="class_wrap">
      <div class="class_box" v-for="(item,index) in course_list" :key="index">
        <h3 class="class_name">{{item.name}}</h3>
        <p class="course_code">课程代码：{{item.course_code}}</p>
        <p class="class_code">教学班：{{item.class_code}}</p>
        <ButtonGroup class="course-btn">
          <Button shape="circle" type="info"  @click.native="goCourseDetail(item)">进入课程</Button>
          <Button shape="circle" type="error" @click.native="deleteCourse(item.id)">删除课程</Button>
        </ButtonGroup>
      </div>
    </div>
    <div class="page_nav">
      <Page :total="total" :current="current" :page-size="page_size" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'my-course',
  data () {
    return {
      current: 1,
      page_size: 10,
      total: 1,
      year: '2018',
      term: '1',
      year_list: [
        {
          value: '2018',
          label: '2018'
        },
        {
          value: '2017',
          label: '2017'
        },
        {
          value: '2016',
          label: '2016'
        },
        {
          value: '2015',
          label: '2015'
        }
      ],
      course_list: [
        {
          id: 1,
          name: 'Java基础',
          course_code: 'GS4002',
          class_code: 'ACM01'
        },
        {
          id: 2,
          name: 'HTML5网页设计',
          course_code: 'GS4003',
          class_code: 'AMT02'
        }
      ]
    }
  },
  methods: {
    changeYear (e) {
      console.log(e)
    },
    changeTerm (e) {
      console.log(e)
    },
    goCourseDetail (item) {
      console.log(item)
      this.$router.push(`course-detail/${item.id}`)
    },
    refreshCourse(){
      this.$Modal.confirm({
        title: '刷新课表',
        content: '<p>此操作一般用在退课或者有其他课程调动时使用</p>',
        loading: true,
        onOk: () => {
            setTimeout(() => {
                this.$Modal.remove();
                this.$Message.success('刷新成功');
            }, 2000);
        }
      });
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
  created () {},
  mounted () {}
}
</script>
