<template>
  <div>
    <div v-if="access=='student'">
      <Row :gutter="20">
        <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
          <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
            <count-to :end="infor.count" count-class="count-style" />
            <p>{{ infor.title }}</p>
          </infor-card>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 10px;">
        <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
          <Card shadow>
            <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
          </Card>
        </i-col>
        <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
          <Card shadow>
            <chart-bar style="height: 300px;" :value="barData" text="每周活跃量" />
          </Card>
        </i-col>
      </Row>
    </div>
    <div v-if="access=='teacher'">
      教师首页
    </div>

  </div>
</template>

<script>
  import InforCard from '_c/info-card'
  import CountTo from '_c/count-to'
  import { ChartPie, ChartBar } from '_c/charts'
  import Example from './example.vue'
  import { mapMutations, mapActions, mapGetters } from 'vuex'
 import { getNewMessage } from '@/api/message'
  export default {
    name: 'student-teacher-home',
    components: {
      InforCard,
      CountTo,
      ChartPie,
      ChartBar,
      Example
    },
    data() {
      return {
        access: '',
        inforCardData: [
          { title: '课程动态', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
          { title: '毕设通知', icon: 'md-locate', count: 232, color: '#19be6b' },
          { title: '在线问答', icon: 'md-help-circle', count: 142, color: '#ff9900' },
          { title: '分享统计', icon: 'md-share', count: 657, color: '#ed3f14' },
          { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
          { title: '作业区', icon: 'md-map', count: 14, color: '#9A66E4' }
        ],
        pieData: [
          { value: 335, name: '作业' },
          { value: 310, name: '毕设' },
          { value: 234, name: '课程' },
          { value: 135, name: '问答' }
        ],
        barData: {
          Mon: 13253,
          Tue: 34235,
          Wed: 26321,
          Thu: 12340,
          Fri: 24643,
          Sat: 1322,
          Sun: 1324
        }
      }
    },
    mounted() {
      this.getUserAccess()
     this.getNewMessage()
    },
    methods: {
    ...mapActions([
      'getAccess'
    ]),
     getNewMessage() {
        let uid = this.$store.state.user.token
        getNewMessage({ uid }).then((res) => {
          if (res.data.message == 'ok') {
           this.$store.commit('setMsgCount',res.data.count) 
          }
        })
      },
      getUserAccess() {
        this.getAccess().then(res => {
          this.access = res[0]
        })
      }
    },
  }

</script>

<style lang="less">
  .count-style {
    font-size: 50px;
  }
</style>