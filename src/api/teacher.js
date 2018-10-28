import axios from '@/libs/api.request'


export const getTeacherList = (access) => {
 return axios.request({
    url: '/get/teacher/list',
    method: 'get'
  })
}


export const haveChoiceStudent = (id) => {
 return axios.request({
    url: '/have/choice/student',
    method: 'get',
    params:{
      id
    }
  })
}

export const choiceTeacher = (uid,sid,phone,workType) => {
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



   
