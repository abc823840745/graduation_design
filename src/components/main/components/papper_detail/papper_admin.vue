<template>
    <div class="detail-container">
        <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时还没有学生选择该导师"></Table>
        <div class="page_container">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" />
        </div>
        <Modal v-model="confirm_modal" title="是否确定让该学生导师选择意向通过？" width="400px">
            <div slot="footer">
                <Button type="primary" size="large" long @click="updateTeacherStudent">确定</Button>
            </div>
        </Modal>
    </div>

</template>

<script>
    import { getMyDate } from '@/libs/tools'
    import { haveTeacherStudent, updateTeacherStudent } from '@/api/teacher'
    export default {
        name: "teacher_detail",
        data() {
            return {
                menber_id:'',
                uid: '',
                cid: 0,
                confirm_modal: false,
                total: 1,
                page: 1,
                size: 10,
                tid: 0,
                username: '',
                teacher_name: '',
                showDel: false,
                keyword: "",
                teacher: {},
                pageSize: 10,
                tableData: [],
                loading: true,
                currentPage: 1,
                columns: [
                      {
                        title: '导师',
                        key: 'teacher_name',
                        align: 'center'
                    },
                    {
                        title: '学号',
                        key: 'stu_number',
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'username',
                        align: 'center'
                    },
                    {
                        title: '年级',
                        key: 'class',
                        align: 'center'
                    },
                    {
                        title: '专业',
                        key: 'major',
                       
                        align: 'center'
                    },
                    {
                        title: "身份",
                        key: "action",
                        align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "span",
                                    {
                                        style: {
                                            marginRight: "1px"
                                        }
                                    },
                                    this.tableData[params.index].is_team == 0 ? '个人组队' : this.tableData[params.index].leader == this.tableData[params.index].u_id ? '组长' : '成员'
                                )
                            ]);
                        }
                    },
                    {
                        title: "状态",
                        width: 90,
                        key: "action",
                        align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "span",
                                    {
                                        style: {
                                            marginRight: "1px",

                                        }
                                    },
                                    this.tableData[params.index].status == 0 ? '审核中' : '已选择'
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
                                            type: "success",
                                            disabled: this.tableData[params.index].status != 0
                                        },
                                        style: {
                                            marginRight: "10px"
                                        },
                                        on: {
                                            click: () => {
                                                this.confirm_modal = true
                                                this.cid = this.tableData[params.index].id
                                                this.uid = this.tableData[params.index].uid
                                                this.menber_id = this.tableData[params.index].menber_id
                                            }
                                        }
                                    },
                                    "通过意向"
                                )
                            ]);
                        }
                    }
                ]
            };
        },
        mounted() {
            this.tid = this.$route.query.tid
            this.teacher_name = this.$route.query.username
            this.$nextTick(() => {
                this.loading = false;
                this.haveTeacherStudent()
            })

        },
        methods: {
            haveTeacherStudent() {
                let id = this.tid
                let size = this.size
                let page = this.page
                haveTeacherStudent(id, page, size).then((res) => {
                    if (res.data.message == 'ok') {
                        this.total = res.data.count
                        res.data.students.forEach((item)=>{
                            item.teacher_name = this.teacher_name
                        })
                        this.tableData = res.data.students
                    }

                })
            },
            changePage(page) {
                this.page = page
                this.haveTeacherStudent()
            },
            updateTeacherStudent() {
                let cid = this.cid
                let uid = this.uid
                let tid = this.tid
                let teacher_name = this.teacher_name
                let menber_id = this.menber_id
                updateTeacherStudent(cid, uid,menber_id, tid, teacher_name).then((res) => {
                    if (res.data.message == 'ok') {
                        this.$Notice.success({
                            title: '操作成功'
                        })
                        this.confirm_modal = false
                        this.haveTeacherStudent()
                    }
                })
            }
        }
    };

</script>
<style scoped>
    .page_container {
        position: absolute;
        right: 20px;
        margin-top: 30px;
    }
</style>