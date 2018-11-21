<style lang="less">

</style>
<template>
    <div class="container">
        <Tabs>
            <TabPane style="height:700px;" label="教师开题" icon="ios-book">
                <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时还没有信息"></Table>
                <div class="page_container">
                    <Page :total="total" :page-size="pageSize" @on-change="changePage" />
                </div>
            </TabPane>
        </Tabs>
        <Modal v-model="content_modal" title="课题详情" @on-ok="ok">
            <p class="content_title">{{content.title}}</p>
            <div>{{content.text}}</div>
        </Modal>
        <Modal v-model="confirm_modal" title="是否确认审核该课题？" @on-ok="ok">
            <p class="content_title">{{content.title}}</p>
            <RadioGroup v-model="throught">
                <Radio :label="1">
                    <span>通过</span>
                </Radio>
                <Radio :label="-1">
                    <span>不通过</span>
                </Radio>
            </RadioGroup>
            <div slot="footer">
                <Button type="primary" size="large" long @click="updateCourseStatus">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { getMyGraduationList, updateCourseStatus } from '@/api/teacher'
    import config from '@/config'
    import { getMyDate } from '@/libs/tools'
    let timer = null
    export default {
        name: 'project-report',
        data() {
            return {
                cid: 0,
                throught: 1,
                confirm_modal: false,
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
                total: 1,
                pageSize: 10,
                selectable: false,
                name: '',
                haveSelect: [],
                originSelect: [],
                myChoice: [],
                username: '',
                tid: '',
                info: {},
                modal1: false,
                tableData: [],
                columns: [
                    {
                        title: '开题日期',
                        key: 'time',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '教师姓名',
                        key: 'username',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '课题方向',
                        key: 'major',
                        width: 260,
                        align: 'center'
                    },
                    {
                        title: '面向年级',
                        key: 'year',
                        width: 100,
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
                                            type: this.tableData[params.index].status == 1 ? "success" : "warning"

                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                            }
                                        }
                                    },
                                    this.tableData[params.index].status == 1 ? '已通过' : this.tableData[params.index].status == 0 ? "待审核" : this.tableData[params.index].status == -1 ? '审核未通过' : '请等待'
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
                                ),
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "error",
                                            disabled: this.tableData[params.index].status != 0
                                        },
                                        style: {
                                            marginRight: "10px"
                                        },
                                        on: {
                                            click: () => {
                                                this.confirm_modal = true
                                                this.cid = this.tableData[params.index].id
                                            }
                                        }
                                    },
                                    "审核课题"
                                )
                            ]);
                        }
                    }
                ]
            }
        },
        created() {
            this.$nextTick(() => {
                this.tid = this.$route.query.tid
                this.username = this.$route.query.username
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
            updateCourseStatus() {
                let status = this.throught
                let cid = this.cid
                updateCourseStatus(cid, status).then((res) => {
                    if (res.data.message == 'ok') {
                        this.$Notice.success({
                            title: '更新成功'
                        })
                        this.getMyGraduationList()
                    }
                    this.confirm_modal = false
                })
            },
            changePage(page) {
                this.page = page
                this.getMyGraduationList()
            },
            addMyGraduation() {
                let {classType, majorType, title, description} = this.form
                let token = this.tid
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
            getMyGraduationList() {
                let u_id = this.tid
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