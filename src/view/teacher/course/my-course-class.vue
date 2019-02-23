<style lang="less">
.teacher-my-course-class {
  .course-detail-top {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 14px 20px;
    border-radius: 10px;
    color: #666;
    box-shadow: 2px 2px 2px #eee;
    .course-title {
      font-size: 18px;
      .title-code {
        font-weight: 500;
        font-size: 14px;
        color: #888;
      }
    }
    .course-sub-title {
      font-size: 14px;
      line-height: 27px;
    }
  }
  .course-detail-intro {
    position: relative;
    margin: 0 4px 4px 0;
    padding: 0 20px;
    border-radius: 10px;
    height: 400px;
    background-color: #fff;
    box-shadow: 2px 2px 2px #eee;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    color: #888;
    .edit-course-intro {
      position: absolute;
      left: 10px;
      top: 10px;
      cursor: pointer;
    }
  }
  .course-detail-teacher-talk {
    padding: 14px 20px;
    border-radius: 10px;
    color: #666;
    background-color: #fff;
    box-shadow: 2px 2px 2px #eee;
    margin-top: 10px;
  }
  .down-top-btn {
    margin-bottom: 10px;
  }
  .class-file-page-nav {
     text-align: center;
     margin-top: 20px;
   }
}
</style>
<template>
  <div class="teacher-my-course-class">
    <div class="course-detail-top">
      <h2 class="course-title">
        <span>课程介绍及环境配置安装详解 </span>
        <span class="title-code">新媒体实训</span>
      </h2>
      <p class="course-sub-title">
        <Button size="small" shape="circle" @click.native="returnPrevPage" type="primary">返回上一级</Button>
      </p>
    </div>
    <div class="course-detail-navbar">
      <Tabs v-model="cur_tab" @on-click="changeTab">
        <TabPane label="课程介绍" name="keynote">
          <div class="course-detail-intro">
            <div class="edit-course-intro">
              <Button
                type="dashed"
                shape="circle"
                icon="ios-copy-outline"
                @click.native="openUploadClassKeynote"
              >上传 / 修改讲义</Button>
            </div>正在从服务器获取本课时讲义...
          </div>
          <div class="course-detail-teacher-talk">
            <Card :bordered="false" :dis-hover="true">
              <p slot="title">本课简介</p>
              <p>本课主要讲解本学期的任务以及初始安装环境的搭建与配置，请同学们认真听讲！</p>
            </Card>
          </div>
          <Modal
            v-model="showUploadClassKeynote"
            title="上传本课讲义"
            :loading="upload_class_keynote_loading"
            ok-text="保存"
            @on-ok="uploadClassKeynote"
            @on-cancel="cancelUploadClassKeynote"
          >
            <Upload action="//jsonplaceholder.typicode.com/posts/">
              <Button icon="ios-cloud-upload-outline">点此上传本课讲义</Button>
            </Upload>
          </Modal>
        </TabPane>
        <TabPane label="附件区" name="download">
          <div class="down-top-btn">
            <Button shape="circle" type="primary" @click.native="openUploadPanel">上传文件</Button>
          </div>
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
        <TabPane label="作业区" name="homework"></TabPane>
      </Tabs>
    </div>
    <Modal
        v-model="showUploadPanel"
        title="上传附件"
        :loading="upload_class_file_loading"
        @on-ok="saveUpload"
        okText="保存"
        >
        <Upload
        multiple
        type="drag"
        action="//jsonplaceholder.typicode.com/posts/">
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>可选多个文件，也可以拖拽文件到此上传</p>
        </div>
      </Upload>
    </Modal>
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
export default {
  name: "my-course-class",
  data() {
    return {
      current: 1,
      total: 20,
      page_size: 10,
      cur_tab: 'keynote',
      showUploadClassKeynote: false,
      upload_class_keynote_loading: true,
      showUploadPanel: false,
      upload_class_file_loading: true,
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
                      this.show(params.index);
                    }
                  }
                },
                "下载"
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
                          title: '确定要删除该文件？',
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
    };
  },
  methods: {
    openUploadClassKeynote() {
      this.showUploadClassKeynote = true;
    },
    uploadClassKeynote() {
      console.log("开始上传");
      setTimeout(() => {
        this.$Modal.remove();
        this.showUploadClassKeynote = false;
        this.$Message.success("保存成功");
      }, 2000);
    },
    cancelUploadClassKeynote() {
      console.log("取消上传");
      this.showUploadClassKeynote = false;
    },
    returnPrevPage(){
      this.$router.go(-1)
    },
    openUploadPanel(){
      this.showUploadPanel = true;
    },
    saveUpload(){
      setTimeout(() => {
        this.$Modal.remove();
        this.showUploadPanel = false;
        this.$Message.success("保存成功");
      }, 2000);
    },
    changeTab(name){
      if(name == 'homework'){
        this.$router.push('/teacher/homework/my-homework')
      }
    },
    changePage(page){
      console.log('页码改变'+page)
    }
  },
  created() {
    setTimeout(() => {
      this.download_file_table_loading = false;
    }, 3000);
  },
  mounted() {}
};
</script>
