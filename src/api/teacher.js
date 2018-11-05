import axios from '@/libs/api.request'


export const getTeacherList = (token) => {
 return axios.request({
    url: '/get/teacher/list',
    method: 'post',
    data:{
      token
    }
  })
}


export const haveChoiceStudent = (token) => {
 return axios.request({
    url: '/have/choice/student',
    method: 'get',
    params:{
      uid:token
    }
  })
}

export const choiceTeacher = (token,sid,phone,workType) => {
 return axios.request({
    url: '/choice/teacher',
    method: 'post',
    data:{
      token,
      sid,
      phone,
      workType
    }
  })
}



   
