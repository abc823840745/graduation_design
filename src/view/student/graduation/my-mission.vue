<template>
  <div class="goods">
    <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时没有任务相关信息"></Table>
    <div class="page_container">
      <Page :total="totalSize" :page-size="size" @on-change="changePage" />
    </div>
    <Modal v-model="content_modal" title="任务详情">
      <p class="content_title">{{contentInfo.title}}</p>
      <div v-html="contentInfo.content"></div>
    </Modal>
    <Modal v-model="ok_modal" title="确认已完成该任务">
      <Upload type="drag" :max-size="20480" :format="['doc']" :action="uploadUrl" :on-exceeded-size="handleMaxSize" :on-success="handleSuccess">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>按照该任务需求上传相应附件！</p>
        </div>
      </Upload>
      <div slot="footer">
      <Button @click="completeMission" type="primary">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { getMyMission, completeMission } from '@/api/teacher'
  import { getMyDate } from '@/libs/tools'
  import config from '@/config'
  const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
  const uploadUrl = baseUrl + '/upload/work'
  export default {
    name: "my-mission",
    data() {
      return {
        uploadUrl,
        MyChoice: [],
        mission: {},
        uploadList: [],
        ok_modal: false,
        totalSize: 0,
        content_modal: false,
        contentInfo: {
          title: '',
          content: ''
        },
        userInfo: {},
        page: 1,
        size: 10,
        tableData: [],
        multiple: false,
        limit: 1,
        columns: [
          {
            title: '发布人',
            key: 'name',
            width: 200,
            align: 'center'
          },
          {
            title: '任务标题',
            key: 'title',
            align: 'center'
          },
          {
            title: "附件信息",
            key: "download",
            width: 200,
            align: "center",
            render: (h, params) => {
              return h(this.tableData[params.index].download == 1 ? 'a' : "div", {
                domProps: {
                  href: this.tableData[params.index].file,
                  download: "w3logo"
                },
              },
                this.tableData[params.index].download == 1 ? '下载附件' : '无附件')
            }
          },
          {
            title: '发布时间',
            key: 'time',
            width: 200,
            align: 'center'
          },
          {
            title: '截至时间',
            key: 'deadline',
            width: 200,
            align: 'center'
          },
          {
            title: "状态",
            key: "status",
            width: 200,
            align: "center",
            render: (h, params) => {
              return h("span", {
              },
                this.myChoice.indexOf(this.tableData[params.index].id) != -1 ? '已完成' : this.tableData[params.index].status == 0 ? '未完成' : '已超时')
            }
          },
          {
            title: "操作",
            key: "action",
            width: 300,
            align: "center",
            render: (h, params) => {
              return h('div', [
                h(
                  "Button",
                  {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        let {title, content} = this.tableData[params.index]
                        this.seeDetail(title, content);
                      }
                    }
                  },
                  '查看详情'
                ),
                h(
                  'Button',
                  {
                    props: { type: "success" },
                    style: {
                      marginRight: "20px"
                    },
                    on: {
                      click: () => {
                        if (this.myChoice.indexOf(this.tableData[params.index].id) == -1) {
                          this.ok_modal = true
                          this.mission = this.tableData[params.index]
                        }
                      }
                    }
                  },
                  this.tableData[params.index].upload == 1 && this.myChoice.indexOf(this.tableData[params.index].id) == -1 ? '上传附件' : this.myChoice.indexOf(this.tableData[params.index].id) != -1 ? '任务已完成' : '确认完成'
                )
              ]);
            }
          }
        ]
      };
    },
    created() {
      this.$nextTick(() => {
        this.userInfo = this.$store.state.user
        this.getMyMission()
      })
    },
    methods: {
      completeMission() {
        let {upload, id} = this.mission
        let token = this.userInfo.token
        let file = ''
        if (upload == 1) {
          if (this.uploadList.length <= 0) {
            return
          }
          file = this.uploadList[0].url
        }
        completeMission(id, token, file).then((res) => {
          if (res.data.message == 'ok') {
            this.$Notice.success({
              title: '提交成功'
            })
            this.ok_modal = false
            this.getMyMission()
          }
        })
      },
      seeDetail(title, content) {
        this.contentInfo.title = title
        this.contentInfo.content = content
        this.content_modal = true
      },
      changePage(page) {
        this.page = page
        this.getMyMission()
      },
      getMyMission() {
        let token = this.userInfo.token
        let page = this.page
        let size = this.size
        getMyMission(token, page, size).then((res) => {
          let now = new Date().getTime()
          if (res.data.message == 'ok') {
            this.tableData = res.data.missions
            this.myChoice = res.data.myChoice.map((item) => item.mid)
            this.totalSize = res.data.count
            this.tableData.forEach((item) => {
              if (now > item.deadline) {
                item.status = -1
              }
              item.time = getMyDate(item.time, "yyyy-MM-dd")
              item.deadline = getMyDate(item.deadline, "yyyy-MM-dd")
            })

          } else if (res.data.message == 'noChoice') {
            this.$Notice.warning({
              title: '请先选择导师'
            })
          }

        })
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: "文件超过大小限制",
          desc: "文件大小不能查过20M！"
        });
      },
      handleSuccess(res, file) {
        var file = "https://" + res.data.url
        this.uploadList.push({ url: file, status: "finished" })
      }
    }
  };

</script>
<style>
  .content_title {
    position: relative;
    text-align: center;
    margin: 10px 0;
    font-size: 16px;
    font-weight: bold;
  }
  
  .page_container {
    position: absolute;
    right: 20px;
    margin-top: 30px;
  }
</style>