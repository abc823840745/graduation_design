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
        <Modal v-model="timeModal" width="400px" title="确定设置该时间？" @on-ok="ok">
            <p class="content_title">{{title}}</p>
            <Form :model="form" :label-width="50">
                <Form-item label="面向对象">
                    <Input :value="form.time" disabled></Input>
                </Form-item>
                <FormItem prop="deadline" label="截至/开始时间">
                    <DatePicker v-model="form.deadline" type="datetime" placeholder="请选择截至时间" style="width: 200px"></DatePicker>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" long @click="updateTime">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { getMyDate } from '@/libs/tools'
    import { getSetTime, updateTime } from '@/api/teacher'
    export default {
        name: 'practice-week',
        data() {
            return {
                choiceType: '',
                form: {
                    time: '',
                    deadline: ''
                },
                times: [],
                title: '',
                score: 90,
                scoreForm: {},
                timeModal: false,
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
                                                this.choiceType = this.missionReport[params.index].type
                                                this.timeModal = true
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
            getSetTime() {
                let year = new Date().getFullYear() - 3
                this.form.time = year
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
            updateTime() {
                let {time, deadline} = this.form
                let type = this.choiceType
                let  post_time = new Date().getTime()
                updateTime(time, deadline,type, post_time).then((res)=>{
                    if(res.data.message=='ok'){
                        this.$Notice.success({
                            title:'更新成功！'
                        })
                    }
                })
            }
        },
    }

</script>
<style>

</style>