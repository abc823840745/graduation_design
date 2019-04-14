<style lang="less">

</style>
<template>
  <div class="container">
    <Button :disabled="myChoice.length==3 || this.myTeacher.length == 0 || myChoice.length+haveSelect.length == 3" class="add_btn"
      type="success" @click="addModal=true">自主申报课题</Button>
      <Tabs>
        <TabPane style="height:700px;" label="教师开题" icon="ios-book">
          <Table border :columns="columns" @on-selection-change="getSelection" :data="tableData" size="large" no-data-text="暂时未到开题时间"></Table>
          <div class="page_container">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" />
          </div>
        </TabPane>
        <TabPane label="自主申报" icon="ios-bookmark">
          <Table border :columns="addColumns" :data="myAdd" size="large" no-data-text="暂无自主申报课题"></Table>
        </TabPane>
      </Tabs>
      <Modal v-model="modal1" width="1100">
        <p slot="header" style="text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>每人一共选择三个课题，你确认提交选择意向吗？</span>
        </p>
        <Table border :columns="choiceColumns" :data="haveSelect" size="large" no-data-text="暂时还没有选择课题"></Table>
        <div slot="footer">
          <Button type="primary" size="large" long @click="choiceGraduationWork">提交</Button>
        </div>
      </Modal>
      <Modal v-model="addModal">
        <p slot="header" style="text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>确定要自主申报课题吗？</span>
        </p>

        <Form :model="form" ref="content" :label-width="80" :rules="ruleInline">
          <FormItem v-if="teacherInfo.username" label=导师>
            <Input width="100px" disabled v-model="teacherInfo.username"></Input>
          </FormItem>
          <FormItem prop="description" label="课题方向">
            <Input width="100px" disabled v-model="userInfo.major"></Input>
          </FormItem>
          <FormItem prop="title" label="课题名称">
            <Input width="100px" v-model="form.title" placeholder="请输入课题名称"></Input>
          </FormItem>
          <FormItem prop="description" label="描述">
            <Input v-model="form.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入申报课题描述"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" size="large" long @click="addGraduationWork">确定</Button>
        </div>
      </Modal>
      <div class="choice_btn">
        <Button @click="submitSelect" :disabled="myChoice.length==3 || this.myTeacher.length == 0 || haveSelect.length==0" type="success">{{myChoice.length==3?'您已经提交全部选择意向，等待审核中...':'提交课题选择意向'}}</Button>
        <p class="choice_tip">注意：每人/每组只能选择3个课题,可以自己申报或者选择教师课题，只有选择导师后才可以选择课题，请在规定时间内完成申报{{myChoice.length!=3&&myTeacher.length!=0?'，请点击课题列表左侧复选按钮进行选择':''}}！</p>
      </div>
      <Modal v-model="content_modal" title="课题详情" @on-ok="ok">
        <p class="content_title">{{content.title}}</p>
        <div>{{content.text}}</div>
      </Modal>
  </div>
</template>
<script>
  import { getGraduationList, choiceGraduationWork, addGraduationWork } from '@/api/teacher'
  import config from '@/config'
  let timer = null
  export default {
    name: 'choice-course',
    data() {
      return {
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
          description: ''
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
        choiceColumns: [
          {
            title: '导师姓名',
            key: 'username',
            align: 'center'
          },
          {
            title: '课题方向',
            key: 'major',
            align: 'center'
          },
          {
            title: '课题名称',
            key: 'title',
            align: 'center'
          }
        ],
        tableData: [],
        addColumns: [
          {
            title: '开题日期',
            key: 'time',
            align: 'center'
          },
          {
            title: '导师姓名',
            key: 'username',
            align: 'center'
          },
          {
            title: '课题方向',
            key: 'major',
            align: 'center'
          },
          {
            title: '课题名称',
            key: 'title',
            align: 'center'
          },
          {
            title: "状态",
            key: "action",
            width: 198,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: this.tableData[params.index].status==1 ?'success':this.tableData[params.index].status==-1? "error" : "warning"

                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                      }
                    }
                  },
                this.tableData[params.index].status==1?'已通过' : this.tableData[params.index].status==0 ? "已经提交审核" : this.tableData[params.index].status==-1?'审核未通过':''
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
        columns: [
          {
            type: 'selection',
            align: 'center'
          },
          {
            title: '开题日期',
            key: 'time',
            align: 'center'
          },
          {
            title: '导师姓名',
            key: 'username',
            align: 'center'
          },
          {
            title: '课题方向',
            key: 'major',
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
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: this.myChoice.indexOf(this.tableData[params.index].id) != -1 ? "warning" : "default"

                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                      }
                    }
                  },
                 this.myChoice.indexOf(this.tableData[params.index].id) != -1&&this.choiced==this.tableData[params.index].id?'已通过' :this.myChoice.indexOf(this.tableData[params.index].id) != -1&&this.choiced==0 ? "已经提交审核" :this.myChoice.indexOf(this.tableData[params.index].id) != -1&&this.choiced!=0?'审核未通过': '未选择该课题'
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
        this.getGraduationList()
      })

    },
    methods: {
      ok() {

      },
      changePage(page) {
        this.page = page
        this.originSelect = this.haveSelect
        this.getGraduationList()
      },
      addGraduationWork() {
        let {title, description} = this.form

        if (!title || title.trim() == '' || title.trim().length > 20 || title.trim().length < 4) {
          this.$Notice.warning({
            title: '请输入正确的课题标题名称'
          })
          return
        }
        if (!description || description.trim() == '' || description.trim().length > 20 || description.trim().length < 4) {
          this.$Notice.warning({
            title: '请输入正确的课题描述'
          })
          return
        }
        let major = this.userInfo.major
        let uid = this.userInfo.token
        let {tid, username} = this.teacherInfo
        let time = new Date().getTime()
        addGraduationWork(uid, major, tid, username, title, description, time).then((res) => {
          if (res.data.message == 'ok') {
            this.$Notice.success({
              title: '已经提交意向'
            })
            this.addModal = false
            this.getGraduationList()
          } else {
            this.$Notice.warning({
              title: '提交意向失败，请稍后重试！'
            })
          }
        })
      },
      getSelection(selection) {

        if (this.originSelect.length + selection.length + this.myAdd.length >= 3) {
          if (this.originSelect.length + selection.length + this.myAdd.length == 3) {
            selection = selection.filter((item) => {
              if (this.myChoice.indexOf(item.id) == -1) {
                return item
              }
            })
            this.haveSelect = this.originSelect.concat(selection)
          }
          let selectArr = this.haveSelect.map((selectItem) => {
            return selectItem.id
          })
          this.tableData.forEach((item, index) => {
            if (selectArr.indexOf(item.id) == -1) {
              item['_disabled'] = true
              item['_checked'] = false

            } else {
              item['_disabled'] = false
              item['_checked'] = true
            }
            if (this.myChoice.indexOf(item.id) != -1) {
              item['_disabled'] = true
              item['_checked'] = true

            }

          })
        } else {
          selection = selection.filter((item) => {
            if (this.myChoice.indexOf(item.id) == -1) {
              return item
            }
          })
          this.haveSelect = this.originSelect.concat(selection)
          let selectArr = this.haveSelect.map((selectItem) => {
            return selectItem.id
          })

          this.tableData.forEach((item, index) => {
            if (this.myTeacher.indexOf(item.tid) == 1) {
              item['_disabled'] = false
            }

            if (selectArr.indexOf(item.id) != -1 || this.myChoice.indexOf(item.id) != -1) {
              item['_checked'] = true
            } else {
              item['_checked'] = false
            }
          })
        }
      },
      submitSelect() {
        this.modal1 = true
      },
      getGraduationList() {
        let {name} = this.name
        let u_id = this.userInfo.token
        getGraduationList(u_id, name, this.page, this.pageSize).then((res) => {
          var graduationWorkList = res.data.graduationWorkList
          this.total = res.data.count
          this.myAdd = res.data.myAdd
          this.myChoice = res.data.myChoice.map((item) => {
            if(item.status==1){
              this.choiced = item.cid
            }
             return item.cid
             })
          res.data.myAdd.forEach((item) => {
            this.choiced = item.id
            this.myChoice.push(item.cid)
          })

          this.leftCount = this.leftCount - this.myChoice.length
          let haveSelected = this.originSelect.map((item) => { return item.id })
          if (res.data.myTeacher.length > 0) {
            this.myTeacher = res.data.myTeacher.map((item) => { return item.tid })
            this.teacherInfo.tid = this.myTeacher[0]
            this.teacherInfo.username = res.data.teacherName
          }

          graduationWorkList.forEach((item) => {
            this.myChoice.indexOf(item.id) != -1 || haveSelected.indexOf(item.id) != -1 ? item._checked = true : item._checked = false
            this.myChoice.length >= 3 || this.myTeacher.length == 0 || this.myChoice.indexOf(item.id) != -1 || this.myTeacher.indexOf(item.tid) == -1 ? item._disabled = true : item._disabled = false
          })
          this.tableData = graduationWorkList
        })
      },
      seeDetail(info) {
        let {title, content:text} = info
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
            this.getGraduationList()
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
    position: relative;
    width: 430px;
    text-align: center;
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
  .content_title{
    position: relative;
    text-align: center;
    margin: 10px 0;
    font-size: 16px;
    font-weight: bold;
  }
   
</style>