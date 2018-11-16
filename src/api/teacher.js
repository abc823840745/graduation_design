import axios from '@/libs/api.request'


export const getTeacherList = (token,page,size) => {
 return axios.request({
    url: '/get/teacher/list',
    method: 'post',
    data:{
      token,page,size
    }
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

export const choiceTeacher = (token, tid, menber_id, phone, qq, workType, menber_phone, menber_qq, menber_woker,team, file) => {
 return axios.request({
    url: '/choice/teacher',
    method: 'post',
    data:{
      token, tid, menber_id, phone, qq, workType, menber_phone, menber_qq, menber_woker,team, file
    }
  })
}

export const getMenber = (name) => {
 return axios.request({
    url: '/get/menber',
    method: 'post',
    data:{
      name
    }
  })
}



   
