import axios from '@/libs/api.request';

// 教师部分
// 查看课时作业
export function getTeaClassHW(obj) {
  return axios.request({
    data: {
      course: obj['course'],
      teacher: obj['teacher'],
      semester: obj['semester'],
      week: obj['classHour'],
      limit: obj['limit'] || 10,
      page: obj['page'] || 1,
    },
    url: '/read/teacher/outexper',
    method: 'post',
  });
}

// 教师查看问题
export function getTeaSubject(id) {
  return axios.request({
    data: {
      exper_id: id,
    },
    url: '/read/teacher/questions',
    method: 'post',
  });
}

// 查看作业以及问题
export function getTeaOnlineHW(obj) {
  return axios.request({
    data: {
      course: obj['course'],
      teacher: obj['teacher'],
      semester: obj['semester'],
      week: obj['classHour'] || undefined,
      limit: obj['limit'] || 10,
      page: obj['page'] || 1,
    },
    url: '/read/teacher/inexper',
    method: 'post',
  });
}

// 获取学生课时作业列表(用于评分)
export function getStuHWList(obj) {
  return axios.request({
    data: {
      exper_id: obj['exper_id'],
      course: obj['course'],
      semester: obj['semester'],
      teacher: obj['teacher'],
      stuclass: obj['stuclass'],
      week: obj['classHour'],
      limit: obj['limit'] || 10,
      page: obj['page'] || 1,
    },
    url: '/getstulist/teacher/outexper',
    method: 'post',
  });
}

// 获取学生在线作业列表(用于评分)
export function getStuOnlineHWList(obj) {
  return axios.request({
    data: {
      exper_id: obj['exper_id'],
      course: obj['course'],
      semester: obj['semester'],
      teacher: obj['teacher'],
      stuclass: obj['stuclass'],
      week: obj['classHour'],
      limit: obj['limit'] || 10,
      page: obj['page'] || 1,
    },
    url: '/getstulist/teacher/inexper',
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
      teach_id: obj['teach_id'],
      fintime: obj['fintime'],
      startime: obj['startime'],
    },
    url: '/add/teacher/outexper',
    method: 'post',
  });
}

// 新建在线作业
export function addTeaOnlineHW(obj) {
  return axios.request({
    data: {
      name: obj['name'],
      course: obj['course'],
      teacher: obj['teacher'],
      teach_id: obj['teach_id'],
      semester: obj['semester'],
      week: obj['classHour'],
      totaltime: obj['totaltime'],
      fintime: obj['fintime'],
      startime: obj['startime'],
    },
    url: '/add/teacher/inexper',
    method: 'post',
  });
}

// 新增在线作业问题
export function addTeaOnlineSubject(obj) {
  return axios.request({
    data: {
      root_id: obj['root_id'],
      root_name: obj['root_name'],
      questions: obj['questions'],
      teach_id: obj['teach_id'],
    },
    url: '/add/teacher/question',
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

// 更新在线作业
export function updateTeaOnlineHW(obj) {
  return axios.request({
    data: {
      id: obj['id'],
      name: obj['name'],
      week: obj['classHour'],
      startime: obj['startime'],
      fintime: obj['fintime'],
      totaltime: obj['totaltime'],
    },
    url: '/update/teacher/inexper',
    method: 'post',
  });
}

// 更新在线作业问题
export function updateTeaOnlineSubject(questions) {
  return axios.request({
    data: {
      questions,
    },
    url: '/update/teacher/question',
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

// 删除在线作业
export function delTeaOnlineHW(id) {
  return axios.request({
    data: {
      id,
    },
    url: '/delete/teacher/inexper',
    method: 'post',
  });
}

// 删除在线作业问题
export function delTeaOnlineSubject(id) {
  return axios.request({
    data: {
      id,
    },
    url: '/delete/teacher/question',
    method: 'post',
  });
}

// 重新上传课件
export function teaUploadAgain(obj) {
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

// 课时作业评分
export function teaScoreHW(obj) {
  return axios.request({
    data: {
      id: obj['id'],
      grade: obj['grade'],
    },
    url: '/registerScore/teacher/outexper',
    method: 'post',
  });
}

// 获取学生作业列表
export function getStuHW(obj) {
  return axios.request({
    data: {
      course: obj['course'],
      teacher: obj['teacher'],
      semester: obj['semester'],
      week: obj['classHour'] || undefined,
      limit: obj['limit'] || 10,
      page: obj['page'] || 1,
    },
    url: '/getstulist/teacher/exper',
    method: 'post',
  });
}

// 在线作业-教师-作业评分
export function scoreOnlineHW(obj) {
  return axios.request({
    data: {
      id: obj['id'],
      grade: obj['grade'],
      obj: obj['obj'],
    },
    url: '/registerScore/teacher/inexper',
    method: 'post',
  });
}

// 在线作业-老师-问题操作（增删改一体）
export function changeSubject(obj) {
  return axios.request({
    data: {
      id: obj['id'],
      arr: obj['arr'],
    },
    url: 'operation/teacher/question',
    method: 'post',
  });
}

// 教师搜索学生作业
export function searchStuHW(obj) {
  return axios.request({
    data: {
      condition: obj['condition'],
      teacher: obj['teacher'],
      teach_id: obj['teach_id'],
      semester: obj['semester'],
      limit: obj['limit'] || 10,
      page: obj['page'] || 1,
    },
    url: '/search/teacher/stuexper',
    method: 'post',
  });
}

// 教师搜索自己发布的作业
export function searchMyHW(obj) {
  return axios.request({
    data: {
      condition: obj['condition'],
      teacher: obj['teacher'],
      teach_id: obj['teach_id'],
      semester: obj['semester'],
      limit: obj['limit'] || 10,
      page: obj['page'] || 1,
    },
    url: '/search/teacher/exper',
    method: 'post',
  });
}

// 教师首页
export function getTeaMainInfo(obj) {
  return axios.request({
    data: {
      teach_id: obj['teach_id'],
      semester: obj['semester'],
      obj: obj['obj'],
    },
    url: '/get/teacher/index',
    method: 'post',
  });
}

/**
 * 学生部分
 */

// 学生首页
export function getStuMainInfo(obj) {
  return axios.request({
    data: {
      stu_id: obj['stu_id'],
      semester: obj['semester'],
      obj: obj['obj'],
    },
    url: '/get/student/index',
    method: 'post',
  });
}

// 查看课时作业
export function getStuClassHW(obj) {
  return axios.request({
    data: {
      obj: obj['obj'],
      student: obj['student'],
      stu_id: obj['stuId'],
      semester: obj['semester'],
      week: obj['classHour'] || undefined,
      limit: obj['limit'] || 10,
      page: obj['page'] || 1,
    },
    url: '/read/student/outexper',
    method: 'post',
  });
}

// 查看在线作业
export function getStuOnlineHW(obj) {
  return axios.request({
    data: {
      obj: obj['obj'],
      student: obj['student'],
      stu_id: obj['stuId'],
      semester: obj['semester'],
      week: obj['classHour'] || undefined,
      limit: obj['limit'] || 10,
      page: obj['page'] || 1,
    },
    url: '/read/student/inexper',
    method: 'post',
  });
}

// 查看在线作业详细问题
export function getStuOnlineSubject(id) {
  return axios.request({
    data: {
      exper_id: id,
    },
    url: '/read/student/question',
    method: 'post',
  });
}

// 查看评分后的作业问题
export function getStuScoreSubject(obj) {
  return axios.request({
    data: {
      id: obj['id'],
      exper_id: obj['exper_id'],
    },
    url: '/read/student/scored_question',
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

// 提交课时作业
export function stuSubmitClassHW(obj) {
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

// 提交在线作业
export function stuSubmitOnlineHW(obj) {
  return axios.request({
    data: {
      id: obj['id'],
      submit_time: obj['submit_time'],
      surplus_time: obj['surplus_time'],
      questions: obj['questions'],
      root_id: obj['root_id'],
      quest_id: obj['quest_id'],
      answer: obj['answer'],
      status: obj['status'],
    },
    url: '/submit/student/inexper',
    method: 'post',
  });
}

// 获取教师发布的作业列表
export function getTeaHW(obj) {
  return axios.request({
    data: {
      course: obj['course'],
      teacher: obj['teacher'],
      semester: obj['semester'],
      week: obj['classHour'] || undefined,
      limit: obj['limit'] || 10,
      page: obj['page'] || 1,
    },
    url: '/getlist/teacher/exper',
    method: 'post',
  });
}

// 学生获取自己的作业列表
export function getStuMyHWlist(obj) {
  return axios.request({
    data: {
      semester: obj['semester'],
      obj: obj['obj'],
      student: obj['student'],
      stu_id: obj['stuId'],
      week: obj['classHour'] || undefined,
      page: obj['page'] || 1,
      limit: obj['limit'] || 10,
    },
    url: '/getlist/student/exper',
    method: 'post',
  });
}

// 学生搜索自己的作业
export function searchMyHWlist(obj) {
  return axios.request({
    data: {
      condition: obj['condition'],
      stu_id: obj['stuId'],
      student: obj['student'],
      semester: obj['semester'],
      page: obj['page'] || 1,
      limit: obj['limit'] || 10,
    },
    url: '/search/student/exper',
    method: 'post',
  });
}
