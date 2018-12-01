<style lang="less">

</style>
<template>
  <div class="container">
    <Tabs>
      <TabPane style="height:700px;" label="教师开题" icon="ios-book">
        <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时未到开题时间"></Table>
        <div class="page_container">
          <Page :total="total" :page-size="pageSize" @on-change="changePage" />
        </div>
      </TabPane>
    </Tabs>
    <Modal v-model="modal1" width="1100">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>每人一共选择三个课题，你确认提交选择意向吗？</span>
      </p>
      <div slot="footer">
        <Button type="primary" size="large" long @click="choiceGraduationWork">提交</Button>
      </div>
    </Modal>
    <Modal v-model="addModal">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>确定添加新课题吗？</span>
      </p>
      <Form :model="form" ref="content" :label-width="80" :rules="ruleInline">
        <FormItem label='教师姓名'>
          <Input width="100px" disabled v-model="userInfo.userName"></Input>
        </FormItem>
        <FormItem prop="majorType" label="课题方向">
          <Select v-model="form.majorType">
              <Option v-for="(item,index) in major_type" :key="index" :value="item.value">{{item.label}}</Option>
            </Select>
        </FormItem>
        <FormItem prop="classType" label="面向年级">
          <Select v-model="form.classType">
              <Option v-for="(item,index) in class_type" :key="index" :value="item.value">{{item.label}}</Option>
            </Select>
        </FormItem>
        <FormItem prop="title" label="课题名称">
          <Input width="100px" v-model="form.title" placeholder="请输入课题名称"></Input>
        </FormItem>
        <FormItem prop="description" label="描述">
          <Input v-model="form.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入申报课题描述"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="addMyGraduation">确定</Button>
      </div>
    </Modal>
    <div class="choice_btn">
      <Button @click="submitSelect" type="success">添加新课题</Button>
      <p class="choice_tip">注意：课题需要管理员审核通过才可以在学生端展示</p>
    </div>
    <Modal v-model="content_modal" title="课题详情" @on-ok="ok">
      <p class="content_title">{{content.title}}</p>
      <div>{{content.text}}</div>
    </Modal>
  </div>
</template>
<script>
  import { getMyGraduationList, choiceGraduationWork, addMyGraduation } from '@/api/teacher'
  import config from '@/config'
  import { getMyDate } from '@/libs/tools'
  let timer = null
  export default {
    name: 'project-report',
    data() {
      return {
        class_type: [],
        major_type: [{
          label: '网络与新媒体(新媒体编辑与运营)',
          value: '网络与新媒体(新媒体编辑与运营)'
        }, {
          label: '网络与新媒体(新媒体设计与开发)',
          value: '网络与新媒体(新媒体设计与开发)'
        }, {
          label: '数字媒体技术(网游)',
          value: '数字媒体技术(手游)'
        }, {
          label: '动画(动漫制作)',
          value: '动画(原画设计)'
        }],
        choiced: 0,
        content_modal: false,
        content: {
          title: '',
          text: ''
        },
        teacherName: '',
        myAdd: [],
        teacherInfo: {
          username: '',
          tid: ''
        },
        addModal: false,
        form: {
          title: '',
          description: '',
          majorType: '网络与新媒体(新媒体编辑与运营)',
          classType: ''
        },
        myTeacher: [],
        leftCount: 3,
        page: 1,
        total: 21,
        pageSize: 10,
        selectable: false,
        name: '',
        haveSelect: [],
        originSelect: [],
        myChoice: [],
        userInfo: {},
        info: {},
        modal1: false,
        tableData: [],
        columns: [
          {
            title: '开题日期',
            key: 'time',
            align: 'center'
          },
          {
            title: '教师姓名',
            key: 'username',
            align: 'center'
          },
          {
            title: '课题方向',
            key: 'major',
            align: 'center'
          },
          {
            title: '面向年级',
            key: 'year',
             width: 105,
            align: 'center'
          },
          {
            title: '课题名称',
            key: 'content',
            align: 'center'
          },
          {
            title: "状态",
            key: "action",
            width: 145,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: this.tableData[params.index].status == 1 ? "text" : "default"

                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                      }
                    }
                  },
                  this.tableData[params.index].status == 1 ? '已通过' : this.tableData[params.index].status == 0 ? "已经提交审核" : this.tableData[params.index].status == -1 ? '审核未通过' : '请等待'
                )
              ]);
            }
          },
          {
            title: "操作",
            key: "action",
            width: 258,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary"
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.seeDetail(this.tableData[params.index]);
                      }
                    }
                  },
                  "查看课题描述"
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
      }
    },
    created() {
      this.$nextTick(() => {
        this.userInfo = this.$store.state.user
        this.getMyGraduationList()
        let year = new Date().getFullYear()
        let after = year - 3
        for (let i = after; i <= year; i++) {
          this.class_type.push({
            label: i,
            value: i
          })
        }
        this.form.classType = after
      })

    },
    methods: {
      ok() {

      },
      changePage(page) {
        this.page = page
        this.originSelect = this.haveSelect
        this.getMyGraduationList()
      },
      addMyGraduation() {
        let {classType, majorType, title, description} = this.form
        let {token} = this.userInfo
        let time = new Date().getTime()
        this.$refs.content.validate((validate) => {
          if (validate) {
            addMyGraduation(token, classType, majorType, title, description, time).then((res) => {
              if (res.data.message == 'ok') {
                this.$Notice.success({
                  title: '已经提交审核'
                })
                this.addModal = false
                this.getMyGraduationList()
              } else {
                this.$Notice.warning({
                  title: '提交意向失败，请稍后重试！'
                })
              }
            })
          }

        })
      },
      submitSelect() {
        this.addModal = true
      },
      getMyGraduationList() {
        let u_id = this.userInfo.token
        getMyGraduationList(u_id, this.page, this.pageSize).then((res) => {
          var graduationWorkList = res.data.courseList
          this.total = res.data.count
          let name = this.$store.state.user.userName
          graduationWorkList.forEach((item) => {
            item.username = name
            item.time = getMyDate(item.time, "yyyy-MM-dd")
          })
          this.tableData = graduationWorkList
        })
      },
      seeDetail(info) {
        let {title, content: text} = info
        this.content.title = title
        this.content.text = text
        this.content_modal = true
      },
      choiceGraduationWork() {
        let token = this.userInfo.token
        let cid = this.haveSelect.map((selectItem) => {
          return selectItem.id
        })
        if (cid.length + this.myChoice.length > 3) {
          this.$Notice.warning({
            title: "一共只能选择3个课题！"
          })
          return
        }

        choiceGraduationWork(token, cid).then((res) => {
          let message = res.data.message
          this.modal1 = false
          if (message == "ok") {
            this.$Message.success('已经成功提交选择意向!');
            this.getMyGraduationList()
          } else if (message == "fail") {
            this.$Message.info('意向提交失败，请稍后再试!');
          }
        })
      }
    }
  }

</script>
<style>
  .container {
    position: relative;
  }
  
  .menber_list {
    position: relative;
    margin-bottom: 10px;
    cursor: pointer;
  }
  
  .tag_list {
    position: relative;
    margin: 10px 0;
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
  
  .page_container {
    position: absolute;
    right: 20px;
    margin-top: 30px;
  }
  
  .add_btn {
    position: relative;
    margin-bottom: 10px;
  }
  
  .content_title {
    position: relative;
    text-align: center;
    margin: 10px 0;
    font-size: 16px;
    font-weight: bold;
  }
</style>