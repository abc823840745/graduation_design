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
      <DatePicker type="year" placeholder="请选择学年" @on-change="changeYear" :clearable="false" v-model="year" :value="new Date()" style="width: 120px;margin-right:10px;"></DatePicker>
      <span>学期：</span>
      <Select v-model="semester" @on-change="changeSemester" style="width:120px;margin-right:10px;">
        <Option :value="1" label="第一学期"></Option>
        <Option :value="2" label="第二学期"></Option>
      </Select>
      <span>课程：</span>
      <Select v-model="course_name" @on-change="changeCourse" style="width:120px;margin-right:10px;">
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
      style="margin-top:20px"
    ></Table>
    <div class="teacher-questions-page-nav">
      <Page :current="current" :total="total" :page-size="page_size" @on-change="changePage" />
    </div>
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
export default {
  name: 'teacher-question-index',
  data () {
    return {
      total: 20,
      page_size: 10,
      current: 1,
      year: '2019',
      semester: 1,
      course_name: 'all',
      course_list: [
        {
          id: 1,
          name: '新媒体实训'
        },
        {
          id: 2,
          name: '二维图像处理'
        }
      ],
      // 答疑区表格
      questions_table_loading: true,
      questions_columns: [
        {
          title: "问题",
          key: "question_title",
          minWidth: 240,
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.question_title)
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
          key: "student_name",
          width: 160,
          render: (h, params) => {
            return h("span", params.row.student_name);
          }
        },
        {
          title: "学号",
          key: "student_number",
          width: 160
        },
        {
          title: "提问时间",
          key: "date",
          width: 160,
          render: (h, params) => {
            return h("span", getMyDate(params.row.date, "yyyy-MM-dd hh:mm"));
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
                  color: params.row.status==0?'primary':(params.row.status==1?'success':'error')
                }
              },
              params.row.status==0?'未解决':(params.row.status==1?'已解决':'已关闭')
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
                      this.$router.push('/teacher/answering/detail/'+params.index)
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
                            setTimeout(() => {
                                this.$Modal.remove();
                                this.$Message.success('删除成功');
                            }, 2000);
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
      questions_data: [
        {
          id: 1,
          question_title: "环境安装报错无法解决",
          course_name: '新媒体实训',
          student_name: "陈柳新",
          student_number: "1546764772",
          date: 1546764772000,
          status: 0
        },
        {
          id: 2,
          question_title: "附件区下载的软件无法打开",
          course_name: '二维图像处理',
          student_name: "骆镜濠",
          student_number: "1546764772",
          date: 1546764772000,
          status: 1
        },
        {
          id: 3,
          question_title: "PPT第一页有错误",
          course_name: '中国近现代史',
          student_name: "扬子江",
          student_number: "1546764772",
          date: 1546764772000,
          status: 2
        }
      ],
    }
  },
  methods: {
    changeYear(year){
      console.log(year)
    },
    changeSemester(semester){
      console.log(semester)
    },
    changeCourse(name){
      console.log(name)
    },
    changePage(page){
      console.log('页码改变 '+page)
    }
  },
  created () {
    setTimeout(() => {
      this.questions_table_loading = false;
    }, 3000);
  },
  mounted () {

  }
}
</script>
