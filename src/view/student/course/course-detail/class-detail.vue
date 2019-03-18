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
      <h2 class="class_title">
        {{ course_time_name }}
        <span class="course-code">[{{ course_name }}]</span>
      </h2>
      <Button
        class="return_btn"
        type="primary"
        shape="circle"
        @click="returnCourse"
        >返回课程</Button
      >
    </div>
    <Tabs value="intro">
      <TabPane label="本课内容" name="intro">
        <div class="course-detail-teacher-talk">
          <Card :bordered="false" :dis-hover="true">
            <p slot="title">本课主要内容</p>
            <p>{{ course_desc_text || "教师暂未设置本课内容介绍" }}</p>
          </Card>
        </div>
        <div class="class-introduce">
          <my-pdf
            v-if="course_desc_url"
            :src="course_desc_url"
            :click_change="true"
            :full_screen="true"
            :show_notes="true"
          ></my-pdf>
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
          <Page
            :current="course_class_offset"
            :total="course_class_total"
            :page-size="course_class_limit"
            @on-change="changeCourseClassPage"
          />
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { getMyDate } from "@/libs/tools";
import myPdf from "@/view/pdf/pdf";
import { getCourseClassDetail, getCourseClassFileList } from "@/api/course";
export default {
  name: "course-class-detail",
  data() {
    return {
      current: 1,
      total: 20,
      page_size: 10,
      baseUrl: process.env.BASE_URL,
      // 课时详情
      course_name: "",
      course_code: "",
      course_time_name: "",
      course_desc_url: "",
      course_desc_text: "",
      // 课时附件页码
      course_class_limit: 10,
      course_class_offset: 1,
      course_class_total: 0,
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
            return h(
              "span",
              getMyDate(
                new Date(params.row.created_at).getTime(),
                "yyyy-MM-dd hh:mm"
              )
            );
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
                    click: () => {}
                  }
                },
                "下载"
              )
            ]);
          }
        }
      ],
      download_file_data: []
    };
  },
  components: {
    myPdf
  },
  components: {},
  methods: {
    // 获取课时详情
    getCourseClassDetail(to_id) {
      getCourseClassDetail({
        id: to_id || this.$route.params.class_id
      })
        .then(res => {
          console.log(res);
          let detail = res.data.courseTimeDetail;
          this.course_name = detail.course_name;
          this.course_code = detail.course_code;
          this.course_time_name = detail.course_time_name;
          this.course_desc_url = detail.desc_url;
          this.course_desc_text = detail.desc_text;
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("获取课程详情失败");
        });
    },
    // 获取课时附件列表
    getClassFileList(cb = () => {}, to_id) {
      getCourseClassFileList({
        course_time_id: to_id || this.$route.params.class_id,
        offset: this.course_class_offset,
        limit: this.course_class_limit
      })
        .then(res => {
          console.log(res);
          this.course_class_total = res.data.count;
          this.download_file_data = res.data.courseTimeFileList;
          cb();
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("获取附件列表失败");
        });
    },
    // 更改课时列表页码
    changeCourseClassPage(page) {
      this.course_class_offset = page;
      this.getClassFileList();
    },
    // 返回课程
    returnCourse() {
      this.$router.push(
        `/student/course/course-detail/${this.$route.params.id}`
      );
    },
    changePage(page) {
      console.log("页码改变" + page);
    }
  },
  created() {
    this.getCourseClassDetail();
    this.getClassFileList(() => {
      this.download_file_table_loading = false;
    });
  },
  mounted() {},
  beforeRouteUpdate(to, from, next) {
    console.log(to, from);
    this.getCourseClassDetail(to.params.class_id);
    this.getClassFileList(() => {
      this.download_file_table_loading = false;
    }, to.params.class_id);
    next(vm => {});
  }
};
</script>
