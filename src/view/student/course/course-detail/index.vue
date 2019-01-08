<style lang="less" scoped>
  .top_title {
    overflow: hidden;
    padding-bottom: 10px;
    .class_title {
      font-size: 18px;
      font-weight: 700;
      float: left;
      line-height: 32px;
    }
    .return_btn {
      float: right;
    }
  }
</style>
<template>
  <div class="course_detail">
    <div class="top_title">
      <h2 class="class_title"><Icon type="md-book" /> 新媒体综合实训</h2>
      <Button class="return_btn" type="primary" shape="circle" @click="$router.go(-1)" icon="md-arrow-back">返回</Button>
    </div>
    <Tabs value="intro">
        <TabPane label="课程介绍" name="intro">
          <div class="class_introduce">
            <iframe width="100%" height="500" scrolling="no" frameborder="no"
          :src="`${baseUrl}web/viewer.html?file=${baseUrl}web/intro.pdf`"></iframe>
          </div>
        </TabPane>
        <TabPane label="我的课时" name="myclass">
          <Table border :columns="class_columns" :data="class_data"></Table>
        </TabPane>
    </Tabs>
  </div>
</template>
<script>
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
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
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
                  size: 'small'
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
