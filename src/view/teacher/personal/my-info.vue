<style lang="less">

</style>
<template>
  <div>
    <div class="goods-new">
      <Row>
        <Col span="5">
        <div class="user_container_wrapper">
          <div class="avatat_wrapper">
            <img class="user_avatar" :src="userInfo.avator" />
            <div class="user_name"><span>{{userInfo.name}}</span> | <span @click="showModal('avatarFlag')" class="change_avatar">修改头像</span></div>
          </div>
          <div class="user_tip_container">
            <div class="item" @click="goToPath('/teacher/graduation/choice-teacher')"> 毕设信息</div>
            <div class="item" @click="goToPath('/teacher/graduation/project-report')"> 完成课题</div>
            <div class="item" @click="goToPath('/teacher/graduation/my-mission')"> 发布任务</div>
            <div class="item" @click="goToPath('/message')"> 消息通知</div>
          </div>
        </div>
        </Col>
        <Col span="19">
        <div class="info_detail">
          <div class="detail_item">
            <div class="label">教师工号</div>
            <div class="value">{{userInfo.stu_number}}</div>
          </div>
          <div class="detail_item">
            <div class="label">教师学历</div>
            <div class="value">{{userInfo.level}}</div>
          </div>
          <div class="detail_item" label="专业方向">
            <div class="label">主管方向</div>
            <div class="value">{{userInfo.major}}</div>
          </div>
          <div class="detail_item" label="联系方式">
            <div class="label">联系方式</div>
            <div class="value">{{userInfo.phone?userInfo.phone:'暂无'}} | <span class="change_avatar" @click="showModal('phoneFlag')">修改</span></div>
          </div>
          <div class="detail_item">
            <div class="label">QQ号码</div>
            <div class="value">{{userInfo.qq?userInfo.qq:'暂无'}} | <span class="change_avatar" @click="showModal('qqFlag')">修改</span></div>
          </div>
          <div class="detail_item">
            <div class="label">教学经验</div>
            <div class="value">{{userInfo.experient}}年</div>
          </div>
          <div class="detail_item" label="我的导师">
            <div class="label">我的简介</div>
            <div class="value" :class="userInfo&&userInfo.role=='teacher'||'admin'?'description':''">{{userInfo.description}}</div>
          </div>
        </div>
        </Col>
      </Row>
      <Modal v-model="ok_modal" title="确认要更新？">
        <Form :model="form" :label-width="80">
          <FormItem v-if="qqFlag" label="qq号码">
            <Input width="100px" placeholder="请输入qq号码" v-model="form.qq"></Input>
          </FormItem>
          <FormItem v-if="phoneFlag" label="联系方式">
            <Input width="100px" v-model="form.phone"></Input>
          </FormItem>
        </Form>
        <Upload v-if="avatarFlag" type="drag" :max-size="2048" :format="['jpg','png','jpeg']" :action="uploadUrl" :on-exceeded-size="handleMaxSize"
          :on-success="handleSuccess">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>请上传头像！</p>
          </div>
          </Upload>

          <div slot="footer">
            <Button @click="updateInfo" type="primary">确认</Button>
          </div>
      </Modal>
    </div>
    <div class="choice_btn">
      <Button type="primary" @click="changeModal=true">修改登陆密码</Button>
      <p class="choice_tip">注意:为了您的信息安全，建议修改初始密码</p>
    </div>
    <Modal v-model="changeModal" title="确定要修改密码？" @on-ok="updatePs">
      <Form ref="formValidate" :model="form" :rules="ruleValidate" :label-width="80">
        <FormItem label="学号" prop="code">
          <Input v-model="form.code" placeholder="请输入你的工号"></Input>
        </FormItem>
        <FormItem label="旧密码" prop="password">
          <Input v-model="form.password" type="password" placeholder="请输入你的密码"></Input>
        </FormItem>
         <FormItem label="新密码" prop="newps">
          <Input v-model="form.newps" type="password" placeholder="请输入你的密码9至14位数字或英文字符"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import { getUserInfo,updateInfo } from '@/api/user'
   import {updatePs } from '@/api/teacher'
  import config from '@/config'
  const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
  const uploadUrl = baseUrl + '/upload/work'
  export default {
    name: 'teacher-my-info',
    data() {
      return {
        uploadUrl,
        form: {
          code: '',
          password: '',
          newps:''
        },
        changeModal: false,
        uploadList: [],
        qqFlag: false,
        phoneFlag: false,
        form: {
          qq: '',
          form: ''
        },
        avatarFlag: false,
        ok_modal: false,
        userInfo: {},
        ruleValidate: {
          code: [
            { required: true, message: '请输入正确的学号', trigger: 'blur', pattern: /^[0-9]{4}$/ }
          ],
          password: [
            { required: true, message: '请输入正确的密码', trigger: 'blur', pattern: /^[0-9a-zA-Z]{9,14}$/ }
          ],
          newps: [
            { required: true, message: '请输入正确的新密码', trigger: 'blur', pattern: /^[0-9a-zA-Z]{9,14}$/ }
          ]
        }
      }
    },
    methods: {
      updatePs() {
        this.$refs['formValidate'].validate((validate) => {
          let {code, password,newps} = this.form
          if (validate) {
            updatePs(code, password,newps).then((res) => {
              if (res.data.message == 'ok') {
                this.$store.dispatch('handleLogOut')
                this.$router.go(0)
              } else {
                this.$Notice.warning({
                  title: "用户名或密码不正确"
                })
              }
            })
          }
        })
      },
      goToPath(path) {
        this.$router.push({
          path
        })
      },
      showModal(type) {
        this.qqFlag = false
        this.phoneFlag = false
        this.avatarFlag = false
        this[type] = true
        this.ok_modal = true
      },
      getUserInfo(token, role) {
        getUserInfo(token, role).then((res) => {
          if (res.data.message == "ok") {
            this.userInfo = res.data
          }
        })
      },
      updateInfo() {
        let {token, role} = this.$store.state.user
        let type = ''
        let content = ''
        if (this.avatarFlag) {
          type = "avatar"
          if (this.uploadList.length == 0) {
            return
          }
          content = this.uploadList[0].url
        }
        if (this.qqFlag) {
          type = "qq"
          content = this.form.qq
          if (!/^[0-9]{5,10}$/.test(content)) {
            this.$Notice.warning({
              title: "qq格式不正确"
            })
            return
          }
        }
        if (this.phoneFlag) {
          type = "phone"
          content = this.form.phone
          if (!/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(content)) {
            this.$Notice.warning({
              title: "电话号码格式不正确"
            })
            return
          }
        }
        if (!type || !content) {
          return;
        }
        updateInfo(token, role, content, type).then((res) => {
          if (res.data.message == 'ok') {
            this.$Notice.success({
              title: '更新成功'
            })

            this.getUserInfo(token, role)
          } else {
            this.$Notice.error({
              title: '更新失败，请稍后重试'
            })
          }
          this.ok_modal = false
        })
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: "文件超过大小限制",
          desc: "文件大小不能查过2M！"
        });
      },
      handleSuccess(res, file) {
        var file = "https://" + res.data.url
        this.uploadList.push({ url: file, status: "finished" })
      }
    },
    mounted() {
      let {token, role} = this.$store.state.user
      this.getUserInfo(token, role)
    },

  }

</script>

<style>
  .info_detail {
    position: relative;
    background: white;
    padding: 20px;
    margin-left: 20px;
  }
  
  .info_detail .detail_item {
    position: relative;
    height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }
  
  .info_detail .detail_item .label {
    font-weight: bold;
    flex: 0 0 120px;
  }
  
  .info_detail .detail_item .value {
    flex: auto;
  }
  
  .user_container_wrapper {
    position: relative;
  }
  
  .avatat_wrapper {
    position: relative;
    padding: 25px 0;
    background: white;
    text-align: center;
  }
  
  .choice_btn {
    position: relative;
    text-align: center;
   margin-top: 200px;
  
  }
  
  .choice_tip {
    position: relative;
    margin-top: 10px;
  }
  
  .description {
    line-height: 22px;
  }
  
  .user_avatar {
    position: relative;
    margin: 0 auto;
    width: 80px;
    height: 80px;
    border: 50%;
    display: block;
    border-radius: 50%;
  }
  
  .user_name {
    position: relative;
    margin-top: 8px;
  }
  
  .change_avatar {
    position: relative;
    color: cadetblue;
    cursor: pointer;
  }
  
  .user_tip_container {
    position: relative;
    width: 100%;
    margin-top: 20px;
    background: white;
    font-size: 16px;
    padding: 18px 0
  }
  
  .user_tip_container .item {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 50px;
    line-height: 60px;
    cursor: pointer;
  }
  
  .user_tip_container .item:hover {
    background: #eee;
  }
</style>