<style lang="less">
  .teacher-question-detail {
    .v-note-wrapper {
      z-index: 0;
    }
    .teacher-question-detail-top {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      background-color: #fff;
      padding: 14px 20px;
      border-radius: 10px;
      color: #666;
      box-shadow: 2px 2px 2px #eee;
      .teacher-question-title {
        font-weight: 700;
        font-size: 18px;
        .time {
          font-weight: 500;
          font-size: 12px;
          color: #888;
        }
      }
      .teacher-question-sub {
        font-size: 14px;
        margin-top: 10px;
        color: #888;
      }
      .teacher-question-status-btn {
        font-size: 14px;
        line-height: 27px;
      }
      .answer-panel {
        width: 100%;
        padding: 10px 0;
        .answer-panel-btn {
          margin-top: 10px;
          text-align: right;
        }
      }
    }
    .questions-key-title {
      font-size: 16px;
      color: #666;
      font-weight: 700;
      padding: 14px 20px;
      position: relative;
      p {
        background-color: #f5f7f9;
      }
    }
    .keyword-panel {
      background-color: #fff;
      padding: 14px 20px;
      border-radius: 10px;
      color: #666;
      box-shadow: 2px 2px 2px #eee;
      .answer_item {
        margin: 20px 0;
        .answerer {
          margin: 10px 0;
          display: flex;
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
          justify-content: space-between;
          .answer-left {
            display: flex;
            .avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              font-size: 16px;
              line-height: 40px;
              font-weight: 700;
              color: #fff;
              text-align: center;
              background-color: #2db7f5;
            }
            .answerer-name {
              font-size: 16px;
              color: #666;
              margin-left: 10px;
              display: flex;
              flex-direction: column;
              .answer-date {
                display: block;
                color: #888;
                font-size: 12px;
                margin: 0;
              }
            }
          }
        }
        .answer-content {
          font-size: 14px;
        }
        .answer-comment-top {
          margin-top: 10px;
          padding-top: 10px;
          padding-bottom: 10px;
          border-top: 1px dashed #ddd;
          border-bottom: 1px dashed #ddd;
          font-size: 12px;
          line-height: 18px;
          color: #888;
          cursor: pointer;
        }
        .answer-comment-list {
          list-style-type: none;
          li {
            border-bottom: 1px dashed #ddd;
            padding: 6px;
            margin-top: 10px;
            .answer-comment-list-info {
              text-align: right;
              span {
                display: inline-block;
                margin-left: 4px;
              }
            }
          }
        }
        .answer-comment {
          background-color: #fafafa;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
          padding: 10px;
          margin-top: 10px;
          .write-comment {
            display: flex;
            .comment-post-btn {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
  #editor {
    margin: auto;
    width: 80%;
    height: 580px;
  }
</style>
<template>
  <div class="teacher-question-detail">
    <div class="teacher-question-detail-top">
      <div>
        <h2 class="teacher-question-title">{{question_title}} <span class="time"> {{question_time}}</span></h2>
        <p class="teacher-question-sub">提问者：{{questioner}}</p>
        <Button style="margin-top:10px" icon="ios-create-outline" type="success" @click.native="showAnswerPanel">我来答</Button>
      </div>
      <p class="teacher-question-status-btn">
        <!-- <Button size="small" shape="circle" @click.native="checkStudentList" type="primary">状态设置</Button> -->
        <Select v-model="status" style="width:100px">
          <Option :value="0" label="未解决">
              <span>未解决</span>
          </Option>
          <Option :value="1" label="已解决">
              <span>已解决</span>
          </Option>
          <Option :value="2" label="已关闭">
              <span>已关闭</span>
          </Option>
        </Select>
      </p>
      <div class="answer-panel" v-if="show_answer_panel">
        <mavon-editor style="height: 300px" v-model="answer_content"></mavon-editor>
        <div class="answer-panel-btn"><Button type="primary" @click="showSubmitAnswer()">提交回答</Button></div>
      </div>
    </div>
    <div class="questions-key-title">
      <p>{{key_number}}个回答</p>
    </div>
    <div class="keyword-panel">
      <div class="answer_item" v-for="(item,index) in answer_list" :key="index">
        <div class="answerer">
          <div class="answer-left">
            <div class="avatar">{{item.fisrt_name}}</div>
            <p class="answerer-name">
              <span>{{item.username}}</span>
              <span class="answer-date">{{item.date}}</span>
            </p>
          </div>
          <Tag :color="item.status==1?'green':'cyan'" v-if="item.status!=0">{{item.status==1?'最佳答案':'有用'}}</Tag>
        </div>
        <div class="answer-content" v-html="item.content"></div>
        <div class="answer-comment-top">
          <Icon type="ios-chatbubbles" />
          <span @click="showComment(index)"> 评论（10）</span>
          <span> 将该答案设为 </span>
          <Select :value="item.status" size="small" @on-change="chanegAnswerStatus($event, index)" style="width:100px">
              <Option :value="0" >普通答案</Option>
              <Option :value="2" >有用答案</Option>
              <Option :value="1" >最佳答案</Option>
          </Select>
        </div>
        <ul class="answer-comment-list" v-if="item.show_comment">
          <li v-for="(comment_item, index) in item.comment_list" :key="index">
            <div class="answer-comment-list-content" v-html="comment_item.content"></div>
            <div class="answer-comment-list-info">
              <span>{{comment_item.username}}</span>
              <span>{{comment_item.date}}</span>
            </div>
          </li>
        </ul>
        <div class="answer-comment" v-if="item.show_comment">
          <div class="write-comment">
            <mavon-editor style="height: 300px" v-model="my_comment_content"></mavon-editor>
            <div class="comment-post-btn"><Button type="primary">发表</Button></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 提交答案panel -->
    <Modal
      v-model="show_answer_submit"
      title="提示"
      :loading="submit_answer_loading"
      @on-ok="submitAnswer">
      <p>您确定要提交答案？</p>
    </Modal>
    <!-- 提交答案panel end -->
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
  name: 'teacher-question-detail',
  data () {
    return {
      status: 0,
      question_title: '环境安装报错无法解决',
      question_time: '2018-12-25 12:25',
      questioner: '骆镜濠',
      key_number: 4,
      answer_list: [],
      // 填写的回答
      answer_content: '',
      // 评论回答
      my_comment_content: '',
      show_answer_panel: false,
      // 提交答案panel
      show_answer_submit: false,
      // 提交答案loading
      submit_answer_loading: true,
    }
  },
  methods: {
    getAnswerList () {
      let arrList = [
        {
          username: '陈柳新',
          date: 1546764772000,
          status: 1,
          content: '<p>1.按下shift+f10 会打开命令窗口，进入到C:\windows\system32\oobe文件夹，输入msoobe回车然后输入msoobe即可进入下一步操作。</p><p>2.如果错误提示框仍然在，不用理会按照屏幕提示输入相应的信息直至完成系统的安装。</p>',
          comment_list: [
            {
              username: '吕嘉俊',
              date: 1546764772000,
              content: '<p>我觉得不错</p>'
            },
            {
              username: '杨俊峰',
              date: 1546764772000,
              content: '<p>我也觉得不错</p>'
            }
          ]
        },
        {
          username: '扬子江',
          date: 1546764772000,
          status: 2,
          content: '<p>1.按下shift+f10 会打开命令窗口，进入到C:\windows\system32\oobe文件夹，输入msoobe回车然后输入msoobe即可进入下一步操作。</p><p>2.如果错误提示框仍然在，不用理会按照屏幕提示输入相应的信息直至完成系统的安装。</p>',
          comment_list: []
        }
      ]
      this.answer_list = arrList.map((item) => {
        item.date = getMyDate(item.date, 'yyyy-MM-dd hh:mm')
        item.fisrt_name = item.username.substr(0, 1)
        item.comment_list = item.comment_list.map((com_item)=>{
          com_item.date = getMyDate(com_item.date, 'yyyy-MM-dd hh:mm')
          return com_item
        })
        item.show_comment = false
        return item
      })
    },
    showComment (i) {
      this.answer_list[i].show_comment = !this.answer_list[i].show_comment
    },
    showAnswerPanel() {
      this.show_answer_panel = !this.show_answer_panel;
    },
    showSubmitAnswer() {
      this.show_answer_submit = true
    },
    // 提交答案
    submitAnswer() {
      setTimeout(() => {
        this.show_answer_submit = false;
        this.$Message.success('提交成功');
      }, 2000);
    },
    chanegAnswerStatus(v,i){
      this.answer_list[i].status = v;
    }
  },
  created () {
    this.getAnswerList()
  },
  components: {
    mavonEditor
  },
  mounted () {

  }
}
</script>
