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
      method: obj['method'],
      number: obj['number'],
      password: obj['password']
    },
    url: '/get/student/course/list',
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
    headers: {'Content-Type': 'multipart/form-data'},
    data: obj,
    url: '/upload/work',
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
