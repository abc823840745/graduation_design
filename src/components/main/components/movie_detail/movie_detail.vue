<template>
    <div class="app-container">
        <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
        <Card class="box-card">
            <div class="text item">
                {{movie.title}}
            </div>
            <div class="text item">
                {{movie.description}}
            </div>
            <div class="text item">
                <span @click="addMoviePraise">
              <Icon type="ios-heart" />
                
                <i class="number">{{praise}}</i>
                </span>
                <Icon type="ios-paper" />
                <i class="number">{{ratings}}</i>
            </div>
        </Card>
        <div class="input-container">
            <Input v-model="replyContent" type="textarea" placeholder="请输入评论内容"></Input>
            <Button @click="movieComment" class="btn" type="primary">发布评论</Button >
            <div class='detail_comment-container'>
                <div class="detail_comment" v-for="(item,index) in detailCommentList" :key="index" hover-class="hover_comment">
                    <div v-if="item.val<=0">
                        <div class="comment_top_main">
                            <img class="comment_top_avator" :src="item.avatar">
                            <div class="publish_top_text_wrap">
                                <div class="publish_top_title">{{item.username}}</div>
                                <div class="publish_top_title_date">{{item.rateTime}}</div>
                            </div>
                        </div>
                        <div class="publish_b2">
                            <div class="publish_text_2">
                                <span>{{item.text}}</span>
                            </div>
                            <div class="publish_replay_btn">
                                <Button  type="text" @click="quickReplay(item.comment_user,item.username,item.u_id)"> <i class="iconfont icon-pinglun"></i> 回复</Button >
                            </div>
                        </div>
                    </div>
                    <div class="replay_wrap" v-else>
                        <div class="comment_top">
                            <div class="publish_top_text_wrap">
                                <div class="publish_top_title3"> {{item.username}}
                                    <span class="publish_top_title3_i"> 回复</span> {{item.to_user}}</div>
                                <div class="publish_top_title_date">{{item.rateTime}}</div>
                            </div>
                        </div>
                        <div class="publish_b3">
                            <div class="publish_text3">
                                <span>{{item.text}}</span>
                            </div>
                            <div class="publish_replay_btn">
                                <Button  type="text" @click="quickReplay(item.comment_user,item.username,item.u_id)"> <i class="iconfont icon-pinglun"></i> 回复</Button >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getMyDate } from '@/libs/tools'
    import { addPraise, addComment, getMovieCommentList } from '@/api/movie'
    export default {
        data() {
            return {
                user: {},
                movie: {},
                replyContent: "",
                to_user_name: "",
                to_user_id: 0,
                praise: 0,
                ratings: 0,
                parent_id: 0,
                playerOptions: {
                    playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: false, //如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                        type: "",
                        src: "http://news.sise.edu.cn/Uploads/video/201804261.mp4" //url地址
                    }],
                    poster: "http://game.sise.cn/unitegallery/images/big/image1.jpg", //你的封面地址
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    controlBar: {
                        timeDivider: true,
                        durationDisplay: true,
                        remainingTimeDisplay: false,
                        fullscreenToggle: true  //全屏按钮
                    }
                },
                detailCommentList: []
            };
        },
        created() {
            this.$nextTick(() => {
                let movie = this.$route.query.movie
                movie = JSON.parse(movie)
                this.movie = movie
                this.praise = this.movie.praise
                this.ratings = this.movie.ratings
                this.user = this.$store.state.user
                this.playerOptions.sources[0].src = movie.url
                this.playerOptions.poster = movie.cover
                this.getComment()
            })

        },

        methods: {
            getComment() {
                var mid = this.movie.id
                var that = this
                getMovieCommentList(mid).then((res) => {
                    res.data.comments.forEach((item) => {
                        item.rateTime = getMyDate(item.rateTime, "yyyy-MM-dd")
                    })
                    that.detailCommentList = res.data.comments
                })
            },
            quickReplay(to_user_id, to_user_name, parent_id) {

                this.$prompt('请输入回复内容', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputErrorMessage: '内容格式不正确'
                }).then(({ value }) => {
                    this.to_user_id = to_user_id
                    this.to_user_name = to_user_name
                    this.parent_id = parent_id
                    this.replyContent = value

                    this.movieComment()
                }).catch((err) => {

                    this.$Notice.warning({
                        title: '取消回复'
                    });
                });
            },
            addMoviePraise() {
                var uid = this.$store.state.user.token
                var mid = this.movie.id

                addPraise(uid, mid).then((res) => {
                    if (res.data.message == 1) {
                        var praise = this.movie.praise

                        this.praise = this.praise + 1
                        this.$Notice.success({
                            title: '点赞成功'
                        });
                    } else if (res.data.message == 2) {

                        this.$Notice.warning({
                            title: '不能重复点赞'
                        });
                    }
                })
            },
            movieComment() {
                var mid = this.movie.id
                var parent_id = this.parent_id
                var to_user_name = this.to_user_name
                var to_user_id = this.to_user_id
                var user = this.user
                var uid = user.token
                var name = user.username
                var avatar = user.avatorImgPath
                var rateTime = new Date().getTime()
                var content = this.replyContent.trim()
                if (content == "") {
                    this.$Notice.warning({
                        title: "请填写评论内容"
                    })
                    return
                }
                var that = this
                console.log(mid, uid, name, avatar, content, rateTime, parent_id, to_user_name, to_user_id)
                addComment(mid, uid, name, avatar, content, rateTime, parent_id, to_user_name, to_user_id).then((res) => {
                    that.ratings = that.ratings + 1
                    if (to_user_name) {
                        that.$Notice.warning({
                            title: '回复成功'
                        });
                    } else {
                        that.$Notice.warning({
                            title: "发布评论成功"
                        })
                    }

                    that.replyContent = ""
                    that.getComment()
                })
            }
        }
    };

</script>
<style   scoped>
    .el-row {
        margin-bottom: 20px;
      
    }
    .publish_top_text_wrap{
       
    }
    .detail_comment-container{
        background: white;
    }
     .el-row :last-child {
            margin-bottom: 0;
        }
    .video-player {
        position: relative;
        border-radius: 50%;
    }
    
    .app-container {
        position: relative;
        top: -22px;
        padding: 0 300px;
        overflow: auto;
        height:1000px; 
    }
    ::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
   scrollbar{
       width: 0;
       height: 0;
       color: transparent
   }
    .btn {
        position: absolute;
       right: 300px;
        margin-top: 65px;
        margin-bottom: 20px;
    }
    
    .input-container {
        margin: 20px 0;
    }
    
    .video-js .vjs-big-play-button {
        position: relative;
    }
    
    .number {
        position: relative;
        display: inline-block;
        margin-right: 30px;
        margin-left: 6px;
    }
    
    .good_table {
        display: flex;
        .coverImg {
            img {
                margin: 10px 10px 10px 0;
                display: block;
                width: 100px;
                height: 100px;
            }
        }
        .good_info {
            margin: 10px 0;
            .title {
                text-align: left;
                font-size: 14px;
            }
            .classify {
                font-size: 12px;
                text-align: left;
                color: #666;
            }
        }
    }
    
    .order_info_card {
        width: 850px;
        padding: 10px;
        margin: 10px 0;
        h2 {
            font-size: 16px;
        }
        p {
            font-size: 14px;
        }
        .info {
            display: flex;
            p {
                flex: 0 0 50%;
            }
        }
    }
    
    .text {
        font-size: 14px;
    }
    
    .item {
        padding: 18px 0;
    }
    
    .order_total {
        margin: 10px 0;
        padding: 10px;
        color: #333;
        font-size: 16px;
        .price {
            color: #f50;
            font-size: 20px;
            font-weight: 700;
        }
    }
    
    .detail_comment {
        padding-top: 20px;
    }
    
    .detail_comment_title {
        position: relative;
        padding: 20px 40px;
        font-size: 32px;
    }
    
    .detail_comment_title::after {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        border-top: 1px solid #eee;
        content: "";
        transform-origin: 0 100%;
        transform: scaleY(.5);
    }
    
    .comment_top {
        height: 40px;
        width: 100%;
        display: flex;
    }
    
    .comment_top_main {
        position: relative;
        height: 80px;
        width: 100%;
        display: flex;
        border-top: 1px dashed #eee;
        padding-top: 20px;
    }
    
    .detail_comment:first-child .comment_top_main {
        position: relative;
        margin-top: 50px;
        height: 60px;
        width: 100%;
        display: flex;
        border-top: 0;
        padding-top: 0;
    }
    
    .comment_top_avator {
        position: relative;
        flex: 0 0 60px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    
    .comment_top_title {
        padding-left: 16px;
        height: 80px;
        font-size: 32px;
        line-height: 80px;
    }
    
    .publish_replay_btn {
        position: relative;
        top: -10px;
        text-align: right;
        font-size: 28px;
        color: #333;
        margin-right: 20px;
        padding: 10px;
    }
    
    .publish_top_title {
        padding-left: 16px;
        height: 30px;
        font-size: 14px;
        line-height: 30px;
        color: rgb(100, 100, 100)
    }
    
    .publish_top_title3 {
        padding-left: 16px;
        height: 30px;
        font-size: 14px;
        line-height: 30px;
        color: #999;
    }
    
    .publish_top_title3_i {
        font-weight: 700;
    }
    
    .publish_top_title_date {
        position: relative;
        padding-left: 16px;
        height: 30px;
        font-size: 12px;
        line-height: 30px;
        color: #999;
    }
    
    .publish_b2 {
        display: flex;
        padding-left: 70px;
    }
    
    .replay_wrap {
        position: relative;
        top: -20px;
        margin-left: 80px;
        background-color: #eee;
        padding-top: 10px;
    }
    
    .publish_b3 {
        display: flex;
        padding-left: 16px;
        border-bottom: 1px dashed #eee;
    }
    
    .publish_text {
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 16px 0;
        padding-left: 96px;
        font-size: 32px;
        margin: 10px 0;
    }
    
    .publish_text_2 {
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 8px 0 8px 5px;
        width: 100%;
        font-size: 16px;
    }
    
    .publish_text3 {
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 20px 0;
        width: 100%;
        font-size: 14px;
        color: #555;
    }
</style>