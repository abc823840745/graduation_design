import axios from '@/libs/api.request'


export const getTeacherList = (token, page, size) => {
  return axios.request({
    url: '/get/teacher/list',
    method: 'post',
    data: {
      token, page, size
    }
  })
}


export const haveChoiceStudent = (id) => {
  return axios.request({
    url: '/have/choice/student',
    method: 'get',
    params: {
      id
    }
  })
}

export const choiceTeacher = (token, tid, menber_id, phone, qq, workType, menber_phone, menber_qq, menber_woker, menber_ps, team, file) => {
  return axios.request({
    url: '/choice/teacher',
    method: 'post',
    data: {
      token, tid, menber_id, phone, qq, workType, menber_phone, menber_qq, menber_woker, menber_ps, team, file
    }
  })
}

export const getMenber = (name) => {
  return axios.request({
    url: '/get/menber',
    method: 'post',
    data: {
      name
    }
  })
}


export const getGraduationList = (u_id, name, page, size) => {
  return axios.request({
    url: '/get/graduation/work',
    method: 'post',
    data: {
      u_id, name, page, size
    }
  })
}

export const choiceGraduationWork = (u_id, cid) => {
  return axios.request({
    url: '/choice/graduation/work',
    method: 'post',
    data: {
      u_id, cid
    }
  })
}




export const addGraduationWork = (uid,major, tid,username, title, description,time) => {
  return axios.request({
    url: '/add/graduation/work',
    method: 'post',
    data: {
     uid, major, tid,username, title, description,time
    }
  })
}



