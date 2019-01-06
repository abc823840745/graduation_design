<style lang="less">
  .teacher-question-detail {
    .teacher-question-detail-top {
      display: flex;
      justify-content: space-between;
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
      .answerer {
        margin: 10px 0;
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;
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
          line-height: 40px;
          font-size: 16px;
          color: #666;
          margin-left: 10px;
        }
      }
      .answer-content {
        font-size: 14px;
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
    </div>
    <div class="questions-key-title">
      <p>{{key_number}}个回答</p>
    </div>
    <div class="keyword-panel">
      <Tag color="green">最佳答案</Tag>
      <div class="answerer">
        <div class="avatar">陈</div>
        <p class="answerer-name">陈柳新</p>
      </div>
      <div class="answer-content">
        <p>1.按下shift+f10 会打开命令窗口，进入到C:\windows\system32\oobe文件夹，输入msoobe回车然后输入msoobe即可进入下一步操作。</p>
        <p>2.如果错误提示框仍然在，不用理会按照屏幕提示输入相应的信息直至完成系统的安装。</p>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'teacher-question-detail',
  data () {
    return {
      status: 0,
      question_title: '环境安装报错无法解决',
      question_time: '2018-12-25 12:25',
      questioner: '骆镜濠',
      key_number: 4,
    }
  },
  methods: {

  },
  created () {

  },
  mounted () {

  }
}
</script>
