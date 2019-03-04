import axios from '@/libs/api.request'

// 教师部分
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
