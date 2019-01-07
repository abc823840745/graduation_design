<style lang="less">
  .teacher-question-detail {
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
          border-top: 1px dashed #ddd;
          font-size: 12px;
          line-height: 18px;
          color: #888;
          cursor: pointer;
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
        <Input v-model="answer_content" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="写下您的答案吧～" style="width: 100%" />
        <div class="answer-panel-btn"><Button type="primary">提交回答</Button></div>
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
        <div class="answer-comment" v-if="item.show_comment">
          <div class="write-comment">
            <Input v-model="my_comment_content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="评论一句，知音难寻～"  style="width: 100%" />
            <div class="comment-post-btn"><Button type="primary">发表</Button></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
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
      my_comment_content: '',
      answer_content: '',
      show_answer_panel: false,
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
          comment_list: []
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
        item.show_comment = false
        return item
      })
    },
    showComment (i) {
      this.answer_list[i].show_comment = !this.answer_list[i].show_comment
    },
    showAnswerPanel(){
      this.show_answer_panel = true;
    },
    chanegAnswerStatus(v,i){
      this.answer_list[i].status = v;
    }
  },
  created () {
    this.getAnswerList()
  },
  mounted () {

  }
}
</script>
