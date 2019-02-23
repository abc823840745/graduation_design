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
</style>
<template>
  <div class="course_detail">
    <div class="top_title">
      <h2 class="class_title">新媒体综合实训 <span class="course-code">[GT2004]</span></h2>
      <Button class="return_btn" type="primary" shape="circle" @click="$router.go(-1)" icon="md-arrow-back">返回</Button>
    </div>
    <Tabs value="intro">
        <TabPane label="课程介绍" name="intro">
          <div class="course-detail-teacher-talk">
            <Card :bordered="false" :dis-hover="true">
              <p slot="title">教师寄语</p>
              <p>期望老师的关爱能让你愉快畅游在知识的海洋，同学的帮忙能给你带来更多的感动。为你下半学期的进步鼓掌！</p>
            </Card>
          </div>
          <div class="class_introduce">
            <iframe width="100%" height="500" scrolling="no" frameborder="no"
          :src="`${baseUrl}web/viewer.html?file=${baseUrl}web/intro.pdf`"></iframe>
          </div>
        </TabPane>
        <TabPane label="我的课时" name="myclass">
          <Table size="large" border :columns="class_columns" :data="class_data"></Table>
        </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
export default {
  name: 'course-index',
  data () {
    return {
      baseUrl: process.env.BASE_URL,
      class_columns: [
        {
          title: '序号',
          key: 'id',
          width: 80,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                textAlign: 'center'
              }
            }, [
              h('strong', params.row.id)
            ])
          }
        },
        {
          title: '课时名称',
          key: 'name'
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
                    this.goClass(params.index)
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

                  }
                }
              }, '查看作业')
            ])
          }
        }
      ],
      class_data: [
        {
          id: 1,
          name: '课程介绍及组队的注意事项',
          address: 'New York No. 1 Lake Park'
        },
        {
          id: 2,
          name: '团队项目需求分析详解',
          address: 'London No. 1 Lake Park'
        },
        {
          id: 3,
          name: '项目开发计划书、概要设计详解',
          address: 'Sydney No. 1 Lake Park'
        }
      ]
    }
  },
  components: {
    // pdf
  },
  methods: {
    goClass (index) {
      this.$router.push(`${this.$route.params.code}/${this.class_data[index].id}`)
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
