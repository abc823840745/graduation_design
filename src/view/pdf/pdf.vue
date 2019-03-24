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
          <Input v-model="fast_note_content" type="textarea" :autosize="{maxRows: 3, minRows: 3}" placeholder="快速笔记..." />
          <p class="add-note-btn">
            <Button shape="circle" :disabled="is_full_screen" @click="showCreateNote = true">高级笔记</Button>
            <Button type="primary" shape="circle" @click="saveNote">保存笔记</Button>
          </p>
          <ul class="notes-list" v-if="notes_list.length !=0">
            <li v-for="(item, index) in notes_list" :key="index">
              {{item.content}}
              <p class="note-tag">
                <span class="more">详情</span>
                <span class="time">{{item.created_at}}</span>
              </p>
            </li>
          </ul>
          <div class="noyes-none" v-else>
            您在本课时还没记录过笔记哦~
          </div>
        </div>
      </Card>
    </div>
    <Modal v-model="showCreateNote" draggable scrollable title="新建笔记">
      <mavon-editor style="height: 300px" v-model="note_content" :toolbars="editorOptions"></mavon-editor>
    </Modal>
  </div>
</template>
<script>
  import pdf from 'vue-pdf'
  import { getMyDate } from '@/libs/tools'
  import { mavonEditor } from 'mavon-editor'
  import { setTimeout } from 'timers';
  import { getNotesList, addStuNotes } from '@/api/course'
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
        currentPage: 0,
        pageCount: 0,
        fileType: 'pdf',
        is_full_screen: false,
        fast_note_content: '',
        note_content: '',
        notes_list_height: 0,
        save_height: 0,
        showCreateNote: false,
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
        note_total: 0
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
          this.note_total = res.data.count
          
        }).catch((err)=>{
          console.log(err)
          this.$Message.error('获取笔记列表失败')
        })
      },
      // 新增笔记
      addStuNotes() {
        addStuNotes({
          course_id: this.course_id,
          course_time_id: this.course_time_id,
          content: this.fast_note_content
        }).then((res)=> {
          console.log(res)
          this.getNotesList()
        }).catch((err)=>{
          console.log(err)
          this.$Message.error('新增笔记失败')
        })
      },
      // 保存笔记
      saveNote() {
        this.addStuNotes()
      }
    }
  }

</script>
<style lang="less" scoped>
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
          span {
            margin-left: 6px;
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
</style>
