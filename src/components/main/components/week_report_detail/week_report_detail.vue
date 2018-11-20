<style lang="less">

</style>
<template>
  <div>
    <Tabs>
      <TabPane label="任务周报" icon="logo-windows">
        <div>
          <Table :columns="missionCol" :data="missionReport"></Table>
        </div>
      </TabPane>
      <TabPane label="实习周报" icon="logo-windows">
        <div>
          <Table :columns="weekCol" :data="weekReport"></Table>
        </div>
      </TabPane>
    </Tabs>
    <Modal v-model="content_modal" width="1000px" title="周报详情" @on-ok="ok">
      <p class="content_title">{{contentInfo.title}}</p>
      <div style="width:996px;" v-html="contentInfo.content"></div>
    </Modal>
    <Modal v-model="scoreModal" width="400px" title="给该周报打分" @on-ok="ok">
      <p class="content_title">第{{week}}周</p>
      <Form :model="scoreForm" :label-width="50">
        <Form-item label="分数" prop="score">
          <Input-number :max="100" :min="1" :value="score" @on-change="changeScore"></Input-number>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="updateScore">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { getMyDate } from '@/libs/tools'
  import { getStart, updateScore } from '@/api/teacher'
  export default {
    name: 'practice-week',
    data() {
      return {
        score: 90,
        scoreForm: {},
        scoreModal: false,
        week: 0,
        uid: '',
        content_modal: false,
        contentInfo: {
          title: '',
          content: ''
        },
        weekReport: [
          {
            week: 1,
            type: 'work',
            status: -1,
            state: -1,
            more_time: 0,
            dead_line: '',
            score: '暂无',
            content: ''
          }, {
            week: 2,
            status: -1,
            state: -1,
            type: 'work',
            more_time: 0,
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 3,
            status: -1,
            state: -1,
            type: 'work',
            more_time: 0,
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 4,
            status: -1,
            state: -1,
            type: 'work',
            more_time: 0,
            score: '暂无',
            dead_line: '',
            content: ''
          }],
        missionReport: [
          {
            week: 1,
            status: -1,
            state: -1,
            type: 'mission',
            more_time: 0,
            dead_line: '',
            score: '暂无',
            content: ''
          }, {
            week: 2,
            status: -1,
            state: -1,
            type: 'mission',
            more_time: 0,
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 3,
            status: -1,
            state: -1,
            type: 'mission',
            more_time: 0,
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 4,
            status: -1,
            state: -1,
            more_time: 0,
            type: 'mission',
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 5,
            status: -1,
            state: -1,
            more_time: 0,
            type: 'mission',
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 6,
            status: -1,
            more_time: 0,
            state: -1,
            type: 'mission',
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 7,
            status: -1,
            state: -1,
            more_time: 0,
            type: 'mission',
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 8,
            status: -1,
            more_time: 0,
            state: -1,
            score: '暂无',
            type: 'mission',
            dead_line: '',
            content: ''
          }, {
            week: 9,
            status: -1,
            state: -1,
            type: 'mission',
            more_time: 0,
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 10,
            status: -1,
            state: -1,
            type: 'mission',
            more_time: 0,
            score: '暂无',
            dead_line: '',
            content: ''
          }],
        missionCol: [
          {
            title: "名称",
            key: "week",
            align: "center",
            render: (h, params) => {
              return h("div", {
              },
                '第' + this.missionReport[params.index].week + '周')
            }
          },
          {
            title: "状态",
            key: "state",
            align: "center",
            render: (h, params) => {
              return h("Tag", {
                props: {
                  color: this.missionReport[params.index].state == -2 ? 'error' : this.missionReport[params.index].state == 0 ? 'cyan' : this.missionReport[params.index].state == -1 ? 'gold' : this.missionReport[params.index].state == 1 ? 'geekblue' : 'success'
                },
              },
                this.missionReport[params.index].state == -2 ? '已超时' : this.missionReport[params.index].state == 0 ? '进行中' : this.missionReport[params.index].state == -1 ? '未开始' : this.missionReport[params.index].state == 1 ? '审核中' : this.missionReport[params.index].state == 3 ? '已保存' : this.missionReport[params.index].more_time == 1?'超时完成':'已完成')
            }
          },
          {
            title: "成绩",
            key: "score",
            align: "center",
            render: (h, params) => {
              return h("span", {
              },
                this.missionReport[params.index].score)
            }
          },
          {
            title: '结束时间',
            key: 'dead_line'
          },
          {
            title: "操作",
            key: "action",

            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: this.missionReport[params.index].status == 2 || this.missionReport[params.index].save == 1 ? "primary" : 'warning'
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        if (this.missionReport[params.index].status == 2 || this.missionReport[params.index].save == 1) {
                          let {week, content} = this.missionReport[params.index]
                          let title = '第' + week + '周'
                          this.seeDetail(title, content);
                        }

                      }
                    }
                  },
                  this.missionReport[params.index].status == 2 || this.missionReport[params.index].save == 1 ? '查看详情' : '待完成'
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: this.missionReport[params.index].save == 1&& this.missionReport[params.index].more_time != 1 || this.missionReport[params.index].save == 2&& this.missionReport[params.index].more_time != 1 ? "success" : 'warning'
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        if (this.missionReport[params.index].save == 1&&this.missionReport[params.index].status != 2) {
                          let {type, week} = this.missionReport[params.index]
                          let title = '第' + week + '周'
                          this.setScore(type, week);
                        }

                      }
                    }
                  },
                  this.missionReport[params.index].save == 1&& this.missionReport[params.index].status != 2 ? '周报评分' : this.missionReport[params.index].status == 2 && this.missionReport[params.index].more_time == 1 ? "超时完成" : this.missionReport[params.index].status == 2 ? '按时完成' : '尚未完成'
                )
              ]);
            }
          }
        ],
        weekCol: [
          {
            title: "名称",
            key: "week",
            align: "center",
            render: (h, params) => {
              return h("div", {
              },
                '第' + this.weekReport[params.index].week + '周')
            }
          },
          {
            title: "状态",
            key: "state",
            align: "center",
            render: (h, params) => {
              return h("Tag", {
                props: {
                  color: this.weekReport[params.index].state == -2 ? 'error' : this.weekReport[params.index].state == 0 ? 'cyan' : this.weekReport[params.index].state == -1 ? 'gold' : this.weekReport[params.index].state == 1 ? 'geekblue' : 'success'
                },
              },
                this.weekReport[params.index].state == -2 ? '已超时' : this.weekReport[params.index].state == 0 ? '进行中' : this.weekReport[params.index].state == -1 ? '未开始' : this.weekReport[params.index].state == 1 ? '审核中' : this.weekReport[params.index].state == 3 ? '已保存' : this.weekReport[params.index].more_time == 1?'超时完成':'已完成')
            }
          },
          {
            title: "成绩",
            key: "score",
            align: "center",
            render: (h, params) => {
              return h("span", {
              },
                this.weekReport[params.index].score)
            }
          },
          {
            title: '结束时间',
            key: 'dead_line'
          },
          {
            title: "操作",
            key: "action",

            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: this.weekReport[params.index].state == 2 || this.weekReport[params.index].save == 1 ? "primary" : 'warning'
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        if (this.weekReport[params.index].state == 2 || this.weekReport[params.index].save == 1) {
                          let {type, week, content} = this.weekReport[params.index]
                          let title = '第' + week + '周'
                          this.seeDetail(title, content);
                        }

                      }
                    }
                  },
                  this.weekReport[params.index].status == 2 || this.weekReport[params.index].save == 1 ? '查看详情' : '待完成'
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: this.weekReport[params.index].save == 1 && this.weekReport[params.index].more_time != 1 || this.weekReport[params.index].status == 2&& this.weekReport[params.index].more_time != 1  ? "success" : 'warning'
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        if (this.weekReport[params.index].save == 1&&this.weekReport[params.index].status != 2) {
                          let {type, week} = this.weekReport[params.index]
                          let title = '第' + week + '周'
                          this.setScore(type, week);
                        }

                      }
                    }
                  },
                  this.weekReport[params.index].save == 1 && this.weekReport[params.index].status != 2 ? '周报评分' : this.weekReport[params.index].status == 2 && this.weekReport[params.index].more_time == 1 ? "超时完成" : this.weekReport[params.index].status == 2 ? '按时完成' : '尚未完成'
                )
              ]);
            }
          }
        ],
      }
    },
    mounted() {
      this.uid = this.$route.query.uid
      this.getMissionStart()
      this.getWorkStart()
    },
    methods: {
      ok() { },
      changeScore(score) {
        this.score = score
      },
      updateScore() {

        updateScore(this.uid, this.type, this.week, this.score).then((res) => {
          if (res.data.message == 'ok') {
            this.$Notice.success({
              title: '打分成功'
            })
            if (this.type == 'mission') {
              this.getMissionStart()
            } else {
              this.getWorkStart()
            }
            this.scoreModal = false
          }
        })
      },
      setScore(type, week) {
        this.type = type
        this.week = week
        this.scoreModal = true
      },
      seeDetail(title, content) {
        this.contentInfo.title = title
        this.contentInfo.content = content
        this.content_modal = true
      },
      getWorkStart() {
        let year = this.$store.state.user.choiceBegin
        let token = this.uid
        getStart('work', year, token).then((res) => {
          let now = new Date().getTime()
          if (res.data.message == 'ok') {
            let startTime = res.data.startTime * 1
            let oldReport = res.data.oldReport
            this.weekReport.forEach((item, index) => {
              let countTime = startTime + (24 * 60 * 60 * 1000 * 14)
              item.dead_line = getMyDate(countTime, "yyyy-MM-dd")
              if (now > countTime) {
                item.state = -2
              } else if (now < countTime) {
                item.state = 0
              }
            })
            oldReport.map((item) => {
              this.weekReport[item.week - 1].content = item.content
              this.weekReport[item.week - 1].status = item.status
              this.weekReport[item.week - 1].more_time = item.more_time
                this.weekReport[item.week - 1].save = item.save
              if (item.save == 0) {
                this.weekReport[item.week - 1].state = 3
              } else if (item.save == 1&&item.status == 0) {
                this.weekReport[item.week - 1].state = 1
              } else if (item.status == 2) {
                this.weekReport[item.week - 1].state = 2
                this.weekReport[item.week - 1].score = item.score
              }
            })
          } else {
            this.$Notice.warning({
              title: '周报任务暂时还没开始！'
            })
          }
        })
      },
      getMissionStart() {
        let year = this.$store.state.user.choiceBegin
        let token = this.uid
        getStart('mission', year, token).then((res) => {
          let now = new Date().getTime()
          if (res.data.message == 'ok') {
            let startTime = res.data.startTime * 1
            let oldReport = res.data.oldReport
            this.missionReport.forEach((item, index) => {
              let countTime = startTime + (24 * 60 * 60 * 1000 * 14) * index
              item.dead_line = getMyDate(countTime, "yyyy-MM-dd")
              if (now > countTime) {
                item.state = -2
                item.more_time = 1
              } else if (now < countTime && (now + (24 * 60 * 60 * 1000 * 14)) > countTime) {
                item.state = 0
              }
            })
            oldReport.map((item) => {
              this.missionReport[item.week - 1].content = item.content
              this.missionReport[item.week - 1].more_time = item.more_time
              this.missionReport[item.week - 1].status = item.status
               this.missionReport[item.week - 1].save = item.save
              if (item.save == 0) {
                this.missionReport[item.week - 1].state = 3
              } else if (item.save == 1&&item.status == 0) {
                this.missionReport[item.week - 1].state = 1
              } else if (item.status == 2) {
                this.missionReport[item.week - 1].state = 2
                this.missionReport[item.week - 1].score = item.score
              }
            })
          } else {
            this.$Notice.warning({
              title: '周报任务暂时还没开始！'
            })
          }
        })
      }
    },
  }

</script>
<style>
  .content_title {
    position: relative;
    text-align: center;
    margin: 10px 0;
    font-size: 16px;
    font-weight: bold;
  }
</style>