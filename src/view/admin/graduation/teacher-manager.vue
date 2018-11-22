<template>
  <div class="goods-all">
    <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时未到开题时间"></Table>
    <div class="page_container">
      <Page :total="total" :page-size="pageSize" @on-change="changePage" />
    </div>
    <div class="choice_btn">
      <Button type="primary" @click="new_modal=true">添加新老师</Button>
      <p class="choice_tip">注意：请按照指定格式导入教师表！</p>
    </div>
    <Modal v-model="content_modal" width="500">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>教师简介</span>
      </p>
      <div>{{description}}</div>
    </Modal>
    <Modal v-model="new_modal" width="1200">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>确定要添加教师信息？</span>
      </p>
      <Table :columns="tableTitle" :data="newData" :loading="tableLoading"></Table>
      <div class="upload_container">
        <Upload action="" :before-upload="handleBeforeUpload" accept=".xls, .xlsx">
          <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">点击上传新老师信息表</Button>
        </Upload>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="addNewTeacher">确定添加</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import excel from '@/libs/excel'
  import { getAllTeacher, choiceTeacher, getMenber, addNewTeacher } from '@/api/teacher'
  import { getMyDate } from '@/libs/tools'
  import config from '@/config'
  const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
  const uploadUrl = baseUrl + '/upload/work'
  let timer = null
  export default {
    name: "choice-teacher",
    data() {
      return {
        uploadUrl,
        tableLoading: false,
        new_modal: false,
        uploadLoading: false,
        progressPercent: 0,
        showProgress: false,
        showRemoveFile: false,
        tableTitle: [],
        file: null,
        description: '',
        content_modal: false,
        guide_teacher: '',
        page: 1,
        total: 21,
        pageSize: 10,
        selectable: false,
        haveSelect: [],
        originSelect: [],
        uploadUrl,
        uploadList: [],
        userInfo: {},
        info: {},
        modal1: false,
        tableData: [],
        newData: [],
        columns: [
          {
            title: '上传日期',
            key: 'time',
            width: 180,
            align: 'center'
          },
          {
            title: '教师工号',
            key: 'code',
            width: 150,
            align: 'center'
          },
          {
            title: '教师姓名',
            key: 'username',
            width: 180,
            align: 'center'
          },
          {
            title: '负责方向',
            key: 'major',
            width: 300,
            align: 'center'
          },
          {
            title: '教学经验(年)',
            key: 'experient',
            width: 150,
            align: 'center'
          },
          {
            title: '联系方式',
            key: 'phone',
            width: 180,
            align: 'center'
          },
          {
            title: '毕设负责学生人数',
            width: 198,
            key: 'people',
            align: 'center'
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
                      type: "primary"
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.seeDetail(this.tableData[params.index].description);
                      }
                    }
                  },
                  "查看教师简介"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "warning"
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          path: "/teacher_detail/papper_admin",
                          query: {
                            username: this.tableData[params.index].username,
                            tid: this.tableData[params.index].u_id
                          }
                        });
                      }
                    }
                  },
                  "毕设学生分配"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "success"
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          path: "/teacher_detail/course_admin",
                          query: {
                            username: this.tableData[params.index].username,
                            tid: this.tableData[params.index].u_id
                          }
                        });
                      }
                    }
                  },
                  "教师课题审核"
                )
              ]);
            }
          }
        ]
      }
    },
    created() {
      this.$nextTick(() => {
        this.userInfo = this.$store.state.user
        this.getAllTeacher()

      })

    },
    watch: {
      'form.teamMan': function () {
        this.getMenber()
      }
    },
    methods: {
      initUpload() {
        this.file = null
        this.showProgress = false
        this.loadingProgress = 0
        this.newData = []
        this.tableTitle = []
      },
      handleUploadFile() {
        this.initUpload()
      },
      addNewTeacher() {
        let teachers = []
        this.newData.forEach((item) => {
          teachers.push({
            time:new Date().getTime(),
            code: item['教师工号'],
            username: item['教师姓名'],
            major: item['负责方向'],
            level: item['教师学历'],
            experient: item["教学经验"],
            phone: item['联系方式'],
            qq: item['qq号码'],
            role: item['教师身份'],
            people: item['负责毕设学生人数'],
            description: item['教师简介']
          })
        })
        addNewTeacher(teachers).then((res) => {
          if (res.data.message == 'ok') {
            this.$Notice.success({
              title: "上传成功"
            })
            this.getAllTeacher()
            this.new_modal = false
          } else {
            this.$Notice.success({
              title: "上传失败，请稍后重试！"
            })
          }
        })
      },
      handleBeforeUpload(file) {
        const fileExt = file.name.split('.').pop().toLocaleLowerCase()
        if (fileExt === 'xlsx' || fileExt === 'xls') {
          this.readFile(file)
          this.file = file
          this.new_modal = true
          console.log()
        } else {
          this.$Notice.warning({
            title: '文件类型错误',
            desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
          })
        }
        return false
      },
      readFile(file) {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadstart = e => {
          this.uploadLoading = true
          this.tableLoading = true
          this.showProgress = true
        }
        reader.onprogress = e => {
          this.progressPercent = Math.round(e.loaded / e.total * 100)
        }
        reader.onerror = e => {
          this.$Message.error('文件读取出错')
        }
        reader.onload = e => {
          this.$Message.info('文件读取成功')
          const data = e.target.result
          const { header, results } = excel.read(data, 'array')
          const tableTitle = header.map(item => { return { title: item, key: item } })
          this.newData = results
          this.tableTitle = tableTitle
          this.uploadLoading = false
          this.tableLoading = false
          this.showRemoveFile = true
        }
      },
      changePage(page) {
        this.page = page
        this.originSelect = this.haveSelect
        this.getAllTeacher()
      },
      getSelection(selection) {
        if (this.originSelect.length + selection.length >= 3) {
          if (this.originSelect.length + selection.length == 3) {
            this.haveSelect = this.originSelect.concat(selection)
          }
          let selectArr = this.haveSelect.map((selectItem) => {
            return selectItem.u_id
          })
          this.tableData.forEach((item, index) => {
            if (selectArr.indexOf(item.u_id) == -1) {
              item['_disabled'] = true
              item['_checked'] = false

            } else {
              item['_disabled'] = false
              item['_checked'] = true
            }
          })
        } else {
          this.haveSelect = this.originSelect.concat(selection)
          let selectArr = this.haveSelect.map((selectItem) => {
            return selectItem.u_id
          })
          this.tableData.forEach((item, index) => {
            item['_disabled'] = false
            if (selectArr.indexOf(item.u_id) == -1) {
              item['_checked'] = false
            } else {
              item['_checked'] = true
            }
          })
        }
      },
      submitSelect() {
        this.modal1 = true
      },
      delMenber() {
        this.menber.menber_id = ''
        this.menber.teamMan = ''
      },
      choiceMenber(index) {
        if (this.menberList[index].team_id) {
          return
        }
        let {username, u_id} = this.menberList[index]
        this.menber.menber_id = u_id
        this.menber.teamMan = username
        this.form.teamMan = ''
        this.menberList = []
      },
      getMenber() {
        let name = this.form.teamMan
        if (name.trim() == '' || name.indexOf("'") != -1) {
          return
        }
        clearInterval(timer)
        timer = setTimeout(() => {
          getMenber(name).then((res) => {
            if (res.data.message == 'ok') {
              this.menberList = res.data.userList
            }
          })
        }, 300)
      },
      getAllTeacher() {
        getAllTeacher(this.page, this.pageSize).then((res) => {
          var teachers = res.data.teacherList
          this.total = res.data.count
          teachers.forEach((item) => {
            item.time = getMyDate(item.time, "yyyy-MM-dd")
          })
          this.tableData = teachers
        })
      },
      seeDetail(description) {
        this.description = description
        this.content_modal = true
      },
      choiceThisTeacher() {
        let token = this.userInfo.token
        let year = this.userInfo.year
        let tid = this.haveSelect.map((selectItem) => {
          return selectItem.u_id
        })
        let {menber_id, teamMan, menber_phone, menber_qq, menber_woker, menber_ps} = this.menber
        let {phone, qq, workType, team} = this.form
        if (team == 1) {
          if (this.uploadList.length <= 0) {
            this.$Notice.warning({
              title: "请上传组对申请表"
            })
            return
          }
          if (this.uploadList.length <= 0) {
            this.$Notice.warning({
              title: "请上传组对申请表"
            })
            return
          }
          if (/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(menber_phone)) {
            this.$Notice.warning({
              title: "请输入成员电话号码"
            })
            return
          }

          if (/^[0-9]{5,10}$/.test(menber_qq.length)) {
            this.$Notice.warning({
              title: "请输入正确的qq号码"
            })
            return
          }
          if (!/^[0-9]{14}$/.test(menber_ps)) {
            this.$Notice.warning({
              title: "请输入正确的成员登陆号码"
            })
            return
          }
        }
        let file = this.uploadList.length > 0 ? this.uploadList[0].url : ''
        if (tid.length != 3) {
          this.$Notice.warning({
            title: "请选择3名意向导师！"
          })
          return
        }

        this.$refs['content'].validate((validate) => {
          if (validate) {
            choiceTeacher(token, tid, menber_id, year, phone, qq, workType, menber_phone, menber_qq, menber_woker, menber_ps, team, file).then((res) => {
              let message = res.data.message
              this.modal1 = false
              if (message == "ok") {
                this.$Message.success('已经提交意向!');
                this.getAllTeacher()
              } else if (message == "haveChoice") {
                this.$Message.info('您已经向该教师提交意向，教师正在审核中!');
              } else if (message == "psError") {
                this.$Message.error('成员登陆密码错误或成员不存在!');

              } else if (message == "menberChoice") {
                this.$Message.error('只有组长才有权限选择导师哦!');

              }
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
      },
    }
  };

</script>

<style>
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
    width: 320px;
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
  
  .upload_container {
    position: relative;
    margin: 15px 0;
    left: 50%;
    transform: translateX(-80px);
  }
  
  .page_container {
    position: absolute;
    right: 20px;
    margin-top: 30px;
  }
</style>