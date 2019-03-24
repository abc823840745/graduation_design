import axios from '@/libs/api.request'

/**
 * 公共接口
 */

// 查看课程详情
export function getCourseDetail (obj) {
  return axios.request({
    params: {
      id: obj['id']
    },
    url: '/get/course/detail',
    method: 'get'
  })
}

// 查询课时详情
export function getCourseClassDetail (obj) {
  return axios.request({
    params: {
      id: obj['id']
    },
    url: '/get/course/time/detail',
    method: 'get'
  })
}

// 查看课时列表
export function getCourseClassList (obj) {
  return axios.request({
    params: {
      course_id: obj['course_id'],
      limit: obj['limit'] || 10,
      offset: obj['offset'] || 1
    },
    url: '/get/course/time/list',
    method: 'get'
  })
}

// 课程答疑列表
export function getCourseQusetionsList (obj) {
  return axios.request({
    params: {
      course_id: obj['course_id'],
      limit: obj['limit'] || 10,
      offset: obj['offset'] || 1
    },
    url: '/get/current/course/question/list',
    method: 'get'
  })
}

// 获取答疑列表
export function getQusetionsList (obj) {
  return axios.request({
    params: {
      year: obj['year'],
      semester: obj['semester'],
      course_name: obj['course_name'] || null,
      limit: obj['limit'] || 10,
      offset: obj['offset'] || 1
    },
    url: '/get/course/question/list',
    method: 'get'
  })
}

// 获取课时附件列表
export function getCourseClassFileList (obj) {
  return axios.request({
    params: {
      course_time_id: obj['course_time_id'],
      limit: obj['limit'] || 10,
      offset: obj['offset'] || 1
    },
    url: '/get/course/time/file/list',
    method: 'get'
  })
}

/**
 * 学生部分
 */

//  获取课程列表
export function getStuCourseList (obj) {
  return axios.request({
    data: {
      year: obj['year'],
      semester: obj['semester'],
      limit: obj['limit'] || 10,
      offset: obj['offset'] || 1,
      number: obj['number'] || null,
      password: obj['password'] || null
    },
    url: '/get/student/course/list',
    method: 'post'
  })
}

// 学生提问
export function askQuestionByStudent (obj) {
  return axios.request({
    data: {
      title: obj['title'],
      content: obj['content'],
      course_id: obj['course_id']
    },
    url: '/add/course/question',
    method: 'post'
  })
}

// 查看笔记
export function getNotesList (obj) {
  return axios.request({
    params: {
      course_id: obj['course_id'],
      course_time_id: obj['course_time_id'],
      limit: obj['limit'] || 10,
      offset: obj['offset'] || 1
    },
    url: '/get/course/note/list',
    method: 'get'
  })
}

// 新增笔记
export function addStuNotes (obj) {
  return axios.request({
    data: {
      course_id: obj['course_id'],
      course_time_id: obj['course_time_id'],
      content: obj['content']
    },
    url: '/add/course/note',
    method: 'post'
  })
}

// 删除笔记
export function deleteNote (obj) {
  return axios.request({
    data: {
      id: obj['id']
    },
    url: '/delete/course/note',
    method: 'post'
  })
}

/**
 * 教师部分
 */

// 查看课程列表
export function getTeaCourseList (obj) {
  return axios.request({
    params: {
      year: obj['year'],
      semester: obj['semester'],
      limit: obj['limit'] || 10,
      offset: obj['offset'] || 1
    },
    url: '/get/course/list',
    method: 'get'
  })
}

// 创建课程
export function createTeaCourse (obj) {
  return axios.request({
    data: {
      name: obj['name'],
      code: obj['code'],
      classes: obj['classes'],
      year: obj['year'],
      semester: obj['semester'] || 1
    },
    url: '/add/course',
    method: 'post'
  })
}

// 删除课程
export function delTeaCourse (obj) {
  return axios.request({
    data: {
      id: obj['id']
    },
    url: '/delete/course',
    method: 'post'
  })
}

// 获取课程学生名单
export function getTeaCourseStudentList (obj) {
  return axios.request({
    params: {
      id: obj['id']
    },
    url: '/get/student/list',
    method: 'get'
  })
}

// 创建课时
export function createTeaCourseClass (obj) {
  return axios.request({
    data: {
      name: obj['name'],
      course_id: obj['course_id']
    },
    url: '/create/course/time',
    method: 'post'
  })
}

// 删除课时
export function deleteTeaCourseClass (obj) {
  return axios.request({
    data: {
      id: obj['id']
    },
    url: '/delete/course/time',
    method: 'post'
  })
}

// 上传课程介绍
export function uploadCourseIntro (obj) {
  return axios.request({
    headers: { 'Content-Type': 'multipart/form-data' },
    data: obj,
    url: '/upload/course/desc',
    method: 'post'
  })
}

// 上传课时附件
export function uploadCourseClassFile (obj) {
  return axios.request({
    headers: {'Content-Type': 'multipart/form-data'},
    data: obj,
    url: '/upload/course/time/file',
    method: 'post'
  })
}

// 删除上传附件
export function deleteCourseClassFile (obj) {
  return axios.request({
    data: {
      id: obj['id']
    },
    url: '/delete/course/time/file',
    method: 'post'
  })
}

// 上传课时介绍
export function uploadCourseClassIntro (obj) {
  return axios.request({
    headers: {'Content-Type': 'multipart/form-data'},
    data: obj,
    url: '/uplad/course/time/desc',
    method: 'post'
  })
}

// 修改课时介绍文字
export function editCourseClassIntroText (obj) {
  return axios.request({
    data: {
      id: obj['id'],
      content: obj['content']
    },
    url: '/change/course/time/desc/text',
    method: 'post'
  })
}

// 删除答疑接口
export function deleteCourseQuestion (obj) {
  return axios.request({
    data: {
      id: obj['id']
    },
    url: '/delete/course/question',
    method: 'post'
  })
}
