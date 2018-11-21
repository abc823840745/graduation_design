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
        <Modal v-model="ok_modal" width="700px" title="是否审核通过">
            <RadioGroup v-model="pass">
                <Radio label="-1">
                    <span>否</span>
                </Radio>
                <Radio label="1">
                    <span>是</span>
                </Radio>
            </RadioGroup>
            <div slot="footer">
                <Button type="primary" size="large" long @click="confirmMission">确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { getMyMission, completeMission,confirmMission } from '@/api/teacher'
    import { getMyDate } from '@/libs/tools'
    import config from '@/config'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    const uploadUrl = baseUrl + '/upload/work'
    export default {
        name: "my-mission",
        data() {
            return {
                pass: '1',
                uploadUrl,
                myChoice: {},
                mission: {},
                uploadList: [],
                ok_modal: false,
                totalSize: 0,
                content_modal: false,
                contentInfo: {
                    title: '',
                    content: ''
                },
                uid: '',
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
                        title: "学生上传附件",
                        key: "download",
                        width: 200,
                        align: "center",
                        render: (h, params) => {
                            return h(this.tableData[params.index].upload == 1 && this.myChoice[this.tableData[params.index].id].status != -2 ? 'a' : "div", {
                                domProps: {
                                    href: this.tableData[params.index].file,
                                    download: "w3logo"
                                },
                            },
                                this.tableData[params.index].upload == 1 && this.myChoice[this.tableData[params.index].id].status != -2 ? '下载附件' : '无附件')
                        }
                    },
                    {
                        title: "任务附件",
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
                                this.myChoice[this.tableData[params.index].id].status == 1 && this.tableData[params.index].more_time != 1 ? '已完成' : this.myChoice[this.tableData[params.index].id].status == 1 && this.tableData[params.index].more_time == 1 ? '超时完成' : this.myChoice[this.tableData[params.index].id].status == 0 ? '审核中' : this.myChoice[this.tableData[params.index].id].status == -1 ? '未通过' : '未完成')
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
                                ),
                                h(
                                    'Button',
                                    {
                                        props: { type: "success" },
                                        style: {
                                            marginRight: "20px"
                                        },
                                        on: {
                                            click: () => {
                                                if (this.myChoice[this.tableData[params.index].id].status == 0 || this.myChoice[this.tableData[params.index].id].status == -1) {
                                                    this.ok_modal = true
                                                    this.mission = this.tableData[params.index]
                                                }
                                            }
                                        }
                                    },
                                    this.myChoice[this.tableData[params.index].id].status == 0 || this.myChoice[this.tableData[params.index].id].status == -1 ? '任务验收' : '执行中'
                                )
                            ]);
                        }
                    }
                ]
            };
        },
        created() {
            this.$nextTick(() => {
                this.uid = this.$route.query.uid
                this.getMyMission()
            })
        },
        methods: {
            confirmMission() {
                let {id} = this.mission
                let pass = this.pass
                
                confirmMission(id,this.uid,pass).then((res) => {
                    if (res.data.message == 'ok') {
                        this.$Notice.success({
                            title: '审核完成'
                        })
                        this.ok_modal = false
                        this.getMyMission()
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
                this.getMyMission()
            },
            getMyMission() {
                let token = this.uid
                let page = this.page
                let size = this.size
                getMyMission(token, page, size).then((res) => {
                    let now = new Date().getTime()
                    if (res.data.message == 'ok') {
                        let name = this.$store.state.user.userName
                        this.myChoice = {}
                        res.data.myChoice.forEach((item) => {
                            this.$set(this.myChoice, item.mid, {
                                status: item.status,
                                file: item.file
                            })
                        })
                        this.totalSize = res.data.count
                        res.data.missions.forEach((item) => {
                            if (now > item.deadline) {
                                item.more_time = 1
                            }
                            if (!this.myChoice[item.id]) {
                                this.$set(this.myChoice, item.id, {
                                    status: '-2',
                                    file: ''
                                })
                            }
                            item.name = name
                            item.time = getMyDate(item.time, "yyyy-MM-dd")
                            item.deadline = getMyDate(item.deadline, "yyyy-MM-dd")
                        })
                        console.log( res.data.myChoice,this.myChoice)
                        this.tableData = res.data.missions
                    } else if (res.data.message == 'noChoice') {
                        this.$Notice.warning({
                            title: '请先选择导师'
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
</style>