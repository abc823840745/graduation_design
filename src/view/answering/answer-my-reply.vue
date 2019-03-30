<style lang="less">
 .teacher-question-reply {
    .teacher-questions-page-nav {
      text-align: center;
      margin-top: 20px;
    }
    .question-reply-comment-panel {
      margin-top: 10px;
      background-color: transparent;
      .question-reply-list {
        ul {
          .item {
            background-color: #fff;
            margin-bottom: 20px;
            padding: 14px 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 2px 2px 2px #eee;
            .item-sub-title {
              display: flex;
              justify-content: space-between;
              .course-name, .question-name {
                cursor: pointer;
                color: #2d8cf0;
              }
              .close-btn {
                cursor: pointer;
              }
            }
            .content {
              margin-top: 10px;
              padding: 10px;
              border-radius: 10px;
              background-color: #f8f8f9;
            }
            .time {
              margin-top: 10px;
            }
          }
        }
      }
    }
    .none-list {
      font-size: 16px;
      font-weight: 700;
      color: #888;
      text-align: center;
      padding-top: 40px;
    }
  }
</style>
<template>
  <div class="teacher-question-reply">
    <div class="top-btn-wrap">
      <span>学年：</span>
      <Select v-model="year" @on-change="changeYear" style="width:140px;margin-right:10px;">
        <Option v-for="(item, index) in year_options" :key="index" :value="item.year" :label="item.label"></Option>
      </Select>
      <span>学期：</span>
      <Select v-model="semester" @on-change="changeSemester" style="width:120px;margin-right:10px;">
        <Option :value="1" label="第一学期"></Option>
        <Option :value="2" label="第二学期"></Option>
      </Select>
    </div>
    <Tabs class="question-reply-comment-panel" type="card" :animated="false">
      <TabPane label="我的回答">
        <div class="question-reply-list">
          <ul>
            <li class="item" v-for="(item, index) in ask_data" :key="index">
              <p class="item-sub-title">
                <span><Icon type="ios-bookmarks" />课程：<span class="course-name">{{item.course_name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="ios-chatbubbles" /> 来自问题：<span class="question-name" @click="toQuestion(item.question_id)">{{'这道题我不会'}}</span><br /></span>
                <Icon class="close-btn" @click.native="delReply(item.reply_id)" type="md-close" />
              </p>
              <div class="content" v-html="item.reply_content"></div>
              <p class="time"><Icon type="ios-time" /> 发表时间：{{'2019-03-30 11:21:10'}}</p>
            </li>
          </ul>
        </div>
        <div class="teacher-questions-page-nav" v-if="ask_total > 0">
          <Page :current="ask_current" :total="ask_total" :page-size="ask_page_size" @on-change="changeAskPage" />
        </div>
        <p v-else class="none-list">本学期您还没有回答过问题哦~</p>
      </TabPane>
      <TabPane label="我的评论">
        <div class="question-reply-list">
          <ul>
            <li class="item" v-for="(item, index) in comment_data" :key="index">
              <p class="item-sub-title">
                <span><Icon type="ios-bookmarks" />课程：<span class="course-name">{{item.course_name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="ios-chatbubbles" /> 来自问题：<span class="question-name" @click="toQuestion(item.question_id)">{{'这道题我不会'}}</span><br /></span>
                <Icon class="close-btn" @click.native="delComment(item.comment_id)" type="md-close" />
              </p>
              <div class="content" v-html="item.comment_content"></div>
              <p class="time"><Icon type="ios-time" /> 发表时间：{{'2019-03-30 11:21:10'}}</p>
            </li>
          </ul>
        </div>
        <div class="teacher-questions-page-nav" v-if="comment_total > 0">
          <Page :current="comment_current" :total="comment_total" :page-size="comment_page_size" @on-change="changeCommentPage" />
        </div>
        <p v-else class="none-list">本学期您还没有发表过评论哦~</p>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
import { getReplyQusetionList, getCommentQusetionList, delReplyQuestion, delCommentQuestion } from '@/api/course'
export default {
  name: 'teacher-question-reply',
  data () {
    return {
      isTeacher: false,
      // 回答列表页码
      ask_total: 0,
      ask_page_size: 10,
      ask_current: 1,
      // 评论列表页码
      comment_total: 0,
      comment_page_size: 10,
      comment_current: 1,
      // 学年学期参数
      year: '',
      year_options: [],
      semester: 1,
      ask_data: [],
      comment_data: [],
    }
  },
  methods: {
    // 初始化学年列表
    createYearList(){
      let cur_year = new Date().getFullYear()
      const cur_month = new Date().getMonth() + 1
      if(cur_month < 9){
        cur_year-=1
      }
      for(let i=0;i<4;i++){
        this.year_options.push({
          year: cur_year - i,
          label: `${cur_year - i} - ${cur_year - i + 1} 学年`
        })
      }
      this.year = this.year_options[0].year
    },
    changeYear(year){
      console.log(year)
      this.getReplyQusetionList()
      this.getCommentQusetionList()
    },
    changeSemester(semester){
      console.log(semester)
      this.getReplyQusetionList()
      this.getCommentQusetionList()
    },
    // 页码改变
    changeAskPage(page){
      console.log('页码改变 '+page)
    },
    changeCommentPage(page){
      console.log('页码改变 '+page)
    },
    // 获取回答列表
    getReplyQusetionList(cb = () => {}) {
      getReplyQusetionList({
        year: this.year,
        semester: this.semester,
        limit: this.ask_page_size,
        offset: this.ask_current
      }).then((res)=>{
        this.ask_total = res.data.count
        this.ask_data = res.data.hasRepliedQuestionList
        console.log(res)
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取回答列表失败');
      })
    },
    // 获取评论列表
    getCommentQusetionList(cb = () => {}) {
      getCommentQusetionList({
        year: this.year,
        semester: this.semester,
        limit: this.comment_page_size,
        offset: this.comment_current
      }).then((res)=>{
        this.comment_total = res.data.count
        this.comment_data = res.data.hasCommentedQuestionList
        console.log(res)
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取评论列表失败');
      })
    },
    // 跳转到问题页面
    toQuestion(question_id) {
      if(this.isTeacher){
        this.$router.push(`/teacher/answering/detail/${question_id}`)
      }else{
        this.$router.push(`/student/answering/detail/${question_id}`)
      }
    },
    // 删除回答
    delReply(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>删除该条回答？</p>',
        loading: true,
        onOk: () => {
          delReplyQuestion({
            id
          }).then((res)=>{
            console.log(res)
            this.$Modal.remove();
            this.$Message.success('删除成功');
            this.getReplyQusetionList()
          }).catch((err)=>{
            console.log(err)
            this.$Modal.remove();
            this.$Message.error('删除失败');
          })
        }
      });
    },
    // 删除评论
    delComment(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>删除该条评论？</p>',
        loading: true,
        onOk: () => {
          delCommentQuestion({
            id
          }).then((res)=>{
            console.log(res)
            this.$Modal.remove();
            this.$Message.success('删除成功');
            this.getCommentQusetionList()
          }).catch((err)=>{
            console.log(err)
            this.$Modal.remove();
            this.$Message.error('删除失败');
          })
        }
      });
    },
  },
  created () {
    // 初始化学年列表
    this.createYearList()
    // 获取回答列表
    this.getReplyQusetionList()
    // 获取评论列表
    this.getCommentQusetionList()
  },
  mounted () {

  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if(to.name == 'student-answer-reply'){
        vm.isTeacher = false
      }else{
        vm.isTeacher = true
      }
    });
  },
}
</script>