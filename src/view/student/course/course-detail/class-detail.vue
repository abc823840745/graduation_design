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
     text-align: right;
     margin-top: 20px;
  }
  .class-introduce {
    position: relative;
    margin: 0 4px 4px 0;
    padding: 0 10px 10px 10px;
    border-radius: 10px;
    min-height: 400px;
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
      z-index: 1000;
    }
  }
  .uplaod-screenshot-modal {
    width: 100%;
  }
}
</style>
<template>
  <div class="course_detail">
    <div class="top_title">
      <h2 class="class_title">{{course_time_name}} <span class="course-code">[{{course_name}}]</span></h2>
      <Button class="return_btn" type="primary" shape="circle" @click="returnCourse">返回课程</Button>
    </div>
    <Tabs value="intro">
        <TabPane label="本课内容" name="intro">
          <div class="course-detail-teacher-talk">
            <Card :bordered="false" :dis-hover="true">
              <p slot="title">本课主要内容</p>
              <p>{{course_desc_text || '教师暂未设置本课内容介绍'}}</p>
            </Card>
          </div>
          <div class="class-introduce">
            <my-pdf v-if="course_desc_url" :src="course_desc_url" :click_change="true" :full_screen="true" :show_notes="true" :course_id="$route.params.id" :course_time_id="$route.params.class_id" @toParentScreenshot="handleScreenshotFromPdf" ref="course_class_pdf"></my-pdf>
            <span v-else>教师尚未上传本课讲义</span>
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
            <Page :current="course_class_offset" :total="course_class_total" :page-size="course_class_limit" @on-change="changeCourseClassPage" />
          </div>
        </TabPane>
    </Tabs>
    <Modal
        v-model="upload_screenshot_modal"
        title="预览笔记截图"
        :mask-closable="false"
        ok-text="保存为笔记"
        :loading="screenshot_loading"
        @on-ok="handleSaveScreenShot"
        @on-cancel="cancelUploadScreenShot">
        <div class="uplaod-screenshot-modal">
          <img style="max-width:100%" :src="base64_string">
          <p style="margin-top:10px;">
            <Button :disabled="is_upload_screen" :loading="upload_screenshot_loading" type="success" @click="uploadScreenShot">{{is_upload_screen?'已上传':'上传笔记截图'}}</Button>
          </p>
          <p style="font-size:14px;margin:10px 0;">笔记截图代码（将代码粘贴到笔记高级编辑面板即可）：</p>
          <p>
            <Input v-model="return_base64_string_code" :readonly="true" style="width: 100%" />
          </p>
        </div>
    </Modal>
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
import myPdf from '@/view/pdf/pdf'
import kscreenshot from 'kscreenshot'
import { getCourseClassDetail, getCourseClassFileList, uploadImage, addStuNotes } from '@/api/course'
export default {
  name: 'course-class-detail',
  data () {
    const _this = this
    return {
      // 截图
      cutScreenShot: new kscreenshot({
        key: 65, 
        copyPath : function (base64) {
          console.log(_this.total)
          _this.base64_string = base64;
          _this.upload_screenshot_modal = true;
          return base64
        }
      }),
      upload_screenshot_loading: false,
      screenshot_loading: true,
      base64_string: '',
      return_base64_string_img: '',
      return_base64_string_code: '',
      upload_screenshot_modal: false,
      is_upload_screen: false,
      current: 1,
      total: 20,
      page_size: 10,
      baseUrl: process.env.BASE_URL,
      // 课时详情
      course_name: '',
      course_code: '',
      course_time_name: '',
      course_desc_url: '',
      course_desc_text: '',
      // 课时附件页码
      course_class_limit: 10,
      course_class_offset: 1,
      course_class_total: 0,
      // 附件区表格
      download_file_table_loading: true,
      download_file_columns: [
        {
          title: "文件名",
          key: "file_name",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.file_name)
            ]);
          }
        },
        {
          title: "上传时间",
          key: "created_at",
          width: 160,
          render: (h, params) => {
            return h("span", getMyDate(new Date(params.row.created_at).getTime(), "yyyy-MM-dd hh:mm"));
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
                    shape: "circle",
                    to: params.row.file_url,
                    target: "_blank"
                  },
                  style: {
                    marginRight: "5px"
                  }
                },
                "下载"
              )
            ]);
          }
        }
      ],
      download_file_data: []
    }
  },
  components: {
    myPdf
  },
  methods: {
    // 获取课时详情
    getCourseClassDetail(to_id) {
      getCourseClassDetail({
        id: to_id || this.$route.params.class_id
      }).then((res)=>{
        console.log(res)
        let detail = res.data.courseTimeDetail
        this.course_name = detail.course_name
        this.course_code = detail.course_code
        this.course_time_name = detail.course_time_name
        this.course_desc_url = detail.desc_url
        this.course_desc_text = detail.desc_text
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取课程详情失败');
      })
    },
    // 获取课时附件列表
    getClassFileList(cb = ()=>{}, to_id){
      getCourseClassFileList({
        course_time_id: to_id || this.$route.params.class_id,
        offset: this.course_class_offset,
        limit: this.course_class_limit
      }).then((res)=> {
        console.log(res);
        this.course_class_total = res.data.count
        this.download_file_data = res.data.courseTimeFileList
        cb();
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取附件列表失败')
      })
    },
    // 更改课时附件列表页码
    changeCourseClassPage(page) {
      this.course_class_offset = page
      this.getClassFileList()
    },
    // 返回课程
    returnCourse(){
      this.$router.push(`/student/course/course-detail/${this.$route.params.id}`)
    },
    changePage(page){
      console.log('页码改变'+page)
    },
    uploadScreenShot() {
      this.upload_screenshot_loading = true
      var base64String = this.base64_string;
      //这里对base64串进行操作，去掉url头，并转换为byte
      var bytes = window.atob(base64String.split(',')[1]);
      var array = [];
      for(var i = 0; i < bytes.length; i++){
          array.push(bytes.charCodeAt(i));
      }
      var blob = new Blob([new Uint8Array(array)], {type: 'image/png'});
      var formdata = new FormData();
      formdata.append('file', blob, Date.now() + '.png');
      uploadImage(formdata).then((res)=> {
        console.log(res);
        this.upload_screenshot_loading = false
        this.$Message.success('上传成功')
        this.is_upload_screen = true
        this.return_base64_string_img = res.data.urls[0]
        this.return_base64_string_code = `![${res.data.urls[0].fileName}](${res.data.urls[0].filePath})`
      }).catch((err)=>{
        console.log(err)
        this.upload_screenshot_loading = false
        this.$Message.error('上传失败')
        this.is_upload_screen = false
        this.return_base64_string_img = ''
        this.return_base64_string_code = ''
      })
    },
    cancelUploadScreenShot() {
      this.upload_screenshot_loading = false
      this.is_upload_screen = false
      this.return_base64_string_img = ""
      this.return_base64_string_code = ""
      this.upload_screenshot_modal = false
    },
    // 添加笔记
    addNote(value) {
      addStuNotes({
        course_id: this.$route.params.id,
        course_time_id: this.$route.params.class_id,
        content: value
      }).then((res)=> {
        console.log(res)
        this.return_base64_string_img = ""
        this.return_base64_string_code = ""
        this.is_upload_screen = false
        this.$Message.success('保存成功')
        this.upload_screenshot_modal = false
        this.$refs.course_class_pdf.getNotesList();
      }).catch((err)=>{
        console.log(err)
        this.return_base64_string_img = ""
        this.return_base64_string_code = ""
        this.is_upload_screen = false
        this.upload_screenshot_modal = false
        this.$Message.error('新增笔记失败')
      })
    },
    handleSaveScreenShot() {
      if(!this.return_base64_string_img.filePath){
        this.$Message.warning('请选择先上传笔记截图')
        this.upload_screenshot_modal = false
        return ;
      }
      console.log('保存笔记')
      let str = `<p><img src="${this.return_base64_string_img.filePath}" alt="${this.return_base64_string_img.fileName}" /></p>`
      this.addNote(str)
    },
    // PDF组件截图功能传递
    handleScreenshotFromPdf() {
      // 打开截图
      this.cutScreenShot.startScreenShot()
    }
  },
  created () {
    this.getCourseClassDetail()
    this.getClassFileList(() => {
      this.download_file_table_loading = false;
    })
  },
  mounted () {

  },
  beforeRouteUpdate(to, from, next) {
    console.log(to,from)
    this.getCourseClassDetail(to.params.class_id)
    this.getClassFileList(() => {
      this.download_file_table_loading = false;
    }, to.params.class_id)
    next(vm => {});
  },
}
</script>
