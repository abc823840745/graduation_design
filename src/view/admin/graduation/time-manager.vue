<style lang="less">

</style>
<template>
    <div>
        <Tabs>
            <TabPane label="设置时间" icon="logo-windows">
                <div>
                    <Table :columns="missionCol" :data="times"></Table>
                </div>
            </TabPane>
        </Tabs>
        
        <Modal v-model="timeModal" width="500px" title="确定设置该时间？"  >
            <p class="content_title">{{title}}</p>
            <Form :model="form" :label-width="120" >
                <Form-item label="面向年级">
                    <Input  v-model="form.time" ></Input>
                </Form-item>
                <Form-item prop="startEndDate" label="截至/开始时间">
                    <Date-picker v-model="form.startEndDate" type="daterange" placeholder="请选择开始和截至时间" style="width: 346px"></Date-picker>
                </Form-item>
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
                    startEndDate: ''
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
                missionCol: [
                    {
                        title: "名称",
                        key: "name",
                        align: "center",
                    },
                    {
                        title: "面向年级",
                        key: "year",
                        align: "center"
                    },
                    {
                        title: "开始时间",
                        key: "start_time",
                        align: "center",
                    },
                    {
                        title: "截至时间",
                        key: "end_time",
                        align: "center",
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
                                                this.choiceType = this.times[params.index].type
                                                this.form.time = this.times[params.index].year
                                                this.timeModal = true
                                            }
                                        }
                                    },
                                    '重新设置' 
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
                getSetTime().then((res) => {
                    if (res.data.message == 'ok') {
                        res.data.times.forEach((item) => {
                            item['start_time'] = getMyDate(item.time, "yyyy-MM-dd")
                            item['end_time'] = getMyDate(item.deadline, "yyyy-MM-dd")
                        })
                        this.times = res.data.times
                    }
                })
            },
            updateTime() {
                let {time, startEndDate} = this.form
                let type = this.choiceType
                let post_time = new Date().getTime()
                let beginDate = new Date(startEndDate[0]).getTime()
                let endDate = new Date(startEndDate[1]).getTime()
                updateTime(time,beginDate,endDate, type, post_time).then((res) => {
                    if (res.data.message == 'ok') {
                        this.$Notice.success({
                            title: '更新成功！'
                        })
                        this.timeModal = false
                        this.getSetTime()
                    }
                })
            }
        },
    }

</script>
<style>

</style>