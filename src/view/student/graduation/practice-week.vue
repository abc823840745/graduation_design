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
    <Modal v-model="content_modal" title="周报详情" @on-ok="ok">
      <p class="content_title">{{contentInfo.title}}</p>
      <div style="width:500px;" v-html="contentInfo.content"></div>
    </Modal>
  </div>
</template>
<script>
  import expandRow from './component/newWeek_expand.vue';
  import { getMyDate } from '@/libs/tools'
  import { getStart, getOldReport } from '@/api/teacher'
  export default {
    name: 'practice-week',
    data() {
      return {
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
            more_time: 0,
            dead_line: '',
            score: '暂无',
            content: ''
          }, {
            week: 2,
            status: -1,
            type: 'work',
            more_time: 0,
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 3,
            status: -1,
            type: 'work',
            more_time: 0,
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 4,
            status: -1,
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
            type: 'mission',
            more_time: 0,
            dead_line: '',
            score: '暂无',
            content: ''
          }, {
            week: 2,
            status: -1,
            type: 'mission',
            more_time: 0,
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 3,
            status: -1,
            type: 'mission',
            more_time: 0,
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 4,
            status: -1,
            more_time: 0,
            type: 'mission',
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 5,
            status: -1,
            more_time: 0,
            type: 'mission',
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 6,
            status: -1,
            more_time: 0,
            type: 'mission',
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 7,
            status: -1,
            more_time: 0,
            type: 'mission',
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 8,
            status: -1,
            more_time: 0,
            score: '暂无',
            type: 'mission',
            dead_line: '',
            content: ''
          }, {
            week: 9,
            status: -1,
            type: 'mission',
            more_time: 0,
            score: '暂无',
            dead_line: '',
            content: ''
          }, {
            week: 10,
            status: -1,
            type: 'mission',
            more_time: 0,
            score: '暂无',
            dead_line: '',
            content: ''
          }],
        missionCol: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row
                }
              })
            }
          },
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
            key: "status",
            align: "center",
            render: (h, params) => {
              return h("Tag", {
                props: {
                  color: this.missionReport[params.index].status == -2 ? 'error' : this.missionReport[params.index].status == 0 ? 'cyan' : this.missionReport[params.index].status == -1 ? 'gold' : this.missionReport[params.index].status == 1 ? 'geekblue' : 'success'
                },
              },
                this.missionReport[params.index].status == -2 ? '已超时' : this.missionReport[params.index].status == 0 ? '进行中' : this.missionReport[params.index].status == -1 ? '未开始' : this.missionReport[params.index].status == 1 ? '审核中' : this.missionReport[params.index].status == 3 ? '已保存' : '已完成')
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
                      type: this.missionReport[params.index].status == 2||this.missionReport[params.index].status == 1 ? "primary" : 'warning'
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        if (this.missionReport[params.index].status == 2||this.missionReport[params.index].status == 1) {
                          let {week, content} = this.missionReport[params.index]
                          let title = '第' + week + '周'
                          this.seeDetail(title, content);
                        }

                      }
                    }
                  },
                  this.missionReport[params.index].status == 2||this.missionReport[params.index].status == 1 ? '查看详情' : '待完成'
                )
              ]);
            }
          }
        ],
        weekCol: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row
                }
              })
            }
          },
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
            key: "status",
            align: "center",
            render: (h, params) => {
              return h("Tag", {
                props: {
                  color: this.weekReport[params.index].status == -2 ? 'error' : this.weekReport[params.index].status == 0 ? 'cyan' : this.weekReport[params.index].status == -1 ? 'gold' : this.weekReport[params.index].status == 1 ? 'geekblue' : 'success'
                },
              },
                this.weekReport[params.index].status == -2 ? '已超时' : this.weekReport[params.index].status == 0 ? '进行中' : this.weekReport[params.index].status == -1 ? '未开始' : this.weekReport[params.index].status == 1 ? '审核中' : this.weekReport[params.index].status == 3 ? '已保存' : '已完成')
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
                      type: this.weekReport[params.index].status == 2||this.weekReport[params.index].status == 1  ? "primary" : 'warning'
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        if (this.weekReport[params.index].status == 2 ||this.weekReport[params.index].status == 1) {
                          let {week, content} = this.weekReport[params.index]
                          let title = '第' + week + '周'
                          this.seeDetail(title, content);
                        }

                      }
                    }
                  },
                  this.weekReport[params.index].status == 2 ||this.weekReport[params.index].status == 1 ? '查看详情' : '待完成'
                )
              ]);
            }
          }
        ],
      }
    },
    mounted() {
      this.getMissionStart()
      this.getWorkStart()
    },
    methods: {
      ok() { },
      seeDetail(title, content) {
        this.contentInfo.title = title
        this.contentInfo.content = content
        this.content_modal = true
      },
      getWorkStart() {
        let {year, token} = this.$store.state.user
        getStart('work', year, token).then((res) => {
          let now = new Date().getTime()
          if (res.data.message == 'ok') {
            let startTime = res.data.startTime * 1
            let oldReport = res.data.oldReport
            this.weekReport.forEach((item, index) => {
              let countTime = startTime + (24 * 60 * 60 * 1000 * 14)
              item.dead_line = getMyDate(countTime, "yyyy-MM-dd")
              if (now > countTime) {
                item.status = -2
                item.more_time = 1
              } else if (now < countTime) {
                item.status = 0
              }
            })
            oldReport.map((item) => {
              this.weekReport[item.week - 1].content = item.content
              if (item.save == 0) {
                this.weekReport[item.week - 1].status = 3
              } else if (item.status == 1) {
                this.weekReport[item.week - 1].status = 2
                this.weekReport[item.week - 1].score = item.score
              } else if (item.status == 0) {
                this.weekReport[item.week - 1].status = 1
              }
            })
            console.log(this.weekReport)
          } else {
            this.$Notice.warning({
              title: '周报任务暂时还没开始！'
            })
          }
        })
      },
      getMissionStart() {
        let {year, token} = this.$store.state.user
        getStart('mission', year, token).then((res) => {
          let now = new Date().getTime()
          if (res.data.message == 'ok') {
            let startTime = res.data.startTime * 1
            let oldReport = res.data.oldReport
            this.missionReport.forEach((item, index) => {
              let countTime = startTime + (24 * 60 * 60 * 1000 * 14) * index
              item.dead_line = getMyDate(countTime, "yyyy-MM-dd")
              if (now > countTime) {
                item.status = -2
                item.more_time = 1
              } else if (now < countTime && (now + (24 * 60 * 60 * 1000 * 14)) > countTime) {
                item.status = 0
              }
            })
            oldReport.map((item) => {
              this.missionReport[item.week - 1].content = item.content
              if (item.save == 0) {
                this.missionReport[item.week - 1].status = 3
              } else if (item.status == 1) {
                this.missionReport[item.week - 1].status = 2
                this.missionReport[item.week - 1].score = item.score
              } else if (item.status == 0) {
                this.missionReport[item.week - 1].status = 1
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