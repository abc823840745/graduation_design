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
    import { getSetTime, updateScore } from '@/api/teacher'
    export default {
        name: 'practice-week',
        data() {
            return {
                times: [],
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
                        type: 'choice',
                        more_time: 0,
                        dead_line: '',
                        content: ''
                    }, {
                        name: '开始写毕设周报时间',
                        type: 'papper',
                        more_time: 0,
                        dead_line: '',
                        content: ''
                    }, {
                        name: '开始写论文时间',
                        type: 'work',
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
                                this.times[this.missionReport[params.index].type] ? this.times[this.missionReport[params.index].type] : '暂时未设置')
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
                                    this.times[this.missionReport[params.index].type] ? '已设置' : '马上设置'
                                )
                            ]);
                        }
                    }
                ]
            }
        },
        mounted() {
            this.getSetTime()
        },
        methods: {
            changeScore(score) {
                this.score = score
            },
            getSetTime() {
                let year = new Date().getFullYear() - 3
                getSetTime(year).then((res) => {
                    if (res.data.message == 'ok') {
                        let times = {}
                        res.data.times.forEach((item) => {
                            times[item.type] = getMyDate(item.time, "yyyy-MM-dd")
                        })
                        this.times = times
                    }
                })
            },
            setScore(type, week) {
                this.type = type
                this.week = week
                this.scoreModal = true
            }
        },
    }

</script>
<style>

</style>