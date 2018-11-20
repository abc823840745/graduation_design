<template>
  <div class="goods-all">
    <Table border :columns="columns" @on-selection-change="getSelection" :data="tableData" size="large" no-data-text="暂时未到开题时间"></Table>
    <div class="page_container">
       <Page :total="total" :page-size="pageSize" @on-change="changePage" />
    </div>
    <div class="choice_btn">
      <Button @click="submitSelect" :disabled="haveSelect.length!=3||myChoice.length!=0" type="success">{{myChoice.length!=0?'您已经提交选择意向，等待审核中...':'提交选择意向'}}</Button>
      <p class="choice_tip">注意：每人/每组只能选择3个意向导师{{myChoice.length==0?'，请点击教师列表左侧复选按钮进行选择':''}}！</p>
    </div>
    <Modal v-model="modal1" width="500">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>一个团队最多两个人，你确认提交选择意向吗？</span>
      </p>
      <Form :model="form" ref="content" :label-width="80" :rules="ruleInline">
        <FormItem prop="phone" label="联系手机">
          <Input v-model="form.phone" placeholder="请输入电话号码"></Input>
        </FormItem>
        <FormItem prop="qq" label="QQ号码">
          <Input v-model="form.qq" placeholder="请输入QQ号码"></Input>
        </FormItem>
        <FormItem label="负责内容">
          <Select v-model="form.workType">
              <Option v-for="(item,index) in menber_workList" :key="index" :value="item.value">{{item.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="是否组队">
          <RadioGroup v-model="form.team">
            <Radio label="0">
              <span>否</span>
            </Radio>
            <Radio label="1">
              <span>是</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="form.team=='1'" label="邀请成员">
          <Poptip trigger="focus">
            <Input v-model="form.teamMan" search placeholder="请输入成员姓名"></Input>
            <div slot="content" v-if="menberList.length>0">
              <div @click="choiceMenber(index)" class="menber_list" v-for="(item,index) in menberList">{{ item.username}}--{{item.stu_number}}{{item.team_id?'--已组队':''}}</div>
            </div>
          </Poptip>
          <div class="tag_list">
            <Tag type="dot" @on-close="delMenber" v-if="menber.menber_id" closable color="primary">{{menber.teamMan}}</Tag>
          </div>
        </FormItem>
        <Form :model="menber" :label-width="80" :rules="menber_ruleInline">
          <FormItem v-if="form.team=='1'&&menber.menber_id" prop="menber_phone" label="成员手机">
            <Input v-model="menber.menber_phone" placeholder="请输入电话号码"></Input>
          </FormItem>
          <FormItem v-if="form.team=='1'&&menber.menber_id" prop="menber_qq" label="成员QQ">
            <Input v-model="menber.menber_qq" placeholder="请输入QQ号码"></Input>
          </FormItem>
           <FormItem v-if="form.team=='1'&&menber.menber_id" prop="menber_ps" label="成员密码">
            <Input v-model="menber.menber_ps" type="password" placeholder="请输入成员登陆密码"></Input>
          </FormItem>
          <FormItem v-if="form.team=='1'&&menber.menber_id" label="负责内容">
            <Select v-model="menber.menber_woker">
                <Option v-for="(item,index) in workList" :value="item.value" :key="index">{{item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
        <FormItem label="上传附件" v-if="form.team=='1'">
          <Upload type="drag" :max-size="20480" :format="['doc']" :action="uploadUrl" :on-exceeded-size="handleMaxSize" :on-success="handleSuccess">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>组队需要额外上传申请表，由组长提交信息即可！</p>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="choiceThisTeacher">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import Cookies from "js-cookie";
  import { getTeacherList, choiceTeacher, getMenber } from '@/api/teacher'
  import config from '@/config'
  const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
  const uploadUrl = baseUrl + '/upload/work'
  let timer = null
  export default {
    name: "choice-teacher",
    data() {
      return {
        guide_teacher: '',
        page: 1,
        total: 21,
        pageSize: 10,
        selectable: false,
        haveSelect: [],
        originSelect: [],
        uploadUrl,
        uploadList: [],
        menber: {
          menber_id: '',
          teamMan: '',
          menber_phone: '',
          menber_qq: '',
          menber_woker: '前端',
          menber_ps: '',
        },
        menberList: [],
        myChoice: [],
        userInfo: {},
        info: {},
        modal1: false,
        form: {
          team: '0',
          teamMan: '',
          phone: "",
          workType: "前端",
          qq: '',
        },
        tableData: [],
        workList: [
          {
            label: "前端",
            value: "前端"
          },
          {
            label: "后台",
            value: "后台"
          }, {
            label: "UI",
            value: "UI"
          },
          {
            label: "策划",
            value: "策划"
          },
          {
            label: "运营推广",
            value: "运营推广"
          }, {
            label: "全部",
            value: "全部"
          }],
        menber_workList: [
          {
            label: "前端",
            value: "前端"
          },
          {
            label: "后台",
            value: "后台"
          }, {
            label: "UI",
            value: "UI"
          },
          {
            label: "策划",
            value: "策划"
          },
          {
            label: "运营推广",
            value: "运营推广"
          }, {
            label: "全部",
            value: "全部"
          }],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '开题日期',
            key: 'time',
            width: 180,
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
            width: 180,
            align: 'center'
          },
          {
            title: '联系方式',
            key: 'phone',
            width: 180,
            align: 'center'
          },
          {
            title: '剩余可选人数',
            width: 198,
            key: 'leftPeople',
            align: 'center'
          },
          {
            title: '总人数',
            width: 198,
            key: 'people',
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
                      type: this.myChoice.indexOf(this.tableData[params.index].u_id) == -1 ? "default" : !this.guide_teacher? 'warning': this.tableData[params.index].u_id == this.guide_teacher?'success':'error'

                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                      }
                    }
                  },
                  this.myChoice.indexOf(this.tableData[params.index].u_id) == -1 ? "未选择" : !this.guide_teacher? '审核中': this.tableData[params.index].u_id == this.guide_teacher?'审核已通过':'审核未通过'
                )
              ]);
            }
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
                        this.seeDetail(this.tableData[params.index]);
                      }
                    }
                  },
                  "查看教师详情"
                )
              ]);
            }
          }
        ],
        ruleInline: {
          phone: [
            { required: true, message: '请输入有效的电话号码', trigger: 'blur', type: 'string', pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/ }
          ],
          qq: [
            { required: true, message: '请输入有效的qq号码', trigger: 'blur', type: 'string', pattern: /^[0-9]{5,10}$/ }
          ]
        },
        menber_ruleInline: {
          menber_phone: [
            { required: true, message: '请输入有效的电话号码', trigger: 'blur', type: 'string', pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/ }
          ],
          menber_qq: [
            { required: true, message: '请输入有效的qq号码', trigger: 'blur', type: 'string', pattern: /^[0-9]{5,10}$/ }
          ],
          menber_ps: [
            { required: true, message: '请输入有效的登陆密码', trigger: 'blur', type: 'string', pattern: /^[0-9]{14}$/ }
          ]
        }
      }
    },
    created() {
      this.$nextTick(() => {
        this.userInfo = this.$store.state.user
        this.getTeacher()

      })

    },
    watch: {
      'form.teamMan': function () {
        this.getMenber()
      }
    },
    methods: {
      changePage(page){
        this.page = page
         this.originSelect = this.haveSelect
         this.getTeacher()
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
        if(this.menberList[index].team_id){
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
      getTeacher() {
        let {token} = this.userInfo
        getTeacherList(token,this.page,this.pageSize).then((res) => {
          var teachers = res.data.teachers
          this.total =  res.data.count
          this.guide_teacher  =  res.data.guide_teacher 
          this.myChoice = res.data.myChoice.map((item) => { return item.tid })
          let haveSelected =  this.originSelect.map((item) => { return item.u_id })
          
          teachers.forEach((item) => {
            let leftPeople = item.people - item.haveChoice
            item.leftPeople = leftPeople
            this.myChoice.indexOf(item.u_id) != -1 || haveSelected.indexOf(item.u_id)!= -1  ? item._checked = true : item._checked = false
            this.myChoice.length > 0 || leftPeople==0 ? item._disabled = true : item._disabled = false
          })
          this.tableData = teachers
        })
      },
      seeDetail(info) {
        var info = info
        info = JSON.stringify(info)
        info = encodeURIComponent(info)
        this.$router.push({ path: `/detail?info=${info}` })
      },
      choiceThisTeacher() {
        let token = this.userInfo.token
        let year = this.userInfo.year
        let tid = this.haveSelect.map((selectItem) => {
          return selectItem.u_id
        })
        let {menber_id, teamMan, menber_phone, menber_qq, menber_woker,menber_ps} = this.menber
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

          if ( /^[0-9]{5,10}$/.test(menber_qq.length)) {
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
         let file = this.uploadList.length>0?this.uploadList[0].url:''
        if (tid.length != 3) {
          this.$Notice.warning({
            title: "请选择3名意向导师！"
          })
          return
        }

        this.$refs['content'].validate((validate) => {
          if (validate) {
            choiceTeacher(token, tid, menber_id,year, phone, qq, workType, menber_phone, menber_qq, menber_woker,menber_ps, team, file).then((res) => {
              let message = res.data.message
              this.modal1 = false
              if (message == "ok") {
                this.$Message.success('已经提交意向!');
                this.getTeacher()
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
  .page_container{
      position: absolute;
      right: 20px;
      margin-top: 30px;
  }
</style>