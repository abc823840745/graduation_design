<style lang="less">
  .teacher-question-detail {
    .v-note-wrapper {
      z-index: 0;
    }
    .teacher-question-detail-top {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      background-color: #fff;
      padding: 14px 20px;
      border-radius: 10px;
      color: #666;
      box-shadow: 2px 2px 2px #eee;
      .teacher-question-title {
        font-weight: 700;
        font-size: 18px;
        .time {
          font-weight: 500;
          font-size: 12px;
          color: #888;
        }
        .course-name {
          font-weight: 500;
          font-size: 14px;
          color: #888;
        }
      }
      .question-content {
        font-size: 14px;
        margin: 10px 0;
        img {
          max-width: 100%;
        }
      }
      .teacher-question-sub {
        font-size: 14px;
        margin-top: 10px;
        color: #888;
      }
      .teacher-question-status-btn {
        font-size: 14px;
        line-height: 27px;
      }
      .answer-panel {
        width: 100%;
        padding: 10px 0;
        .answer-panel-btn {
          margin-top: 10px;
          text-align: right;
        }
      }
    }
    .questions-key-title {
      font-size: 16px;
      color: #666;
      font-weight: 700;
      padding: 14px 20px;
      position: relative;
      p {
        background-color: #f5f7f9;
      }
      .none-reply {
        text-align: center;
        background-color: #fff;
        padding: 14px 20px;
        border-radius: 10px;
        color: #666;
        box-shadow: 2px 2px 2px #eee;
      }
    }
    .keyword-panel {
      .answer_item {
        margin-bottom: 20px;
        padding: 14px 20px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 2px 2px 2px #eee;
        .answerer {
          margin: 10px 0;
          display: flex;
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
          justify-content: space-between;
          .answer-left {
            display: flex;
            .avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              font-size: 16px;
              line-height: 40px;
              font-weight: 700;
              color: #fff;
              text-align: center;
              background-color: #2db7f5;
            }
            .answerer-name {
              font-size: 16px;
              color: #666;
              margin-left: 10px;
              display: flex;
              flex-direction: column;
              .role-teacher {
                color: #ffa500;
              }
              .answer-date {
                display: block;
                color: #888;
                font-size: 12px;
                margin: 0;
              }
            }
          }
        }
        .answer-content {
          font-size: 14px;
          img {
            max-width: 100%;
          }
        }
        .answer-comment-top {
          margin-top: 10px;
          padding-top: 10px;
          padding-bottom: 10px;
          border-top: 1px dashed #ddd;
          font-size: 12px;
          line-height: 18px;
          color: #888;
          cursor: pointer;
          .del-reply-btn {
            float: right;
          }
        }
        .answer-comment-list {
          list-style-type: none;
          .reply-someone-text {
            color: #2d8cf0;
          }
          .answer-comment-list-content {
            img {
              max-width: 100%;
            }
          }
          li {
            border-bottom: 1px dashed #ddd;
            padding: 6px;
            margin-top: 10px;
            .answer-comment-list-info {
              text-align: right;
              span {
                display: inline-block;
                margin-left: 4px;
              }
              .reply-btn {
                color: #2d8cf0;
                cursor: pointer;
              }
              .reply-del-btn {
                color: #dc143c;
                cursor: pointer;
              }
            }
          }
        }
        .answer-comment {
          background-color: #fafafa;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
          padding: 10px;
          margin-top: 10px;
          .reply-tag {
            margin-bottom: 10px;
          }
          .write-comment {
            display: flex;
            .comment-post-btn {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
  #editor {
    margin: auto;
    width: 80%;
    height: 580px;
  }
</style>
<template>
  <div class="teacher-question-detail">
    <div class="teacher-question-detail-top">
      <div>
        <h2 class="teacher-question-title">{{question_detail.title}} <span class="course-name">[{{question_detail.course_name}} - {{question_detail.course_code}} - {{question_detail.course_classes}}]</span></h2>
        <p class="teacher-question-sub">提问者：{{question_detail.username}}</p>
        <p class="teacher-question-sub">时间：{{question_detail.created_at}}</p>
        <div class="question-content" v-html="question_detail.content"></div>
        <Button v-if="question_detail.audit_status!='ing' && question_detail.audit_status!='fail'" style="margin-top:10px" icon="ios-create-outline" type="success" @click.native="showAnswerPanel">我来答</Button>
      </div>
      <p class="teacher-question-status-btn" v-if="question_detail.audit_status!='ing' && question_detail.audit_status!='fail' && (isTeacher || isSelf)">
        <!-- <Button size="small" shape="circle" @click.native="checkStudentList" type="primary">状态设置</Button> -->
        <Select v-model="question_detail.status" style="width:100px" @on-change="changeQuestionStatus($event, question_detail.id)">
          <Option value="unsolved" label="未解决">
              <span>未解决</span>
          </Option>
          <Option value="resolved" label="已解决">
              <span>已解决</span>
          </Option>
          <Option value="closed" label="已关闭">
              <span>已关闭</span>
          </Option>
        </Select>
      </p>
      <div class="answer-panel" v-if="show_answer_panel">
        <mavon-editor style="height: 300px" ref="md" @imgAdd="$imgAdd" v-model="answer_content" @change="renderEditor"></mavon-editor>
        <div class="answer-panel-btn"><Button type="primary" @click="showSubmitAnswer()">提交回答</Button></div>
      </div>
    </div>
    <div class="questions-key-title">
      <p v-if="answer_list.length > 0">{{answer_list.length}}个回答</p>
      <p class="none-reply" v-else-if="question_detail.audit_status!='ing' && question_detail.audit_status!='fail'">还没有人回答该问题，点击上方「我来答」试一试吧~</p>
      <p v-else class="none-reply">该问题尚未审核</p>
    </div>
    <div class="keyword-panel" v-if="answer_list.length > 0">
      <div class="answer_item" v-for="(item,index) in answer_list" :key="index">
        <div class="answerer">
          <div class="answer-left">
            <div class="avatar">{{item.fisrt_name}}</div>
            <p class="answerer-name">
              <span>{{item.username}}
                <Tooltip v-if="item.role == 'teacher' || item.role == 'admin'" content="教师认证">
                  <Icon class="role-teacher" type="md-medal"  />
                </Tooltip>
              </span>
              <span class="answer-date">{{item.created_at}}</span>
            </p>
          </div>
          <Tag :color="item.status=='useful'?'cyan':'green'" v-if="item.status!='general'">{{item.status=='useful'?'有用答案':'最佳答案'}}</Tag>
        </div>
        <div class="answer-content" v-html="item.content"></div>
        <div class="answer-comment-top">
          <Icon type="ios-chatbubbles" />
          <span @click="showComment(item.id)"> {{'评论（' + item.commentList.length + '）'}} </span>
          <span> 将该答案设为 </span>
          <Select v-if="isTeacher || isSelf" :value="item.status" size="small" @on-change="chanegAnswerStatus($event, item.id)" style="width:100px">
              <Option value="general" >普通答案</Option>
              <Option value="useful" >有用答案</Option>
              <Option value="best" >最佳答案</Option>
          </Select>
          <Button v-if="isTeacher" class="del-reply-btn" size="small" @click="delReply(item.id)" type="error">删除</Button>
        </div>
        <ul class="answer-comment-list" v-if="item.show_comment">
          <li v-for="(comment_item, comment_index) in item.commentList" :key="comment_index">
            <span class="reply-someone-text" v-if="comment_item.to_user_name">@{{comment_item.to_user_name}}：</span>
            <div class="answer-comment-list-content" v-html="comment_item.content"></div>
            <div class="answer-comment-list-info">
              <span>{{comment_item.from_user_name}}</span>
              <span>{{comment_item.created_at}}</span>
              <span class="reply-btn" v-if="!comment_item.is_self" @click="replyMember(index, comment_item.from_user_name, comment_item.from_user_role)">回复</span>
              <span class="reply-del-btn" v-if="comment_item.is_self" @click="delComment(comment_item.id)">删除</span>
            </div>
          </li>
        </ul>
        <div class="answer-comment" v-if="item.show_comment">
          <Tag class="reply-tag" v-if="item.reply_ing_username" color="primary" type="border" closable @on-close="cancelReply(index)">正在回复@{{item.reply_ing_username}}</Tag>
          <div class="write-comment">
            <mavon-editor style="height: 300px" ref="md2" @imgAdd="$imgAdd2" v-model="my_comment_content" @change="renderEditorComment"></mavon-editor>
            <div class="comment-post-btn"><Button type="primary" @click="saveComment(item.id, index)">发表</Button></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 提交答案panel -->
    <Modal
      v-model="show_answer_submit"
      title="提示"
      :loading="submit_answer_loading"
      @on-ok="submitAnswer">
      <p>您确定要提交答案？</p>
    </Modal>
    <!-- 提交答案panel end -->
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { getQuestionDetail, uploadImage, askQuestionReply, addCommentQuestion, delReplyQuestion, delCommentQuestion, changeReplyStatus, changeQuestionStatus } from '@/api/course'
export default {
  name: 'teacher-question-detail',
  data () {
    return {
      isTeacher: false,
      isSelf: false,
      question_detail: {
        content: "提问测试",
        course_classes: "C201",
        course_code: "AME",
        course_name: "",
        created_at: "",
        id: "",
        number: "",
        status: "unsolved",
        title: "",
        username: "骆镜濠",
      },
      answer_list: [],
      // 填写的回答
      answer_content: '',
      // html的回答
      answer_render_content: '',
      // 评论回答
      my_comment_content: '',
      // html的回复
      answer_render_comment: '',
      // 展示回答panel
      show_answer_panel: false,
      // 提交答案panel
      show_answer_submit: false,
      // 提交答案loading
      submit_answer_loading: true,
      // 当前点击打开的回答下标
      current_id: 0
    }
  },
  methods: {
    // 展开评论面板
    showComment (id) {
      // this.answer_list[i].show_comment = !this.answer_list[i].show_comment
      this.answer_list.map((item,index)=>{
        if(item.id == id) {
          item.show_comment = !item.show_comment
        } else {
          item.show_comment = false
        }
        return item
      })
      this.current_id = id
      this.$forceUpdate();
    },
    showAnswerPanel() {
      this.show_answer_panel = !this.show_answer_panel;
    },
    showSubmitAnswer() {
      if(!this.answer_content) {
        this.$Message.warning('请输入回答内容');
        return false
      }
      this.show_answer_submit = true
    },
    // 提交答案
    submitAnswer() {
      this.askQuestionReply(()=>{
        this.show_answer_submit = false;
      })
    },
    // 设置答疑状态
    changeQuestionStatus(v,id){
      changeQuestionStatus({
        id,
        status: v
      }).then((res)=>{
        console.log(res)
        this.$Message.success('设置成功')
        this.getQuestionDetail()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('设置失败');
      })
    },
    // 设置回答状态
    chanegAnswerStatus(v,id){
      changeReplyStatus({
        id,
        status: v
      }).then((res)=>{
        console.log(res)
        this.$Message.success('设置成功')
        this.getQuestionDetail()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('设置失败');
      })
    },
    // 获取答疑详情 <公共>
    getQuestionDetail(id, i) {
      getQuestionDetail({
        id: id || this.$route.params.id
      }).then((res)=>{
        console.log(res)
        res.data.questionDetail.created_at = getMyDate(new Date(res.data.questionDetail.created_at).getTime(), "yyyy-MM-dd hh:mm")
        this.question_detail = res.data.questionDetail
        // 判断是否自己的提问
        if(this.$store.state.user.stu_nmuber == res.data.questionDetail.number) {
          this.isSelf = true
        }
        this.answer_list = res.data.questionDetail.replyList.map((item, index)=>{
          item.created_at = getMyDate(new Date(item.created_at).getTime(), "yyyy-MM-dd hh:mm")
          item.fisrt_name = item.username.substr(0, 1)
          item.commentList = item.commentList.map((com_item)=>{
            com_item.created_at = getMyDate(new Date(com_item.created_at).getTime(), "yyyy-MM-dd hh:mm")
            return com_item
          })
          if(item.id == i){
            item.show_comment = true
          }else{
            item.show_comment = false
          }
          item.reply_ing_username = ''
          item.reply_ing_role = ''
          return item
        })
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取答疑详情失败');
      })
    },
    renderEditor(val, render) {
      this.answer_render_content = render
    },
    renderEditorComment(val, render) {
      this.answer_render_comment = render
    },
    // 编辑器上传图片 绑定@imgAdd event uploadImage
    $imgAdd(pos, $file){
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('file', $file);
        uploadImage(formdata).then((res)=> {
          console.log(res);
          this.$Message.success('上传成功')
          let url = res.data.urls[0].filePath
          this.$refs.md.$img2Url(pos, url);
        }).catch((err)=>{
          console.log(err)
          this.$Message.error('上传失败')
        })
    },
    // 评论编辑器上传图片 绑定@imgAdd2 event uploadImage
    $imgAdd2(pos, $file){
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('file', $file);
        uploadImage(formdata).then((res)=> {
          console.log(res);
          this.$Message.success('上传成功')
          let url = res.data.urls[0].filePath
          this.$refs.md2[0].$img2Url(pos, url);
        }).catch((err)=>{
          console.log(err)
          this.$Message.error('上传失败')
        })
    },
    // 答疑回答
    askQuestionReply(cb = ()=>{}) {
      if(!this.answer_content) {
        this.$Message.warning('请输入回答内容');
        cb()
        return false
      }
      askQuestionReply({
        question_id: this.$route.params.id,
        content: this.answer_render_content
      }).then((res)=>{
        console.log(res)
        this.$Message.success('回答成功')
        cb()
        this.getQuestionDetail()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('提交回答失败');
        cb()
      })
    },
    // 回答评论
    saveComment(id, index) {
      addCommentQuestion({
        content: this.answer_render_comment,
        reply_id: id,
        question_id: this.$route.params.id,
        from_user_name: this.$store.state.user.userName,
        to_user_name: this.answer_list[index].reply_ing_username || '',
        to_user_role: this.answer_list[index].reply_ing_role || ''
      }).then((res)=>{
        console.log(res)
        this.$Message.success('回复成功')
        this.getQuestionDetail(null, this.current_id)
        this.my_comment_content = ''
        this.$forceUpdate();
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('回复失败');
        cb()
      })
    },
    // 回复其他人
    replyMember(index, username, role) {
      this.answer_list[index].reply_ing_username = username
      this.answer_list[index].reply_ing_role = role
      this.$forceUpdate();
    },
    // 取消回复
    cancelReply(index) {
      this.answer_list[index].reply_ing_username = ''
      this.answer_list[index].reply_ing_role = ''
      this.$forceUpdate();
    },
    // 删除评论
    delComment(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>删除该条评论？</p>',
        loading: true,
        onOk: () => {
          delCommentQuestion({
            id
          }).then((res)=>{
            console.log(res)
            this.$Modal.remove();
            this.$Message.success('删除成功');
            this.getQuestionDetail(null, this.current_id)
          }).catch((err)=>{
            console.log(err)
            this.$Modal.remove();
            this.$Message.error('删除失败');
          })
        }
      });
    },
    // 删除回答
    delReply(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>删除该条回答？</p>',
        loading: true,
        onOk: () => {
          delReplyQuestion({
            id
          }).then((res)=>{
            console.log(res)
            this.$Modal.remove();
            this.$Message.success('删除成功');
            this.getQuestionDetail(null, this.current_id)
          }).catch((err)=>{
            console.log(err)
            this.$Modal.remove();
            this.$Message.error('删除失败');
          })
        }
      });
    }
  },
  created () {
    this.getQuestionDetail()
    console.log(this.$store.state.user)
  },
  components: {
    mavonEditor
  },
  mounted () {

  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if(to.name == 'student-answer-index'){
        vm.isTeacher = false
      }else{
        vm.isTeacher = true
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to,from)
    this.getQuestionDetail(to.params.id)
    next(vm => {});
  },
}
</script>
