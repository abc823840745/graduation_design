<template>
    <div class="detail-container">
        <img class="bg-img" src="https://media.kaolaplay.com/grabg1.png" />
        <div class="detail open">
            <div class="detail-wrapper">
                <div class="detail-main">
                    <div class="text">
                        <img class='seller-avatar' :src="teacher.avatar" />
                        <text class='hide-tag close-copy'></text>
                    </div>
                    <div class="overview">
                        <div class="desc">
                            <span class="text">{{teacher.name}}</span>
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
                                    <span class="stress">{{teacher.contact}}</span>
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
                        <div class="line"></div>
                        <div class="text">教师简介</div>
                        <div class="line"></div>
                    </div>
                    <div class="bulletin">
                        <span class="content">{{teacher.description}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="title-top">以下学生已经选择该导师</div>
        <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时未到开题时间"></Table>
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
                multipleSelection: [],
                currentPage: 1,
                columns: [
                    {
                        title: '学号',
                        key: 'stu_number',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'username',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '年级',
                        key: 'class',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '专业',
                        key: 'major',
                        width: 295,
                        align: 'center'
                    },
                    {
                        title: '联系方式',
                        key: 'phone',
                        width: 243,
                        align: 'center'
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
                                            marginRight: "1px"
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
        created() {
            var info = this.$route.query.info
            this.$nextTick(() => {
                this.loading = false;
                this.teacher = JSON.parse(info)
                this.getChoiceStudent(this.teacher.id)
            })

        },
        methods: {

            getChoiceStudent(id) {
                haveChoiceStudent(id).then((res) => {
                    this.tableData = res.student
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
<style  scoped>
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
    .detail-container{
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
        margin: 80px 0 30px 0;
        font-size: 16px;
        text-align: center;
    }
    
    .bg-img {
        position: absolute;
       
        z-index: 0;
        width: 100%;
        height: 550px;
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
        padding: 30px;
        color: white;
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
        display: flex;
        width: 80%;
        margin: 14px auto;
    }
    
    .detail .detail-wrapper .detail-main .title2 {
        position: relative;
        color: white;
        font-size: 30px;
        text-align: center;
    }
    
    .detail .detail-wrapper .detail-main .title .line {
        flex: 1;
        position: relative;
        top: -6px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }
    
    .detail .detail-wrapper .detail-main .star-wrap {
        text-align: center;
        margin-top: 18px;
        padding: 2px 0;
    }
    
    .detail .detail-wrapper .detail-main .title .text {
        color: rgb(200, 200, 200);
        padding: 0 12px;
        font-size: 20px;
        font-weight: 700;
        text-align: center;
    }
    
    .detail-main .overview {
        position: relative;
        padding: 10px;
    }
    
    .detail-main .overview .title {
        display: block;
        margin-bottom: 20px;
        line-height: 14px;
        color: white;
        font-size: 34px;
    }
    
    .detail-main .overview .desc {
        padding-bottom: 20px;
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
    
    .detail-main .overview .desc .star {
        display: inline-block;
        margin-right: 8px;
        vertical-align: top;
    }
    
    .detail-main .overview .desc .text {
        display: inline-block;
        margin-right: 12px;
        line-height: 36px;
        vertical-align: top;
        font-size: 18px;
        color: white;
    }
    
    .detail-main .overview .remark {
        display: flex;
        padding: 20px 0;
    }
    
    .detail-main .overview .remark .block {
        flex: auto;
        text-align: center;
        border-right: 1px solid rgba(7, 17, 27, 0.1);
    }
    
    .detail-main .overview .remark .block:last-child {
        border: none;
    }
    
    .detail-main .overview .remark .block .content {
        line-height: 44px;
    }
    
    .detail-main .overview .remark .block .content .stress {
        color: white;
        font-size: 20px;
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
        color: white;
    }
    
    .detail-main .bulletin {
        padding: 0 36px;
        text-align: center;
    }
    
    .detail-main .bulletin .content {
        position: relative;
        line-height: 26px;
        font-size: 16px;
        color: white;
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