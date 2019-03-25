<style lang="less">
 .course-notes {
   .none-notes {
    font-size: 16px;
    font-weight: 700;
    color: #888;
    text-align: center;
    padding-top: 40px;
  }
  .new-note-panel {
    margin-top: 20px;
  }
  .notes-list-wrap {
    margin-top: 20px;
    .note-item-inner {
      img {
        max-width: 100%;
      }
    }
  }
  .notes-page-nav {
    text-align: center;
    margin-top: 20px;
  }
 }
</style>
<template>
  <div class="course-notes">
    <div class="top-btn-wrap">
      <span>学年：</span>
      <Select v-model="year" @on-change="changeYear" style="width:140px;margin-right:10px;">
        <Option v-for="(item, index) in year_options" :key="index" :value="item.year" :label="item.label"></Option>
      </Select>
      <span>学期：</span>
      <Select v-model="semester" @on-change="changeSemester" style="width:120px;margin-right:10px;">
        <Option :value="1" label="第一学期"></Option>
        <Option :value="2" label="第二学期"></Option>
      </Select>
      <span>课程：</span>
      <Select v-model="course_id" @on-change="changeCourse()" style="width:160px;margin-right:10px;">
        <Option v-for="(item,index) in course_list" :key="index" :value="item.id" :label="item.name"></Option>
      </Select>
      <Button type="primary" @click="showNotePanel" :disabled="isAllowAddNote">
        {{isShowNotePanel?'收起笔记面板':'我要写笔记'}}
      </Button>
      <template v-if="isShowNotePanel">
        <br /><br />
        <span>保存到课时：</span>
        <Select v-model="course_time_id" style="width:360px;margin-right:10px;">
          <Option v-for="(item,index) in course_time_list" :key="index" :value="item.id" :label="item.name"></Option>
        </Select>
        <Button type="primary" @click="addNote" >保存笔记</Button>
      </template>
    </div>
    <div class="new-note-panel" v-if="isShowNotePanel">
      <mavon-editor style="height: 300px;z-index:99;" ref="md" @imgAdd="$imgAdd" v-model="note_content" :toolbars="editorOptions" @change="renderEditor"></mavon-editor>
    </div>
    <div class="none-notes" v-if="course_list.length == 0">
      您选择的学期暂无课程信息~
    </div>
    <div class="none-notes" v-else-if="notes_list.length == 0">
      您该课程暂无记录笔记~
    </div>
    <div class="notes-list-wrap" v-else>
      <Card style="width:100%;margin-bottom:10px;" v-for="(item, index) in notes_list" :key="index">
        <p slot="title">
            <Icon type="md-time"></Icon>
            {{item.created_at}}
        </p>
        <Button slot="extra" size="small" type="error" shape="circle" ghost icon="md-trash" @click="delNote(item.id)"></Button>
        <div class="note-item-inner" v-html="item.content"></div>
      </Card>
    </div>
    <div class="notes-page-nav" v-if="notes_list.length >= 1">
      <Page :current="notes_offset" :total="notes_total" :page-size="notes_limit" @on-change="changeNotePage" />
    </div>
  </div>
</template>
<script>
import { getMyDate } from '@/libs/tools'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { getTeaCourseList, getStuCourseList, getCourseClassList, getQusetionsList, deleteCourseQuestion, getNotesList, addStuNotes, deleteNote, uploadImage } from '@/api/course'
export default {
  name: 'course-notes',
  data () {
    return {
      total: 0,
      page_size: 10,
      current: 1,
      year: '',
      year_options: [],
      semester: 1,
      course_list: [],
      course_id: '',
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
      // 获取课时列表
      course_time_id: '',
      course_time_list: [],
      // 笔记列表
      notes_list: [],
      notes_offset: 1,
      notes_limit: 10,
      notes_total: 0,
      // 笔记操作
      isShowNotePanel: false,
      isAllowAddNote: true,
      note_content: '',
      render_note_content: ''
    }
  },
  components: {
    mavonEditor
  },
  methods: {
    // 初始化学年列表
    createYearList(){
      let cur_year = new Date().getFullYear()
      const cur_month = new Date().getMonth() + 1
      if(cur_month < 9){
        cur_year-=1
      }
      for(let i=0;i<4;i++){
        this.year_options.push({
          year: cur_year - i,
          label: `${cur_year - i} - ${cur_year - i + 1} 学年`
        })
      }
      this.year = this.year_options[0].year
    },
    changeYear(year){
      console.log(year)
      this.getStuCourseList(()=>{
        
      })
    },
    changeSemester(semester){
      console.log(semester)
      this.getStuCourseList(()=>{
        
      })
    },
    changeCourse(id){
      console.log(id)
    },
    changePage(page){
      console.log('页码改变 '+page)
      
    },
    // 获取课程列表(学生)
    getStuCourseList(cb = () => {}) {
      this.notes_offset = 1
      getStuCourseList({
        year: this.year,
        semester: this.semester,
        offset: 1,
        limit: 100
      }).then((res)=>{
        console.log(res)
        this.course_list = res.data.courseList
        this.course_id = ''
        this.notes_list = []
        this.isShowNotePanel = false
        this.isAllowAddNote = true
        if(this.course_list.length != 0){
          this.course_id = res.data.courseList[0].id
          this.isAllowAddNote = false
          this.getNotesList()
        }
        this.current = 1
        cb()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取课程列表失败');
        cb()
      })
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
    // 删除笔记
    delNote(id) {
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
    },
    // 笔记换页
    changeNotePage(page) {
      this.notes_offset = page
      this.getNotesList()
    },
    renderEditor(val, render) {
      this.render_note_content = render
    },
    // 打开笔记面板
    showNotePanel() {
      this.isShowNotePanel = !this.isShowNotePanel
      this.course_time_list = []
      this.getCourseTimeList()
    },
    // 获取课时列表
    getCourseTimeList() {
      getCourseClassList({
        course_id: this.course_id,
        limit: 1000,
        offset: 1
      }).then((res)=> {
        this.course_time_list = res.data.courseTimeList
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('获取课时列表失败')
      })
    },
    // 添加笔记
    addNote() {
      if(!this.course_time_id){
        this.$Message.warning('请选择笔记需要保存的课时')
        return ;
      }
      addStuNotes({
        course_id: this.course_id,
        course_time_id: this.course_time_id,
        content: this.render_note_content
      }).then((res)=> {
        console.log(res)
        this.note_content = ''
        this.$Message.success('保存成功')
        this.getNotesList()
      }).catch((err)=>{
        console.log(err)
        this.$Message.error('新增笔记失败')
      })
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
  },
  created () {
    // 初始化学年列表
    this.createYearList()
    this.getStuCourseList(()=>{
      
    })
  },
  mounted () {

  }
}
</script>
