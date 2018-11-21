<style lang="less">

</style>
<template>
    <div>
        <Tabs>
            <TabPane label="设置时间" icon="logo-windows">
                <div>
                    <Table :columns="missionCol" :data="missionReport"></Table>
                </div>
            </TabPane>
        </Tabs>
        <Modal v-model="scoreModal" width="400px" title="给该周报打分" @on-ok="ok">
            <p class="content_title">{{title}}</p>
            <Form :model="scoreForm" :label-width="50">
                <Form-item label="分数" prop="score">
                    <Input-number :max="100" :min="1" :value="score" @on-change="changeScore"></Input-number>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" long @click="updateScore">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { getMyDate } from '@/libs/tools'
    import { getStart, updateScore } from '@/api/teacher'
    export default {
        name: 'practice-week',
        data() {
            return {
                title: '',
                score: 90,
                scoreForm: {},
                scoreModal: false,
                week: 0,
                uid: '',
                content_modal: false,
                contentInfo: {
                    title: '',
                    content: ''
                },
                missionReport: [
                    {
                        name: '开始选择毕设导师时间',
                        type: 'mission',
                        more_time: 0,
                        dead_line: '',
                        content: ''
                    }, {
                        name: '开始写毕设周报时间',
                        type: 'mission',
                        more_time: 0,
                        dead_line: '',
                        content: ''
                    }, {
                        name: '开始写论文时间',
                        type: '开始写论文时间',
                        more_time: 0,
                        dead_line: '',
                        content: ''
                    }, {
                        name: "开始选择课题时间",
                        more_time: 0,
                        type: 'mission',
                        dead_line: '',
                        content: ''
                    }],
                missionCol: [
                    {
                        title: "名称",
                        key: "name",
                        align: "center",
                    },
                    {
                        title: "截至时间",
                        key: "dead_line",
                        align: "center",
                        render: (h, params) => {
                            return h("span", {
                            },
                                this.missionReport[params.index].dead_line ? this.missionReport[params.index].dead_line : '暂时未设置')
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
                                            type: 'success'
                                        },
                                        style: {
                                            marginRight: "10px"
                                        },
                                        on: {
                                            click: () => {
                                            }
                                        }
                                    },
                                    this.missionReport[params.index].dead_line ? '已设置' : '马上设置'
                                )
                            ]);
                        }
                    }
                ]
            }
        },
        mounted() {
            this.uid = this.$route.query.uid
            this.getMissionStart()
        },
        methods: {
            ok() { },
            changeScore(score) {
                this.score = score
            },
            updateScore() {
                updateScore(this.uid, this.type, this.week, this.score).then((res) => {
                    if (res.data.message == 'ok') {
                        this.$Notice.success({
                            title: '打分成功'
                        })
                        if (this.type == 'mission') {
                            this.getMissionStart()
                        } else {
                            this.getWorkStart()
                        }
                        this.scoreModal = false
                    }
                })
            },
            setScore(type, week) {
                this.type = type
                this.week = week
                this.scoreModal = true
            },
            seeDetail(title, content) {
                this.contentInfo.title = title
                this.contentInfo.content = content
                this.content_modal = true
            },
            getMissionStart() {
                let year = this.$store.state.user.choiceBegin
                let token = this.uid
                getStart('mission', year, token).then((res) => {
                    let now = new Date().getTime()
                    if (res.data.message == 'ok') {
                        let startTime = res.data.startTime * 1
                        let oldReport = res.data.oldReport
                        this.missionReport.forEach((item, index) => {
                            let countTime = startTime + (24 * 60 * 60 * 1000 * 14) * index
                            item.dead_line = getMyDate(countTime, "yyyy-MM-dd")
                            if (now > countTime) {
                                item.state = -2
                                item.more_time = 1
                            } else if (now < countTime && (now + (24 * 60 * 60 * 1000 * 14)) > countTime) {
                                item.state = 0
                            }
                        })
                        oldReport.map((item) => {
                            this.missionReport[item.week - 1].content = item.content
                            this.missionReport[item.week - 1].more_time = item.more_time
                            this.missionReport[item.week - 1].status = item.status
                            this.missionReport[item.week - 1].save = item.save
                            if (item.save == 0) {
                                this.missionReport[item.week - 1].state = 3
                            } else if (item.save == 1 && item.status == 0) {
                                this.missionReport[item.week - 1].state = 1
                            } else if (item.status == 2) {
                                this.missionReport[item.week - 1].state = 2
                                this.missionReport[item.week - 1].score = item.score
                            }
                        })
                    } else {
                        this.$Notice.warning({
                            title: '周报任务暂时还没开始！'
                        })
                    }
                })
            }
        },
    }

</script>
<style>
    .content_title {
        position: relative;
        text-align: center;
        margin: 10px 0;
        font-size: 16px;
        font-weight: bold;
    }
</style>