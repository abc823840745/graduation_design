<template>
  <div class="goods-all">
    <Table border :columns="columns"  :data="tableData" size="large" no-data-text="我暂时还没有毕业设计相关信息"></Table>
    <div class="page_container">
      <Page :total="total" :page-size="pageSize" @on-change="changePage" />
    </div>
    <Modal v-model="modal1" width="500">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>一个团队最多两个人，你确认提交选择意向吗？</span>
      </p>
    </Modal>
  </div>
</template>
<script>
  import Cookies from "js-cookie";
  import { getStudentList} from '@/api/teacher'
  import config from '@/config'
  let timer = null
  export default {
    name: "choice-teacher",
    data() {
      return {
        guide_teacher: '',
        page: 1,
        total: 1,
        pageSize: 10,
        selectable: false,
        haveSelect: [],
        originSelect: [],
        userInfo: {},
        info: {},
        modal1: false,
        tableData: [],
        columns: [
          {
            title: '序号',
            key: 'index',
            width: 80,
            align: 'center',
             render: (h, params) => {
              return h("div", 
                 ++params.index
                )
            }
          },
          {
            title: '学生姓名',
            key: 'username',
            width: 160,
            align: 'center'
          },
          {
            title: '学生学号',
            key: 'stu_number',
            width: 150,
            align: 'center'
          },
          {
            title: '专业方向',
            key: 'major',
            width: 300,
            align: 'center'
          },
          {
            title: '年级',
            key: 'class',
            width: 120,
            align: 'center'
          },
          {
            title: '负责内容',
            key: 'work_type',
            width: 180,
            align: 'center'
          },
          {
            title: '手机号码',
            key: 'phone',
            width: 150,
            align: 'center'
          },
          {
            title: 'QQ号码',
            width: 150,
            key: 'qq',
            align: 'center'
          },
          {
            title: "操作",
            key: "action",
             width: 510,
            align: "center",
            render: (h, params) => {
              return h("div", [
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
                        this.$router.push({path:"/student_detail/week_report",query:{uid:this.tableData[params.index].u_id}});
                      }
                    }
                  },
                  "查看周报"
                ),
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
                         this.$router.push({path:"/student_detail/course_detail",query:{uid:this.tableData[params.index].u_id}});
                      }
                    }
                  },
                  "查看课题"
                ), h(
                  "Button",
                  {
                    props: {
                      type: "error"
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                      this.$router.push({path:"/student_detail/mission_detail",query:{uid:this.tableData[params.index].u_id}});
                      }
                    }
                  },
                  "查看任务"
                ), h(
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
                        this.$router.push({path:"/student_detail/papper_detail",query:{uid:this.tableData[params.index].u_id}});
                      }
                    }
                  },
                  "论文管理"
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
        this.getStudentList(this.userInfo)
      })

    },
    watch: {
      'form.teamMan': function () {
        this.getMenber()
      }
    },
    methods: {
      changePage(page) {
        this.page = page
        this.originSelect = this.haveSelect
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
      getStudentList() {
        let {token} = this.userInfo
        let year = this.$store.state.user.choiceBegin
        getStudentList(token, year).then((res) => {
          this.total = res.data.count
          let studentList = res.data.studentList
          studentList.forEach((item) => {
          })
          this.tableData = studentList
        })
      },
      seeDetail(info) {
        var info = info
        info = JSON.stringify(info)
        info = encodeURIComponent(info)
        this.$router.push({ path: `/detail?info=${info}` })
      }
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
  
  .page_container {
    position: absolute;
    right: 20px;
    margin-top: 30px;
  }
</style>