import axios from '@/libs/api.request';

// 教师部分
// 查看课时作业
export function getTeaClassHW(obj) {
  return axios.request({
    data: {
      course: obj['course'],
      teacher: obj['teacher'],
      semester: obj['semester'],
      week: obj['week'],
      limit: obj['limit'] || 10,
      page: obj['page'] || 1,
    },
    url: '/read/teacher/outexper',
    method: 'post',
  });
}

// 新建课时作业
export function addTeaClassHW(obj) {
  return axios.request({
    data: {
      name: obj['name'],
      localname: obj['localname'],
      localpath: obj['localpath'],
      webpath: obj['webpath'],
      semester: obj['semester'],
      week: obj['classHour'],
      course: obj['course'],
      course_id: obj['course_id'],
      teacher: obj['teacher'],
      fintime: obj['fintime'],
      startime: obj['startime'],
    },
    url: '/add/teacher/outexper',
    method: 'post',
  });
}

// 更新课时作业
export function updateTeaClassHW(obj) {
  return axios.request({
    data: {
      id: obj['id'],
      name: obj['name'],
      week: obj['classHour'],
      startime: obj['startime'],
      fintime: obj['fintime'],
    },
    url: '/update/teacher/outexper',
    method: 'post',
  });
}

// 删除课时作业
export function delTeaClassHW(id) {
  return axios.request({
    data: {
      id,
    },
    url: '/delete/teacher/outexper',
    method: 'post',
  });
}

// 重新上传课件
export function teaUploadAgain() {
  return axios.request({
    data: {
      id: obj['id'],
      localpath: obj['localpath'],
      webpath: obj['webpath'],
      localname: obj['localname'],
    },
    url: '/reupload/teacher/exper',
    method: 'post',
  });
}

// 学生部分
// 查看课时作业
export function getStuClassHW(obj) {
  return axios.request({
    data: {
      obj: obj['obj'],
      student: obj['student'],
      semester: obj['semester'],
      week: obj['classHour'] || undefined,
      limit: obj['limit'] || 10,
      page: obj['page'] || 1,
    },
    url: '/read/student/outexper',
    method: 'post',
  });
}

// 重新上传作业
export function stuUploadAgain(obj) {
  return axios.request({
    data: {
      id: obj['id'],
      name: obj['name'],
      localpath: obj['localpath'],
      webpath: obj['webpath'],
      localname: obj['localname'],
      submit_time: obj['submit_time'],
    },
    url: '/resubmit/student/exper',
    method: 'post',
  });
}

// 提交作业
export function stuSubmitHW(obj) {
  return axios.request({
    data: {
      id: obj['id'],
      name: obj['name'],
      localpath: obj['localpath'],
      localname: obj['localname'],
      webpath: obj['webpath'],
      submit_time: obj['submit_time'],
    },
    url: '/submit/student/outexper',
    method: 'post',
  });
}
