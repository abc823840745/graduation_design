<template>
    <div class="detail-container">
        <img class="bg-img" src="https://media.kaolaplay.com/ggggggd.png" />
        <div class="detail open">
            <div class="detail-wrapper">
                <div class="detail-main">
                    <div class="text">
                        <img class='seller-avatar' :src="teacher.avatar" />
                        <text class='hide-tag close-copy'></text>
                    </div>
                    <div class="overview">
                        <div class="desc">
                            <span class="text">{{teacher.username}}</span>
                        </div>
                        <div class="remark">
                            <div class="block">
                                <div class="content">
                                    <span class="stress">{{teacher.major}}</span>
                                </div>
                                <span>主管方向</span>
                            </div>
                            <div class="block">
                                <div class="content">
                                    <span class="stress">{{teacher.phone}}</span>
                                </div>
                                <span>联系方式</span>
                            </div>
                            <div class="block">
                                <div class="content">
                                    <span class="stress">{{teacher.level}}</span>
                                </div>
                                <span>职称</span>
                            </div>
                            <div class="block">
                                <div class="content">
                                    <span class="stress">{{teacher.experient}}年</span>
                                </div>
                                <span>教学经验</span>
                            </div>
                        </div>
                    </div>
                    <div class="title">
                        <div class="text">教师简介</div>
                    </div>
                    <div class="bulletin">
                        <span class="content">{{teacher.description}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="title-top">该导师的课题</div>
        <Table border :columns="courseColumns" :data="courseData" size="large" no-data-text="该导师暂时还没有课题"></Table>
        <div class="title-top">以下学生已经选择该导师</div>
        <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时还没有学生选择该导师"></Table>
    </div>
</template>

<script>
    import { getDate } from '@/libs/tools'
    import { haveChoiceStudent } from '@/api/teacher'

    export default {
        name: "teacher_detail",
        data() {
            return {
                showDel: false,
                keyword: "",
                teacher: {},
                pageSize: 1,
                tableData: [],
                loading: true,
                courseData: [],
                currentPage: 1,
                courseColumns: [
                    {
                        title: '序号',
                        key: 'index',
                        align: 'center',
                        width:100,
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "span",
                                    ++params.index
                                )
                            ]);
                        }
                    },

                    {
                        title: '选题',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '课题方向',
                        key: 'major',
                         width:200,
                        align: 'center'
                    }, {
                        title: '描述',
                        key: 'content',
                        align: 'center'
                    }],
                columns: [
                    {
                        title: '学号',
                        key: 'stu_number',
                        width: 280,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'username',
                        width: 280,
                        align: 'center'
                    },
                    {
                        title: '年级',
                        key: 'class',
                        width: 250,
                        align: 'center'
                    },
                    {
                        title: '专业',
                        key: 'major',
                        width: 295,
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
                    }
                ]
            };
        },
        mounted() {
            var info = this.$route.query.info
            this.$nextTick(() => {
                this.loading = false;
                this.teacher = JSON.parse(info)
                this.getChoiceStudent(this.teacher.u_id)
            })

        },
        methods: {
            getChoiceStudent(id) {
                haveChoiceStudent(id).then((res) => {
                    this.tableData = res.data.student
                    this.courseData = res.data.myCourse
                })
            },
            handleClick() {

            },
            filterTag(value, row) {
                return row.status === value;
            },
        }
    };

</script>
<style scoped>
    .el-row {
        margin-bottom: 20px;
    }
    
    .el-row:last-child {
        margin-bottom: 0;
    }
    
    .tab-container {
        position: relative;
        width: 70%;
        margin: 60px auto;
    }
    
    .detail-container {
        position: relative;
        margin-bottom: 80px;
    }
    
    .detail {
        position: relative;
        min-height: 450px;
        left: 0;
        -webkit-transition: all 0.3s ease;
        z-index: 999;
        overflow: auto;
        transition: all 0.3s;
    }
    
    .title-top {
        position: relative;
        margin: 15px 0 20px 0;
        font-size: 16px;
        font-weight: bold;
    }
    
    .bg-img {
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 450px;
    }
    
    .detail.open {
        bottom: 0;
    }
    
    .mask {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(7, 17, 27, 0.8);
        z-index: 100;
    }
    
    .close-copy:before {
        font-family: "iconfont" !important;
        font-size: 42px;
        color: black;
        font-style: normal;
        content: "\e888";
    }
    
    .detail-main .text {
        font-size: 24px;
        position: relative;
        text-align: center;
    }
    
    .hide-tag {
        position: absolute;
        right: 45px;
    }
    
    .detail .detail-wrapper {
        position: relative;
        padding: 30px 320px;
    }
    
    .detail .detail-wrapper .detail-main {
        position: relative;
        padding-bottom: 30px;
    }
    
    .detail .detail-wrapper .detail-main .name {
        display: block;
        margin: 0 auto;
        line-height: 16px;
        text-align: center;
        font-size: 16px;
        font-weight: 700px;
    }
    
    .detail .detail-wrapper .detail-main .star-wrap {
        text-align: center;
        margin-top: 18px;
        padding: 2px 0;
    }
    
    .detail .detail-wrapper .detail-main .title {
        position: relative;
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
    }
    
    .detail .detail-wrapper .detail-main .title2 {
        position: relative;
        font-size: 30px;
        text-align: center;
    }
    
    .detail .detail-wrapper .detail-main .title .text {
        padding: 0 12px;
        font-size: 16px;
        text-align: center;
    }
    
    .detail-main .overview {
        position: relative;
        top: -20px;
        padding-bottom: 10px;
    }
    
    .detail-main .overview .title {
        display: block;
        margin-bottom: 20px;
        line-height: 14px;
        font-size: 34px;
    }
    
    .detail-main .overview .desc {
        padding-bottom: 6px;
        position: relative;
        font-size: 0;
        text-align: center;
    }
    
    .detail-main .overview .desc::after {
        display: block;
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        content: "";
        border-top: 1px solid #eee;
        transform-origin: 0 100%;
        transform: scaleY(0.5);
    }
    
    .detail-main .overview .desc .text {
        display: inline-block;
        margin-right: 12px;
        line-height: 36px;
        vertical-align: top;
        font-size: 16px;
    }
    
    .detail-main .overview .remark {
        display: flex;
        padding: 20px 0;
    }
    
    .detail-main .overview .remark .block {
        flex: auto;
        text-align: center;
    }
    
    .detail-main .overview .remark .block:last-child {
        border: none;
    }
    
    .detail-main .overview .remark .block .content {
        line-height: 44px;
    }
    
    .detail-main .overview .remark .block .content .stress {
        font-size: 18px;
        color: black;
    }
    
    .detail-main .overview .remark .block span {
        color: rgb(180, 180, 180);
    }
    
    .detail-main .overview .favorites {
        position: absolute;
        width: 50px;
        right: 11px;
        top: 18px;
        text-align: center;
    }
    
    .detail-main .overview .favorites .icon-favorite {
        display: block;
        margin-bottom: 4px;
        line-height: 24px;
        font-size: 24px;
        color: #d4d6d9;
    }
    
    .detail-main .overview .favorites .actives {
        color: rgb(240, 20, 20);
    }
    
    .detail-main .overview .favorites .text {
        line-height: 10px;
        font-size: 10px;
    }
    
    .detail-main .bulletin {
        padding: 0 36px;
        text-align: center;
    }
    
    .detail-main .bulletin .content {
        position: relative;
        line-height: 26px;
        font-size: 16px;
    }
    
    .seller-avatar {
        position: relative;
        text-align: center;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 3px solid white;
        margin: 10px 0;
    }
</style>