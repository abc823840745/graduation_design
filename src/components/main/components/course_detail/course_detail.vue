<style lang="less">

</style>
<template>
    <div class="container">
        <Tabs>
            <TabPane style="height:700px;" label="该学生选择的课题意向" icon="ios-book">
                <Table border :columns="columns" @on-selection-change="getSelection" :data="tableData" size="large" no-data-text="该学生暂时没有选择的课题意向"></Table>
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
        <Modal v-model="confirm_modal" title="确认通过该课题" @on-ok="ok">
            <div slot="footer">
                <Button type="primary" size="large" long @click="confirmStudentCourse">确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { getStudentCourse, choiceGraduationWork, addGraduationWork,confirmStudentCourse } from '@/api/teacher'
    import { getMyDate } from '@/libs/tools'
    import config from '@/config'
    let timer = null
    export default {
        name: 'choice-course',
        data() {
            return {
                flag: false,
                confirm_modal: false,
                confirm: {
                    id: '',
                    uid: ''
                },
                content_modal: false,
                content: {
                    title: '',
                    text: ''
                },
                teacherName: '',
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
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '课题方向',
                        key: 'major',
                        width: 280,
                        align: 'center'
                    },
                    {
                        title: '课题名称',
                        key: 'title',
                        align: 'center'
                    }
                ],
                tableData: [],
                columns: [
                    {
                        title: '开题日期',
                        key: 'time',
                        width: 180,
                        align: 'center'
                    },
                    {
                        title: '导师姓名',
                        key: 'username',
                        width: 180,
                        align: 'center'
                    },
                    {
                        title: '课题方向',
                        key: 'major',
                        width: 300,
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
                        width: 198,
                        align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: this.tableData[params.index].status == -1 ? "error" : this.tableData[params.index].status == 1?'success': "default"

                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                            }
                                        }
                                    },
                                   this.tableData[params.index].status == 1 ? "已通过" : this.tableData[params.index].status == -1?'未通过':'审核中'
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
                                    "课题描述"
                                ),
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "primary",
                                            disabled:this.tableData.length!=3 ||flag
                                        },
                                        style: {
                                            marginRight: "10px"
                                        },
                                        on: {
                                            click: () => {
                                                this.confirmCourse(this.tableData[params.index]);
                                            }
                                        }
                                    },
                                    this.tableData.length!=3 ||flag?'课题已经确认':"通过该课题"
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
                this.uid = this.$route.query.uid
                this.getStudentCourse()
            })

        },
        methods: {
            ok() {

            },
            getStudentCourse() {
                getStudentCourse(this.uid).then((res) => {
                    var graduationWorkList = res.data.workList
                    let name = this.$store.state.user.userName

                    graduationWorkList.forEach((item) => {
                        item.time = getMyDate(item.time, "yyyy-MM-dd")
                        item.username = name
                        if(item.status==1){
                            this.flag =true
                        }
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
            confirmCourse(info) {
                let {id, uid} = info
                this.confirm.id = id
                this.confirm.uid = uid
                this.confirm_modal = true
            },
            confirmStudentCourse(){
                let {id,uid} = this.confirm
                confirmStudentCourse(id,uid).then((res)=>{
                     if(res.data.message=='ok'){
                         this.$Notice.success({
                             title:"课题确认成功！"
                         })
                          this.getStudentCourse()
                          this.confirm_modal =false
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