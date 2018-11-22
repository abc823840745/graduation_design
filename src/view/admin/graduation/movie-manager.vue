<style lang="less">

</style>
<template>
    <div>
        <Tabs @on-click="getName">
            <TabPane style="position:relative;height:800px;" :label="workItem.name" v-for="(workItem,index) in workType" :key="index"
                icon="logo-apple">
                <Table border :columns="columns" :data="movieList" size="large" no-data-text="暂时没有优秀毕设"></Table>
                <div class="page_container">
                    <Page :total="total" @on-change="changePage" />
                </div>
                </TabPane>
        </Tabs>
        <div class="choice_btn">
            <Button type="primary" @click="update_modal=true">添加新视频</Button>
        </div>
        <Modal v-model="del_modal" width="400">
            <p slot="header" style="text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>确定要删除该毕设？</span>
            </p>
            <div slot="footer">
                <Button type="primary" size="large" long @click="delMovie">确定删除</Button>
            </div>
        </Modal>
        <Modal v-model="update_modal" width="600">
            <p slot="header" style="text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>优秀毕业设计管理？</span>
            </p>
            <Form :model="form" ref="content" :label-width="120" :rules="ruleInline">
                <FormItem prop="title" label="视频标题">
                    <Input v-model="form.title" placeholder="请输入视频标题"></Input>
                </FormItem>
                <FormItem prop="description" label="视频描述">
                    <Input v-model="form.description" placeholder="请输入视频描述"></Input>
                </FormItem>
                <FormItem prop="url" label="视频地址">
                    <Input v-model="form.url" placeholder="请输入视频地址"></Input>
                </FormItem>
                <FormItem prop="author" label="视频作者">
                    <Input v-model="form.author" placeholder="请输入视频作者"></Input>
                </FormItem>
                <FormItem label="专业方向">
                    <Select v-model="form.type">
              <Option v-for="(item,index) in majorType" :key="index" :value="item.value">{{item.name}}</Option>
            </Select>
                </FormItem>
                <FormItem label="上传视频封面">
                    <Upload type="drag" :max-size="2048" :format="['jpg','png','jpeg']" :action="uploadUrl" :on-exceeded-size="handleMaxSize"
                        :on-success="handleSuccess">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>请上传视频封面，2M以内！</p>
                        </div>
                        </Upload>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" long @click="updateMovie">确认上传</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { getMovieList, delMovie, updateMovie } from "@/api/movie";
    import { getMyDate } from '@/libs/tools'
    import config from '@/config'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    const uploadUrl = baseUrl + '/upload/work'
    export default {
        name: 'movie_detail',
        data() {
            return {
                uploadUrl,
                update_modal: false,
                del_modal: false,
                did: 0,
                form: {
                    id: 0,
                    type: 'network',
                    time: '',
                    title: '',
                    description: '',
                    author: '',
                    cover: '',
                    url: ''
                },
                workType: [{
                    name: '网络与新媒体',
                    value: 'network'
                }, {
                    name: '数字媒体技术',
                    value: 'game'
                }, {
                    name: '动画',
                    value: 'paint'
                }],
                majorType: [{
                    name: '网络与新媒体',
                    value: 'network'
                }, {
                    name: '数字媒体技术',
                    value: 'game'
                }, {
                    name: '动画',
                    value: 'paint'
                }],
                columns: [
                    {
                        title: '上传日期',
                        key: 'time',
                        width: 180,
                        align: 'center'
                    },
                    {
                        title: '视频标题',
                        key: 'title',
                        width: 420,
                        align: 'center'
                    },
                    {
                        title: '视频描述',
                        key: 'description',
                        width: 580,
                        align: 'center'
                    },
                    {
                        title: '视频作者',
                        key: 'author',
                        width: 180,
                        align: 'center'
                    },
                    {
                        title: "视频封面",
                        key: "cover",
                        width: 200,
                        align: "center",
                        render: (h, params) => {
                            return h('img', {
                                domProps: {
                                    src: this.movieList[params.index].cover
                                },
                                style: {
                                    height: '60px',
                                    marginTop: "6px"
                                }
                            })
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
                                            type: "primary"
                                        },
                                        style: {
                                            marginRight: "10px"
                                        },
                                        on: {
                                            click: () => {
                                                this.did = this.movieList[params.index].id
                                                this.del_modal = true
                                            }
                                        }
                                    },
                                    "删除"
                                ),
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "success"
                                        },
                                        style: {
                                            marginRight: "10px"
                                        },
                                        on: {
                                            click: () => {
                                                this.form = this.movieList[params.index]
                                                this.update_modal = true
                                            }
                                        }
                                    },
                                    "更新"
                                )
                            ]);
                        }
                    }
                ],
                theme2: 'light',
                curPage: 1,
                pageSizes: 10,
                pageCount: 10,
                total: 1,
                type: "network",
                typeList: ["game", "paint", "network"],
                start: 0,
                keyword: "",
                activeName: "first",
                orderActive: "first",
                movieList: [],
                ruleInline: {
                    title: [
                        { required: true, message: '请输入有效标题', trigger: 'blur', type: 'string' }
                    ],
                    description: [
                        { required: true, message: '请输入有效的描述', trigger: 'blur', type: 'string' }
                    ]
                },
            };
        },
        created() {

            this.$nextTick(() => {
                this.getMovie()
            })
        },
        methods: {
            delMovie() {
                delMovie(this.did).then((res) => {
                    this.del_modal = false
                    if (res.data.message == 'ok') {
                        this.$Notice.success({
                            title: '删除成功！'
                        })
                        this.getMovie()
                    }
                })
            },
            updateMovie() {
                if (!this.form.url) {
                    this.$Notice.error({
                        title: "请上传视屏封面"
                    })
                    return
                }
                if (!this.form.title.trim() || this.form.title.trim().length < 2) {
                    this.$Notice.error({
                        title: "请填写标题"
                    })
                    return
                }
                if (!this.form.description.trim() || this.form.description.trim().length < 6) {
                    this.$Notice.error({
                        title: "描述不能少于6个字"
                    })
                    return
                }
                if (!this.form.cover.trim() || this.form.cover.trim().length < 6) {
                    this.$Notice.error({
                        title: "请上传视频封面"
                    })
                    return
                }
                if (!this.form.url || this.form.url.trim().length < 6) {
                    this.$Notice.error({
                        title: "请填写视频地址"
                    })
                    return
                }
                console.log(6666)
                this.form.time = new Date().getTime()
                updateMovie(this.form).then((res) => {
                    if (res.data.message == 'ok') {
                        this.$Notice.success({
                            title: "上传成功！"
                        })
                        this.getMovie()
                        this.update_modal = false
                    }
                })
            },
            getName(name) {
                this.type = this.workType[name].value
                this.start = 0
                this.getMovie()
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: "文件超过大小限制",
                    desc: "文件大小不能查过2M！"
                });
            },
            handleSuccess(res, file) {
                var file = "https://" + res.data.url
                this.form.url = file
                this.uploadList.push({ url: file, status: "finished" })
            },
            goToDetail(item) {
                var movie = JSON.stringify(item)
                this.$router.push({ path: `/movie/detail?movie=${movie}` })
            },
            changePage(e) {
                this.start = e - 1
                this.getMovie()
            },
            getMovie() {
                var type = this.type
                var offset = this.start
                var keyword = this.keyword
                getMovieList(type, offset, keyword).then((res) => {
                    var movieList = res.data.movies
                    if (res.data.status == 1) {
                        this.movieList = movieList
                        this.total = res.data.count
                    }
                })
            },
            handleClick(index) {
                if (index > 3) {
                    return
                }
                this.type = this.typeList[index - 1]
                this.curPage = 1
                this.getMovie()
            },
        }
    };

</script>
<style>
    .img-container {
        position: relative;
        width: 290px;
        height: 210px;
    }
      
  .choice_btn {
    position: fixed;
    width: 320px;
    text-align: center;
    left: 50%;
    bottom: 80px;
    transform: translateX(-20px);
    margin: 0 auto;
  }
    .title-wrapper {
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .page_container {
        position: absolute;
        right: 20px;
        margin-top: 30px;
    }
</style>