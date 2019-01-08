<style lang="less" scoped>
.course_detail {
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
  .class-file-page-nav {
     text-align: center;
     margin-top: 20px;
  }
}
</style>
<template>
  <div class="course_detail">
    <div class="top_title">
      <h2 class="class_title">课程介绍及组队的注意事项 <span class="course-code">[新媒体综合实训]</span></h2>
      <Button class="return_btn" type="primary" shape="circle" @click="$router.go(-1)" icon="md-arrow-back">返回</Button>
    </div>
    <Tabs value="intro">
        <TabPane label="本课内容" name="intro">
          <div class="course-detail-teacher-talk">
            <Card :bordered="false" :dis-hover="true">
              <p slot="title">本课主要内容</p>
              <p>本课主要讲解本学期的任务以及初始安装环境的搭建与配置，请同学们认真听讲！</p>
            </Card>
          </div>
          <div class="class_introduce">
            <iframe width="100%" height="500" scrolling="no" frameborder="no"
          :src="`${baseUrl}web/viewer.html?file=${baseUrl}web/intro.pdf`"></iframe>
          </div>
        </TabPane>
        <TabPane label="附件下载" name="myclass">
          <Table
            size="large"
            :loading="download_file_table_loading"
            border
            :columns="download_file_columns"
            :data="download_file_data"
          ></Table>
          <div class="class-file-page-nav">
            <Page :current="current" :total="total" :page-size="page_size" @on-change="changePage" />
          </div>
        </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
export default {
  name: 'course-class-detail',
  data () {
    return {
      current: 1,
      total: 20,
      page_size: 10,
      baseUrl: process.env.BASE_URL,
      // 附件区表格
      download_file_table_loading: true,
      download_file_columns: [
        {
          title: "文件名",
          key: "filename",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.filename)
            ]);
          }
        },
        {
          title: "上传时间",
          key: "date",
          width: 160,
          render: (h, params) => {
            return h("span", getMyDate(params.row.date, "yyyy-MM-dd hh:mm"));
          }
        },
        {
          title: "操作",
          key: "action",
          width: 100,
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

                    }
                  }
                },
                "下载"
              )
            ]);
          }
        }
      ],
      download_file_data: [
        {
          id: 1,
          filename: "集成开发环境.zip",
          date: "1546764772000"
        },
        {
          id: 2,
          filename: "实验报告.docx",
          date: "1546764772000"
        },
        {
          id: 3,
          filename: "参考资料.pdf",
          date: "1546764772000"
        }
      ]
    }
  },
  components: {
  },
  methods: {
    changePage(page){
      console.log('页码改变'+page)
    }
  },
  created () {
    setTimeout(() => {
      this.download_file_table_loading = false;
    }, 3000);
  },
  mounted () {

  }
}
</script>
