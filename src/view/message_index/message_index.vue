<style lang="less">
  @import './message_index.less';
</style>

<template>
  <div class="message">
    <Card class="card_container" v-for="(item,index) in messageList" :key="index" :bordered="false">
      <div slot="title">
        <img class="avatar" :src="item.avatar" />
        <span class="user-name">发布人：{{item.username}}</span>
      </div>
      <p class="title">{{item.title}}</p>
      <p >{{item.content}}</p>
    </Card>
  </div>
</template>

<script>
  import { getMessage } from '@/api/message'
  export default {
    data(){
      return {
        messageList:[],
        start: 0
      }
    },
    components: {

    },
    mounted() {
      let uid = this.$store.state.user.token
      let start = this.start
      getMessage({ uid,start }).then((res) => {
        if (res.data.message == 'ok') {
          this.messageList = res.data.list
            this.$store.commit('setMsgCount',0) 
        }
      })
    },
    methods: {
    }
  }

</script>

<style>
  .card_container {
    margin-bottom: 20px;
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
  
  .user-name {
    position: relative;
    display: inline-block;
    vertical-align: top;
    margin-left: 8px;
    height: 40px;
    line-height: 40px;
  }
  .title{
    position: relative;
    margin-bottom: 6px;
    color: gray;
    font-weight: bold;
  }
</style>