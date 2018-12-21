<style lang="less">
  @import './message_index.less';
</style>

<template>
  <div class="message">
    <Card class="card_container" v-for="(item,index) in messageList" :key="index" :bordered="false">
      <div slot="title">
        <img class="avatar" :src="item.avatar" />
        <span class="user-name">发布人：{{item.username}}</span>
        <div class="notice_time">发布时间：{{item.time}}</div>
      </div>
      <p class="title">{{item.title}}</p>
      <p>{{item.content}}</p>
    </Card>
    <div class="page_container">
      <Page :total="total" :page-size="pageSize" @on-change="changePage" />
    </div>
    <Modal v-model="modal1" width="580">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>你确认要新建吗？</span>
      </p>
      <Form :model="form" ref="content" :label-width="150" :rules="ruleInline">
        <FormItem prop="title" label="标题">
          <Input v-model="form.title" placeholder="请输入通知标题"></Input>
        </FormItem>
        <FormItem prop="description" label="描述">
          <Input v-model="form.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入通知描述"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="addNewNotice">确认新建</Button>
      </div>
    </Modal>
    <div class="choice_btn" v-if="role=='admin'||role=='teacher'">
      <Button class="notice_btn" @click="showModal('admin')" v-if="role=='admin'" type="success">新建广播</Button>
      <Button @click="showModal('teacher')" type="warning">新建通知</Button>
      <p class="choice_tip">注意：新建的通知只有负责指导的学生才可以收到,管理员具有广播通知的功能，即发送的通知所有学生可以收到！</p>
    </div>
  </div>
</template>

<script>
  import { getMessage, addNewNotice } from '@/api/message'
  import { getMyDate } from '@/libs/tools'
  export default {
    data() {
      return {
        notice: false,
        form: {
          title: '',
          description: ''
        },
        modal1: false,
        uid: '',
        role: '',
        noticeRole: 'teacher',
        total: 1,
        pageSize: 4,
        messageList: [],
        start: 1,
        ruleInline: {
          title: [
            { required: true, message: '课题名称不能少于四个字多余20个字', trigger: 'blur', type: 'string' }
          ],
          description: [
            { required: true, message: '课题描述不能少于十个字多余五十个字', trigger: 'blur', type: 'string' }
          ]
        }
      }
    },
    mounted() {
      let {token, role} = this.$store.state.user
      this.role = role
      this.uid = token
      this.getMessage()
    },
    methods: {
      showModal(role) {
        this.noticeRole = role
        this.modal1 = true
      },
      getMessage() {
        let uid = this.uid
        let start = this.start
        if (this.role == 'student') {
          uid = this.$store.state.user.guideTeacher
        }
        getMessage({ uid, start }).then((res) => {
          if (res.data.message == 'ok') {
            res.data.list.forEach((item) => {
              item.time = getMyDate(item.time, 'yyyy-MM-dd')
            })
            this.messageList = res.data.list
            this.total = res.data.count
            let originMsgCount = localStorage.getItem('originCount')
            localStorage.setItem("news", originMsgCount)
            this.$store.commit('setMsgCount', 0)
            this.$emit("changeMsg", 0)
          }
        })
      },
      changePage(page) {
        this.start = page
        this.getMessage()
      },
      addNewNotice() {
        let {title, description} = this.form
        let notice = this.uid
        let role = this.noticeRole
        let time = new Date().getTime()
        this.$refs.content.validate((validate) => {
          if (validate) {
            addNewNotice(title, description, time, notice, role).then((res) => {
              if (res.data.message == 'ok') {
                this.$Notice.success({
                  title: '发布成功'
                })
                let originMsgCount = localStorage.getItem('originCount')
                localStorage.setItem('originCount', originMsgCount*1 + 1)
                this.getMessage()
              } else {
                this.$Notice.error({
                  title: '发布失败，请稍后重试！'
                })
              }
              this.modal1 = false
            })
          }
          this.getMessage()
        })
      }
    }
  }

</script>

<style>
  .card_container {
    margin-bottom: 20px;
  }
  
  .notice_time {
    position: relative;
    margin-left: 48px;
    font-size: 10px;
    color: gray;
    margin-top: -6px;
  }
  
  .info_container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .avatar {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .page_container {
    position: absolute;
    right: 20px;
    margin-top: 30px;
  }
  
  .choice_btn {
    position: fixed;
    width: 340px;
    text-align: center;
    left: 50%;
    bottom: 80px;
    transform: translateX(-20px);
    margin: 0 auto;
  }
  
  .choice_tip {
    position: relative;
    margin-top: 10px;
  }
  
  .notice_btn {
    position: relative;
    margin-right: 15px;
  }
  
  .user-name {
    position: relative;
    display: inline-block;
    vertical-align: top;
    margin-left: 8px;
    height: 40px;
    line-height: 40px;
  }
  
  .title {
    position: relative;
    margin-bottom: 6px;
    color: gray;
    font-weight: bold;
  }
</style>