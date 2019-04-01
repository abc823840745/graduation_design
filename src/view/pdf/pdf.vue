<template>
  <div class="pdf" v-show="fileType === 'pdf'" ref="pdf_window">
    <p class="arrow">
      <ButtonGroup shape="circle" size="small">
          <Button type="dashed" @click="changePdfPage(0)">
              <Icon type="ios-arrow-back"></Icon>
              上一页
          </Button>
          <Button type="dashed" :disabled="true">{{currentPage}} / {{pageCount}}</Button>
          <Button type="dashed" @click="changePdfPage(1)">
              下一页
              <Icon type="ios-arrow-forward"></Icon>
          </Button>
      </ButtonGroup>
      <Button v-if="full_screen" class="full-screen-btn" size="small" shape="circle" :icon="is_full_screen?'ios-contract':'ios-expand'" @click="hanleFull"></Button>
    </p>
    <div :class="{'pdf-area': true, 'full-screen': is_full_screen}">
      <pdf
        ref="pdf_dom"
        :src="src"
        :page="currentPage"
        @progress="getLoadProgress"
        @num-pages="pageCount=$event"
        @page-loaded="currentPage=$event"
        @loaded="loadPdfHandler"
        @click.native="click_change?clickChangePage():null">
      </pdf>
    </div>
    <div class="right-area" v-if="show_notes" :style="notes_list_height!=''?'overflow-y: scroll;'+notes_list_height:'overflow-y: scroll;'+notes_list_height">
      <Card :bordered="true" class="notes-card">
        <p slot="title">我的笔记</p>
        <div>
          <Input v-model="fast_note_content" type="textarea" :autosize="{maxRows: 3, minRows: 3}" placeholder="快速笔记，可回车保存..." @on-enter="saveNote" />
          <p class="add-note-btn">
            <Button shape="circle" :disabled="is_full_screen" @click="showCreateNote = true">高级笔记</Button>
            <Button type="primary" shape="circle" @click="saveNote" :loading="save_loading">保存笔记</Button>
          </p>
          <ul class="notes-list" v-if="notes_list.length !=0">
            <li v-for="(item, index) in notes_list" :key="index">
              <div v-html="item.content" class="render-html"></div>
              <p class="note-tag">
                <span class="time">{{item.created_at}}</span>
                <span class="more" @click="lookDetail(index)">详情</span>
                <span class="delete" @click="delNote(item.id)">删除</span>
              </p>
            </li>
          </ul>
          <div class="noyes-none" v-else>
            您在本课时还没记录过笔记哦~
          </div>
          <div class="notes-page-nav" v-if="notes_list.length !=0">
            <Page :current="notes_offset" :total="notes_total" size="small" :page-size="notes_limit" @on-change="changeNotePage" />
          </div>
        </div>
      </Card>
    </div>
    <Modal v-model="showCreateNote" draggable scrollable title="新建笔记" :loading="high_loading">
      <mavon-editor style="height: 300px" ref="md" @imgAdd="$imgAdd" v-model="note_content" :toolbars="editorOptions" @change="renderEditor" placeholder="请填写笔记内容..."></mavon-editor>
      <div slot="footer">
        <Button type="text" size="large" @click="showCreateNote=false">取消</Button>
        <Button type="primary" size="large" @click="saveHighNote">确定</Button>
      </div>
    </Modal>
    <Modal v-model="showNoteDetail" draggable scrollable title="笔记详情" :footer-hide="true">
        <div v-html="note_detail_content" class="render-html-detail"></div>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
  import pdf from 'vue-pdf'
  import { getMyDate } from '@/libs/tools'
  import { mavonEditor } from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import { setTimeout } from 'timers';
  import { getNotesList, addStuNotes, deleteNote, uploadImage } from '@/api/course'
  export default {
    components: {
      pdf,
      mavonEditor
    },
    props: {
      src: String,
      click_change: Boolean,
      full_screen: Boolean,
      show_notes: Boolean,
      course_time_id: String,
      course_id: String
    },
    data () {
      return {
        spinShow: true,
        currentPage: 0,
        pageCount: 0,
        fileType: 'pdf',
        is_full_screen: false,
        fast_note_content: '',
        note_content: '',
        render_note_content: '',
        notes_list_height: 0,
        save_height: 0,
        showCreateNote: false,
        defaultData: "preview",
        editorOptions: {
          bold: true,
          italic: true,
          header: true,
          underline: true,
          strikethrough: true,
          mark: true,
          superscript: true,
          subscript: true,
          quote: true,
          ol: true,
          ul: true,
          link: true,
          imagelink: true, 
          code: true,
          table: true,
          fullscreen: true,
          readmodel: false,
          htmlcode: true, 
          help: true,
          undo: true,
          redo: true,
          trash: true,
          save: true,
          navigation: true,
          alignleft: true,
          aligncenter: true,
          alignright: true,
          subfield: true,
          preview: true,
        },
        // 笔记部分存值
        notes_offset: 1,
        notes_limit: 10,
        notes_list: [],
        notes_total: 0,
        save_loading: false,
        high_loading: false,
        showNoteDetail: false,
        note_detail_content: ''
      }
    },
    mounted() {
　　　　pdf.createLoadingTask(this.src)
        const _that=this;
        window.addEventListener('resize', function() {
            if (_that.is_full_screen) {
              console.log('退出全屏')
              _that.is_full_screen = false
              _that.notes_list_height = 'height:' + _that.save_height + 'px;'
            }else{
              _that.is_full_screen = true
              _that.showCreateNote = false
            }
        })
        this.getNotesList()
　　},
    methods: {
      changePdfPage (val) {
        if (val === 0 && this.currentPage > 1) {
          this.currentPage--
        }
        if (val === 1 && this.currentPage < this.pageCount) {
          this.currentPage++
        }
      },
      // pdf加载时
      loadPdfHandler (e) {
        console.log('加载完')
        this.spinShow = false
        this.currentPage = 1 // 加载的时候先加载第一页
      },
      getLoadProgress(num) {
        if(num == 1){
          setTimeout(()=>{
            console.log(this.$refs.pdf_dom.$refs.annotationLayer.clientHeight)
            this.save_height = this.$refs.pdf_dom.$refs.annotationLayer.clientHeight
            this.notes_list_height = 'height:' + this.save_height + 'px;'
          },500)
        }
      },
      // 点击PDF触发下一页
      clickChangePage() {
        if (this.currentPage < this.pageCount) {
          this.currentPage++
        }
      },
      // 展示全屏
      showFull() {
        var full = this.$refs.pdf_window;
        this.launchIntoFullscreen(full);
      },
      // 全屏函数
      launchIntoFullscreen(element) {
        if(element.requestFullscreen){
            element.requestFullscreen();
        }
        else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
        else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
      },
      // 退出全屏
      exitFullscreen() {
        if(document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
      },
      // 点击全屏
      hanleFull() {
        if(this.is_full_screen){
          this.exitFullscreen()
          this.notes_list_height = 'height:' + this.save_height + 'px;'
        }else{
          this.showFull()
          this.notes_list_height = ''
        }
      },
      // 获取笔记
      getNotesList() {
        getNotesList({
          course_id: this.course_id,
          course_time_id: this.course_time_id,
          offset: this.notes_offset,
          limit: this.notes_limit
        }).then((res)=> {
          console.log(res)
          this.notes_list = res.data.noteList.map((item)=>{
            item.created_at = getMyDate(new Date(item.created_at).getTime(), "yyyy-MM-dd hh:mm")
            return item
          })
          this.notes_total = res.data.count
          
        }).catch((err)=>{
          console.log(err)
          this.$Message.error('获取笔记列表失败')
        })
      },
      // 保存笔记
      saveNote() {
        if(!this.save_loading){
          if(!/^.{1,}$/.test(this.fast_note_content)) {
            this.$Message.warning('请先填写笔记内容');
            return false
          }
          this.save_loading = true
          addStuNotes({
            course_id: this.course_id,
            course_time_id: this.course_time_id,
            content: this.fast_note_content
          }).then((res)=> {
            console.log(res)
            this.save_loading = false
            this.fast_note_content = ''
            this.$Message.success('保存成功')
            this.getNotesList()
          }).catch((err)=>{
            console.log(err)
            this.save_loading = false
            this.$Message.error('新增笔记失败')
          })
        }
      },
      // 高级笔记保存
      saveHighNote() {
        if(!this.save_loading){
          if(!this.note_content) {
            this.$Message.warning('请先填写笔记内容');
            return false
          }
          this.save_loading = true
          addStuNotes({
            course_id: this.course_id,
            course_time_id: this.course_time_id,
            content: this.render_note_content
          }).then((res)=> {
            console.log(res)
            this.save_loading = false
            this.note_content = ''
            this.$Message.success('保存成功')
            this.showCreateNote = false
            this.getNotesList()
          }).catch((err)=>{
            console.log(err)
            this.save_loading = false
            this.$Message.error('新增笔记失败')
          })
        }
      },
      renderEditor(val, render) {
        this.render_note_content = render
      },
      // 查看笔记详情
      lookDetail(index) {
        this.note_detail_content = this.notes_list[index].content
        this.showNoteDetail = true
      },
      // 笔记换页
      changeNotePage(page) {
        this.notes_offset = page
        this.getNotesList()
      },
      // 删除笔记
      delNote(id) {
        if(this.is_full_screen){
          deleteNote({
              id
            }).then((res)=> {
              console.log(res)
              this.getNotesList()
              this.$Message.success('删除成功')
            }).catch((err)=>{
              console.log(err)
              this.$Message.error('删除失败')
            })
        }else{
          this.$Modal.confirm({
            title: '提示',
            content: '<p>确定要删除这条笔记吗？</p>',
            loading: true,
            onOk: () => {
              deleteNote({
                id
              }).then((res)=> {
                console.log(res)
                this.getNotesList()
                this.$Modal.remove();
                this.$Message.success('删除成功')
              }).catch((err)=>{
                console.log(err)
                this.$Modal.remove();
                this.$Message.error('删除失败')
              })
            }
          })
        }
      },
      // 编辑器上传图片 绑定@imgAdd event uploadImage
      $imgAdd(pos, $file){
          // 第一步.将图片上传到服务器.
          var formdata = new FormData();
          formdata.append('file', $file);
          uploadImage(formdata).then((res)=> {
            console.log(res);
            // this.file = null;
            // this.loadingStatus = false;
            this.$Message.success('上传成功')
            let url = res.data.urls[0].filePath
            this.$refs.md.$img2Url(pos, url);
          }).catch((err)=>{
            console.log(err)
            // this.file = null;
            // this.loadingStatus = false;
            this.$Message.error('上传失败')
          })
      }
    }
  }

</script>
<style lang="less">
.pdf {
  padding-top: 53px;
  width: 100%;
  position: relative;
  display: flex;
  background-color: #fff;
  .pdf-area {
    flex: 1;
    padding-top: 10px;
    &.full-screen {
      padding-top: 0;
      height: calc(~"100vh - 53px");
      overflow-y: auto;
    }
  }
  .right-area {
    width: 300px;
    margin: 10px;
    padding-right: 6px;
    .notes-card {
      .add-note-btn {
        text-align: right;
        padding: 10px 0;
        Button {
          margin-left: 6px;
        }
      }
    }
    .notes-list {
      list-style-type: none;
      li {
        background-color: #eee;
        border-radius: 6px;
        margin-bottom: 10px;
        padding: 10px 10px 6px 10px;
        text-align: left;
        color: #666;
        .note-tag {
          margin-top: 6px;
          text-align: right;
          font-size: 12px;
          color: #888;
          .more {
            // text-decoration: underline;
            color: #2d8cf0;
            cursor: pointer;
          }
          .delete {
            color: #f32c1e;
            cursor: pointer;
          }
          span {
            margin-left: 6px;
          }
        }
        .render-html {
          width: 223px;
          word-wrap: break-word;
          word-break: normal;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .arrow {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    text-align: center;
    cursor: pointer;
    padding: 10px 0;
    .full-screen-btn {
      position: absolute;
      right: 20px;
      top: 16px;
    }
  }
}
.render-html-detail {
  word-wrap: break-word;
  word-break: normal;
  img {
    max-width: 100%;
  }
}
</style>
