<template>
  <div class="goods">

    <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时还没有上传过论文"></Table>
    <div class="btn_container">
      <Button :disabled="!flag" type="success" @click="ok_modal=true">点击上传新论文</Button>
    </div>
    <div class="page_container">
      <Page :total="totalSize" :page-size="size" @on-change="changePage" />
    </div>
    <Modal v-model="content_modal" width="1000px" title="导师修改意见">
      <div style="width:996px;" v-html="description"></div>
    </Modal>
    <Modal v-model="ok_modal" title="确认上传新论文？">
      <Upload type="drag" :max-size="20480" :format="['doc']" :action="uploadUrl" :on-exceeded-size="handleMaxSize" :on-success="handleSuccess">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>按照论文要求/或导师意见上传论文！</p>
        </div>
      </Upload>

      <div slot="footer">
        <Button @click="submitPapper" type="primary">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { getOldPapper, submitPapper } from '@/api/teacher'
  import { getMyDate } from '@/libs/tools'
  import config from '@/config'
  const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
  const uploadUrl = baseUrl + '/upload/work'
  export default {
    name: "submit-papper",
    data() {
      return {
        flag: true,
        description: '',
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
        tid: '',
        userInfo: {},
        page: 1,
        size: 10,
        tableData: [],
        multiple: false,
        limit: 1,
        columns: [
          {
            title: '导师',
            key: 'name',
            align: 'center'
          },
          {
            title: '论文标题',
            key: 'title',
            align: 'center'
          },
          {
            title: "附件信息",
            key: "download",
            align: "center",
            render: (h, params) => {
              return h(this.tableData[params.index].download == 1 ? 'a' : "div", {
                domProps: {
                  href: this.tableData[params.index].tip,
                  download: "w3logo"
                },
              },
                this.tableData[params.index].download == 1 ? '下载附件' : '无附件')
            }
          },
          {
            title: '提交时间',
            key: 'time',
            align: 'center'
          },
          {
            title: '截至时间',
            key: 'deadline',
            align: 'center'
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            render: (h, params) => {
              return h("span", {
              },
                this.tableData[params.index].status == 0 ? '审核中' : this.tableData[params.index].status == -1 ? '未通过' : this.tableData[params.index].status == 1 ? '已完成' : '已超时')
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
                        let {description} = this.tableData[params.index]
                        if (this.tableData[params.index].status == 0) {
                          return
                        }
                        this.seeDetail(description);
                      }
                    }
                  },
                  this.tableData[params.index].status == 0 ? '请耐心等待审核结果' : '查看导师意见'
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
        this.getOldPapper()
      })
    },
    methods: {
      submitPapper() {
        let token = this.userInfo.token
        let tid = this.tid
        if (this.uploadList.length <= 0) {
          return
        }
        let file = this.uploadList[0].url
        let time = new Date().getTime()
        submitPapper(tid, token, time, file).then((res) => {
          if (res.data.message == 'ok') {
            this.$Notice.success({
              title: '提交成功'
            })
            this.ok_modal = false
            this.getOldPapper()
          }
        })
      },
      seeDetail(description) {
        this.description = description
        this.content_modal = true
      },
      changePage(page) {
        this.page = page
        this.getOldPapper()
      },
      getOldPapper() {
        let token = this.userInfo.token
        let year = this.userInfo.year
        let page = this.page
        let size = this.size
        getOldPapper(token, page, size, year).then((res) => {
          let now = new Date().getTime()
          if (res.data.message == 'ok') {
            this.tid = res.data.tid
            this.tableData = res.data.papperList
            let name = res.data.name
            let title = res.data.title
            let deadline = res.data.deadline
            res.data.papperList.map((item) => {
              item.name = name
              item.title = title
              if (item.time > deadline) {
                item.status = -2
              }
              item.time = getMyDate(item.time, "yyyy-MM-dd")
              item.deadline = getMyDate(deadline, "yyyy-MM-dd")
              return item
            })
            this.tableData = res.data.papperList
            this.totalSize = res.data.count

          } else if (res.data.message == 'noStart') {
            this.flag = false
            this.$Notice.warning({
              title: '请先选择课题'
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
  
  .btn_container {
    position: absolute;
    bottom: 90px;
    left: 50%;
    transform: translateX(-20px);
  }
</style>