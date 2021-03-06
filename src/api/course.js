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

// 上传图片接口
export function uploadImage (obj) {
  return axios.request({
    headers: {'Content-Type': 'multipart/form-data'},
    data: obj,
    url: '/upload/image/of/public',
    method: 'post'
  })
}

// 获取答疑详情
export function getQuestionDetail (obj) {
  return axios.request({
    params: {
      id: obj['id']
    },
    url: '/get/course/question/detail',
    method: 'get'
  })
}

// 答疑回答
export function askQuestionReply (obj) {
  return axios.request({
    data: {
      question_id: obj['question_id'],
      content: obj['content']
    },
    url: '/add/course/question/reply',
    method: 'post'
  })
}

// 当前课程未审核列表
export function queryAuditByCourse (obj) {
  return axios.request({
    params: {
      course_id: obj['course_id'],
      limit: obj['limit'] || 10,
      offset: obj['offset'] || 1
    },
    url: '/get/current/course/question/list/no/audit',
    method: 'get'
  })
}

// 设置答疑状态
export function setQuestionAudit (obj) {
  return axios.request({
    data: {
      question_id: obj['question_id'],
      audit_status: obj['audit_status']
    },
    url: '/audit/course/question',
    method: 'post'
  })
}

// 答疑评论
export function addCommentQuestion (obj) {
  return axios.request({
    data: {
      content: obj['content'],
      reply_id: obj['reply_id'],
      question_id: obj['question_id'],
      from_user_name: obj['from_user_name'],
      to_user_name: obj['to_user_name'],
      to_user_role: obj['to_user_role']
    },
    url: '/add/course/question/reply/comment',
    method: 'post'
  })
}

// 删除回答（教师）
export function delReplyQuestion (obj) {
  return axios.request({
    data: {
      id: obj['id']
    },
    url: '/delete/course/question/reply',
    method: 'post'
  })
}

// 删除评论（自己和教师）
export function delCommentQuestion (obj) {
  return axios.request({
    data: {
      id: obj['id']
    },
    url: '/delete/course/question/comment',
    method: 'post'
  })
}

// 回答状态设置（自己和教师）
export function changeReplyStatus (obj) {
  return axios.request({
    data: {
      id: obj['id'],
      status: obj['status']
    },
    url: '/change/course/question/reply/status',
    method: 'post'
  })
}

// 获取回答过的答疑列表
export function getReplyQusetionList (obj) {
  return axios.request({
    params: {
      year: obj['year'],
      semester: obj['semester'],
      limit: obj['limit'] || 10,
      offset: obj['offset'] || 1
    },
    url: '/get/has/replied/question/list',
    method: 'get'
  })
}

// 获取评论过的答疑列表
export function getCommentQusetionList (obj) {
  return axios.request({
    params: {
      year: obj['year'],
      semester: obj['semester'],
      limit: obj['limit'] || 10,
      offset: obj['offset'] || 1
    },
    url: '/get/has/commented/question/list',
    method: 'get'
  })
}

// 是否有新的通知
export function getNewNotify (obj) {
  return axios.request({
    params: {},
    url: '/has/new/course/question/notify',
    method: 'get'
  })
}

// 已读消息
export function getAlreadyReadNotify (obj) {
  return axios.request({
    data: {},
    url: '/set/course/question/notify',
    method: 'post'
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

// 获取自己的提问
export function getMyAskQuestion (obj) {
  return axios.request({
    params: {
      year: obj['year'],
      semester: obj['semester'],
      limit: obj['limit'] || 10,
      offset: obj['offset'] || 1
    },
    url: '/get/my/course/question/list',
    method: 'get'
  })
}

// 答疑问题未审核返修
export function editMyAskQuestion (obj) {
  return axios.request({
    data: {
      question_id: obj['question_id'],
      title: obj['title'],
      content: obj['content']
    },
    url: '/update/audit/fail/course/question',
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
    headers: { 'Content-Type': 'multipart/form-data' },
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
    headers: { 'Content-Type': 'multipart/form-data' },
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

// 设置答疑状态
export function changeQuestionStatus (obj) {
  return axios.request({
    data: {
      id: obj['id'],
      status: obj['status']
    },
    url: '/change/course/question/status',
    method: 'post'
  })
}
