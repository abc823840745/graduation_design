import axios from '@/libs/api.request';

export function getClassHomework(obj) {
  return axios.request({
    data: {
      course: obj['course'],
      semester: obj['semester'],
      week: obj['week'],
      page: obj['page'] || 1,
    },
    url: '/read/teacher/outexper',
    method: 'post',
  });
}

export function addClassHomework(obj) {
  return axios.request({
    data: {
      name: obj['name'],
      path: obj['path'],
      semester: obj['semester'],
      week: obj['week'],
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

export function updateClassHomework(obj) {
  return axios.request({
    data: {
      id: obj['id'],
      name: obj['name'],
      week: obj['week'],
      startime: obj['startime'],
      fintime: obj['fintime'],
      path: obj['path'],
    },
    url: '/update/teacher/outexper',
    method: 'post',
  });
}

export function delClassHomework(id) {
  return axios.request({
    data: {
      id,
    },
    url: '/delete/teacher/outexper',
    method: 'post',
  });
}
