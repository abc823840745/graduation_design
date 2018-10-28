
<template>
  <div class="goods-all">
    <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时未到开题时间"></Table>
    <Modal v-model="modal1" width="500">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>每人最多提交两个意向指导老师，你确认提交选择意向吗？</span>
      </p>
      <Form :model="form" :label-width="80" :rules="ruleInline">
        <FormItem prop="phone" label="联系手机">
          <Input v-model="form.phone" placeholder="请输入电话号码"></Input>
        </FormItem>
        <FormItem label="负责内容">
          <Select v-model="form.workType">
                <Option value="前端">前端</Option>
                <Option value="后台">后台</Option>
                <Option value="UI">UI</Option>
                 <Option value="策划">策划</Option>
                  <Option value="运营推广">运营推广</Option>
            </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="choiceThisTeacher">提交选择意向</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import Cookies from "js-cookie";
  import { getTeacherList, choiceTeacher } from '@/api/teacher'
  export default {
    name: "choice-teacher",
    data() {
      return {
        userInfo: {},
        info: {},
        modal1: false,
        form: {
          phone: "",
          workType: "前端"
        },
        tableData: [],
        columns: [
          {
            title: '开题日期',
            key: 'time',
            width: 180,
            align: 'center'
          },
          {
            title: '教师姓名',
            key: 'name',
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
            key: 'contact',
            width: 180,
            align: 'center'
          },
          {
            title: '剩余可选人数',
            width: 198,
            key: 'left_people',
            align: 'center'
          },
          {
            title: '总人数',
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
                        this.seeDetail(this.tableData[params.index]);
                      }
                    }
                  },
                  "查看教师详情"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error"

                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.modal1 = true
                        this.info = this.tableData[params.index]
                      }
                    }
                  },
                  "提交选择意向"
                )
              ]);
            }
          }
        ],
        ruleInline: {
          phone: [
            { required: true, message: '请输入有效的电话号码', trigger: 'blur', type: 'string', pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/ }
          ]
        }
      }
    },
    created() {

      this.$nextTick(() => {
        this.getTeacher()
        this.$nextTick(() => {
          this.userInfo = this.$store.state.user
        
          this.form.phone = this.userInfo.phone ? this.userInfo.phone : ''
        
        })
      })

    },
    methods: {
      getTeacher() {
        getTeacherList().then((res) => {
          var teachers = res.data.teachers
          teachers.forEach((item) => {
            item.leftPeople = item.people - item.haveChoice
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
        let uid = this.userInfo.id
        let sid = this.info.id
        let {phone, workType} = this.form

        choiceTeacher(uid, sid, phone, workType).then((res) => {
          let message = res.message
          this.modal1 = false
          if (message == "ok") {

            this.$Message.success('已经提交意向!');
          } else if (message == "haveChoice") {

            this.$Message.info('您已经向该教师提交意向，教师正在审核中!');
          } else if (message == "allChoice") {
            this.$Message.error('您已经选择2位意向导师，每人最多只能选择2个意向导师哦!');

          }
        })
      }
    }
  };

</script>

<style>

</style>