<template>
  <div class="goods">
    <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时没有任务相关信息"></Table>
    <div class="page_container">
      <Page :total="totalSize" :page-size="size" @on-change="changePage" />
    </div>
    <Modal v-model="content_modal" width="700px" title="任务详情">
      <p class="content_title">{{contentInfo.title}}</p>
      <div style="width:996px;" v-html="contentInfo.content"></div>
    </Modal>
    <Modal v-model="modal1" width="580">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>你确认要新建任务吗？</span>
      </p>
      <Form :model="form" ref="content" :label-width="150" :rules="ruleInline">
        <FormItem prop="title" label="标题">
          <Input v-model="form.title" placeholder="请输入任务标题"></Input>
        </FormItem>
        <FormItem prop="description" label="描述">
          <Input v-model="form.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入任务描述"></Input>
        </FormItem>
        <FormItem prop="deadline" label="截至时间">
          <DatePicker v-model="form.deadline" type="datetime" placeholder="请选择截至时间" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="是否需要上传文件">
          <RadioGroup v-model="form.upload">
            <Radio label="0">
              <span>否</span>
            </Radio>
            <Radio label="1">
              <span>是</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否有任务附件">
          <RadioGroup v-model="form.download">
            <Radio label="0">
              <span>否</span>
            </Radio>
            <Radio label="1">
              <span>是</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="上传附件" v-if="form.download=='1'">
          <Upload type="drag" :max-size="20480" :format="['doc']" :action="uploadUrl" :on-exceeded-size="handleMaxSize" :on-success="handleSuccess">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>请上传任务附件！</p>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="addNewMission">确认新建</Button>
      </div>
    </Modal>
    <div class="choice_btn">
      <Button @click="modal1=true" type="success">添加新任务</Button>
      <p class="choice_tip">注意：任务发布后无需审核即可在学生端展示</p>
    </div>
  </div>
</template>
<script>
  import { getTeacherMission, addNewMission } from '@/api/teacher'
  import { getMyDate } from '@/libs/tools'
  import config from '@/config'
  const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
  const uploadUrl = baseUrl + '/upload/work'
  export default {
    name: "my-mission",
    data() {
      return {
        modal1: false,
        form: {
          title: '',
          description: '',
          upload: '1',
          download: '1',
          deadline: ''
        },
        uploadUrl,
        MyChoice: [],
        mission: {},
        uploadList: [],
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
                this.tableData[params.status] == 0 ? '进行中' : '已超时')
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
                )
              ]);
            }
          }
        ],
        ruleInline: {
          title: [
            { required: true, message: '课题名称不能少于四个字多余20个字', trigger: 'blur', type: 'string' }
          ],
          description: [
            { required: true, message: '课题描述不能少于十个字多余五十个字', trigger: 'blur', type: 'string' }
          ]
        }
      };
    },
    created() {
      this.$nextTick(() => {
        this.userInfo = this.$store.state.user
        this.getTeacherMission()
      })
    },
    methods: {
      addNewMission() {
        let {title, description, upload, download, deadline} = this.form
        if(deadline==''){
          this.$Notice.warning({
            title:'请选择截至时间'
          })
          return
        }

        deadline = new Date(deadline).getTime()
        let token = this.userInfo.token
        let file = ''
     
        if (upload == 1) {
          if (this.uploadList.length <= 0) {
            return
          }
          file = this.uploadList[0].url
        }
        let time = new Date().getTime()
           console.log(title, description, upload, download, deadline,time)
        addNewMission(title, description, upload, download, token, file, time, deadline).then((res) => {
          if (res.data.message == 'ok') {
            this.$Notice.success({
              title: '提交成功'
            })
            this.modal1 = false
            this.getTeacherMission()
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
        this.getTeacherMission()
      },
      getTeacherMission() {
        let token = this.userInfo.token
        let page = this.page
        let size = this.size
        getTeacherMission(token, page, size).then((res) => {
          let now = new Date().getTime()
          if (res.data.message == 'ok') {
            this.tableData = res.data.missions
            this.totalSize = res.data.count
            this.tableData.forEach((item) => {
              if (now > item.deadline) {
                item.status = -1
              }
              item.time = getMyDate(item.time, "yyyy-MM-dd")
              item.deadline = getMyDate(item.deadline, "yyyy-MM-dd")
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
  
  .choice_btn {
    position: fixed;
    width: 430px;
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
</style>