<template>
    <div class="goods">

        <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时还没有上传过论文"></Table>
        <div class="page_container">
            <Page :total="totalSize" :page-size="size" @on-change="changePage" />
        </div>
        <Modal v-model="modal1" width="500">
            <p slot="header" style="text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>确定要修改论文状态？</span>
            </p>
            <Form :model="form" ref="content" :label-width="80">
                </FormItem>
                <FormItem label="是否通过">
                    <RadioGroup v-model="form.status">
                        <Radio :label="0">
                            <span>否</span>
                        </Radio>
                        <Radio :label="1">
                            <span>是</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem v-if="form.status==0" prop="content" label="修改意见">
                    <Input v-model="form.content" type="textarea" :autosize="{minRows: 5,maxRows: 20}" placeholder="请输入修改意见"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" long @click="updatePapper">确定</Button>
            </div>
        </Modal>

        <Modal v-model="content_modal" width="500">
            <p slot="header" style="text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>论文修改意见</span>
            </p>
          <div>{{description}}</div>
        </Modal>
    </div>
</template>
<script>
    import { getOldPapper, updatePapper } from '@/api/teacher'
    import { getMyDate } from '@/libs/tools'
    import config from '@/config'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    const uploadUrl = baseUrl + '/upload/work'

    export default {
        name: "submit-papper",
        data() {
            return {
                form: {
                    status: 0,
                    content: '',
                    papper_id: ''
                },
                modal1: false,
                uid: '',
                flag: true,
                description: '',
                uploadUrl,
                MyChoice: [],
                mission: {},
                uploadList: [],
                ok_modal: false,
                totalSize: 0,
                content_modal: false,
                contentInfo: {
                    title: '',
                    content: ''
                },
                tid: '',
                page: 1,
                size: 10,
                tableData: [],
                multiple: false,
                limit: 1,
                columns: [
                    {
                        title: '导师',
                        key: 'name',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '论文标题',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: "附件信息",
                        key: "download",
                        width: 200,
                        align: "center",
                        render: (h, params) => {
                            return h(this.tableData[params.index].download == 1 ? 'a' : "div", {
                                domProps: {
                                    href: this.tableData[params.index].tip,
                                    download: "w3logo"
                                },
                            },
                                this.tableData[params.index].download == 1 ? '下载附件' : '无附件')
                        }
                    },
                    {
                        title: '提交时间',
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
                                this.tableData[params.index].status == 0 ? '审核中' : this.tableData[params.index].status == -1 ? '未通过' : this.tableData[params.index].status == 1 ? '已完成' : '已超时')
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
                                                let id = this.tableData[params.index].id
                                                if (this.tableData[params.index].status != 0) {
                                                    return
                                                }
                                                this.modal1 = true
                                                this.form.papper_id = id
                                            }
                                        }
                                    },
                                    "论文审核"
                                ),
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
                                                let id = this.tableData[params.index].id
                                                if (this.tableData[params.index].status != -1) {
                                                    return
                                                }
                                                this.seeDetail(this.tableData[params.index].tip)
                                            }
                                        }
                                    },
                                    this.tableData[params.index].status == -1?"查看修改意见":"暂无意见"
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
                this.getOldPapper()
            })
        },
        methods: {
            updatePapper() {

                let {papper_id, content, status} = this.form
                let time = new Date().getTime()
                updatePapper(papper_id, content, status, time).then((res) => {
                    if (res.data.message == 'ok') {
                        this.$Notice.success({
                            title: '修改成功'
                        })
                        this.modal1 = false
                        this.getOldPapper()
                    }
                })
            },
            seeDetail(description) {
                this.description = description
                this.content_modal = true
            },
            changePage(page) {
                this.page = page
                this.getOldPapper()
            },
            getOldPapper() {
                let token = this.uid
                let year = this.$store.state.user.choiceBegin
                let page = this.page
                let size = this.size
                getOldPapper(token, page, size, year).then((res) => {
                    let now = new Date().getTime()
                    if (res.data.message == 'ok') {
                        this.tid = res.data.tid
                        this.tableData = res.data.papperList
                        let name = res.data.name
                        let title = res.data.title
                        let deadline = res.data.deadline
                        res.data.papperList.map((item) => {
                            item.name = name
                            item.title = title
                            if (item.time > deadline) {
                                item.status = -2
                            }
                            item.time = getMyDate(item.time, "yyyy-MM-dd")
                            item.deadline = getMyDate(deadline, "yyyy-MM-dd")
                            return item
                        })
                        this.tableData = res.data.papperList
                        this.totalSize = res.data.count

                    } else if (res.data.message == 'noStart') {
                        this.flag = false
                        this.$Notice.warning({
                            title: '请先选择课题'
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
    
    .btn_container {
        position: absolute;
        bottom: 90px;
        left: 50%;
        transform: translateX(-20px);
    }
</style>