<style lang="less">
 .teacher-question-reply {
    .teacher-questions-page-nav {
      text-align: center;
      margin-top: 20px;
    }
    .question-reply-comment-panel {
      margin-top: 10px;
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
        
        <div class="teacher-questions-page-nav">
          <Page :current="ask_current" :total="ask_total" :page-size="ask_page_size" @on-change="changeAskPage" />
        </div>
      </TabPane>
      <TabPane label="我的评论">
        
        <div class="teacher-questions-page-nav">
          <Page :current="comment_current" :total="comment_total" :page-size="comment_page_size" @on-change="changeCommentPage" />
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
import { getReplyQusetionList, getCommentQusetionList } from '@/api/course'
export default {
  name: 'teacher-question-reply',
  data () {
    return {
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
      questions_data: [],
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
        console.log(res)
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取回答列表失败');
      })
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

  }
}
</script>