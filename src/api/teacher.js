import fetch from '@/utils/fetch'

export function getTeacherList() {
 return axios.request({
    url: '/get/teacher/list',
    method: 'get'
  })
}

export function haveChoiceStudent(id) {
 return axios.request({
    url: '/have/choice/student',
    method: 'get',
    params:{
      id
    }
  })
}

export function choiceTeacher(uid,sid,phone,workType) {
 return axios.request({
    url: '/choice/teacher',
    method: 'get',
    params:{
      uid,
      sid,
      phone,
      workType
    }
  })
}



   
