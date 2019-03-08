<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" :bordered="false">
        <p slot="title" style="text-align:center">游戏系教学管理平台</p>
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">欢迎登录</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import LoginForm from '_c/login-form'
  import { mapActions, mapMutations } from 'vuex'
 
  export default {
    components: {
      LoginForm
    },
    computed: {
      tagNavList() {
        return this.$store.state.app.tagNavList
      }
    },
    methods: {
       ...mapMutations([
      'setTagNavList'
    ]),
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
      handleSubmit({ userName, password }) {
        this.handleLogin({ userName, password }).then(res => {
          this.getUserInfo().then(res => {
            let route = this.tagNavList.filter(item => item.name === this.$config.homeName)
            this.handleCloseTag(route, 'all')
            
          })
        }).catch(()=>{
          this.$Notice.error({
            title:'用户名或密码不正确！'
          })
        })
      },
      handleCloseTag(res, type, route) {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        }
        this.setTagNavList(res)
      },
      turnToPage(route) {
        let { name, params, query } = {}
        if (typeof route === 'string') name = route
        else {
          name = route.name
          params = route.params
          query = route.query
        }
        if (name.indexOf('isTurnByHref_') > -1) {
          window.open(name.split('_')[1])
          return
        }
        this.$router.push({
          name,
          params,
          query
        })
      },
    }
  }

</script>

<style>

</style>