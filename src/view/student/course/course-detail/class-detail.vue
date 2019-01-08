<style lang="less" scoped>
.course_detail {
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
  .upload_panel {
    background-color: #ddd;
    width: 100%;
    padding: 20px 20px 10px 20px;
    margin-top: 10px;
    ul {
      list-style-type: none;
      overflow: hidden;
      li.file_item {
        float: left;
        text-align: center;
        width: 160px;
        height: 120px;
        margin-bottom: 20px;
        .file_icon {
          width: 60px;
          height: 60px;
          margin: 0 auto;
          margin-bottom: 10px;
          border-radius: 10px;
          background-color: #999;
          color: #fff;
          font-size: 28px;
          line-height: 60px;
        }
        .filename {
          margin: 0;
          padding: 0;
          font-size: 12px;
          color: #505050;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
<template>
  <div class="course_detail">
    <div class="top_title">
      <h2 class="class_title"><Icon type="ios-bookmark-outline" /> 新媒体综合实训 - 「课程介绍及组队的注意事项」</h2>
      <Button class="return_btn" type="primary" shape="circle" @click="$router.go(-1)" icon="md-arrow-back">返回</Button>
    </div>
    <Tabs value="intro">
        <TabPane label="本课讲义" name="intro">
          <div class="class_introduce">
            <iframe width="100%" height="500" scrolling="no" frameborder="no"
          :src="`${baseUrl}web/viewer.html?file=${baseUrl}web/intro.pdf`"></iframe>
          </div>
        </TabPane>
        <TabPane label="附件区" name="myclass">
          <div class="upload_panel">
            <ul>
              <li class="file_item">
                <div class="file_icon">
                  <Icon type="ios-paper-outline" />
                </div>
                <p class="filename">课程介绍.pdf</p>
                <ButtonGroup size="small">
                  <Button>预览</Button>
                  <Button type="primary">下载</Button>
                </ButtonGroup>
              </li>
              <li class="file_item" v-for="(item,index) in 4" :key="index">
                <div class="file_icon">
                  <Icon type="ios-folder-open-outline" />
                </div>
                <p class="filename">附件名字.zip</p>
                <ButtonGroup size="small">
                  <Button disabled>预览</Button>
                  <Button type="primary">下载</Button>
                </ButtonGroup>
              </li>
            </ul>
          </div>
        </TabPane>
        <TabPane label="本课答疑" name="question">
          <Table border :columns="class_columns" :data="class_data"></Table>
        </TabPane>
    </Tabs>
  </div>
</template>
<script>
export default {
  name: 'course-class-detail',
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
                    // this.goClass(params.index)
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
  },
  methods: {

  },
  created () {

  },
  mounted () {

  }
}
</script>
