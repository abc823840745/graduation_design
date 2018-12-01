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
    method: 'post',
    data: {
      tid: id
    }
  })
}

export const choiceTeacher = (token, tid, menber_id, year, phone, qq, workType, menber_phone, menber_qq, menber_woker, menber_ps, team, file) => {
  return axios.request({
    url: '/choice/teacher',
    method: 'post',
    data: {
      token, tid, menber_id, year, phone, qq, workType, menber_phone, menber_qq, menber_woker, menber_ps, team, file
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

export const updatePs = (code,password,newps) => {
  return axios.request({
    url: '/update/teacher/ps',
    method: 'post',
    data: {
     code,password,newps
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

export const getMyGraduationList = (u_id, page, size) => {
  return axios.request({
    url: '/get/my/graduation',
    method: 'post',
    data: {
      u_id, page, size
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




export const addGraduationWork = (uid, major, tid, username, title, description, time) => {
  return axios.request({
    url: '/add/graduation/work',
    method: 'post',
    data: {
      uid, major, tid, username, title, description, time
    }
  })
}


export const getStart = (type, year, token) => {
  return axios.request({
    url: '/get/mission/start',
    method: 'post',
    data: {
      type, year, token
    }
  })
}


export const submitWeekReport = (token, time, week, status, content, save, more_time, type) => {
  return axios.request({
    url: '/submit/week/report',
    method: 'post',
    data: {
      token, time, week, status, content, save, more_time, type
    }
  })
}

export const getOldReport = (token) => {
  return axios.request({
    url: '/get/old/report',
    method: 'post',
    data: {
      token
    }
  })
}

export const getMyMission = (token, page, size) => {
  return axios.request({
    url: '/get/my/mission',
    method: 'post',
    data: {
      token, page, size
    }
  })
}

export const completeMission = (id, token, file) => {
  return axios.request({
    url: '/complete/my/mission',
    method: 'post',
    data: {
      id, token, file
    }
  })
}

export const submitPapper = (tid, uid, time, file) => {
  return axios.request({
    url: '/submit/my/papper',
    method: 'post',
    data: {
      tid, uid, time, file
    }
  })
}

export const getOldPapper = (uid, size, page, year) => {
  return axios.request({
    url: '/get/my/papper',
    method: 'post',
    data: {
      uid, size, page, year
    }
  })
}

export const getStudentList = (tid, year) => {
  return axios.request({
    url: '/get/student/list',
    method: 'post',
    data: {
      tid, year
    }
  })
}

export const updateScore = (uid, type, week, score) => {
  return axios.request({
    url: '/update/report/score',
    method: 'post',
    data: {
      uid, type, week, score
    }
  })
}


export const getStudentCourse = (uid) => {
  return axios.request({
    url: '/get/student/course',
    method: 'post',
    data: {
      uid
    }
  })
}

export const confirmStudentCourse = (id, uid) => {
  return axios.request({
    url: '/confirm/student/course',
    method: 'post',
    data: {
      id, uid
    }
  })
}

export const getStudentMission = ((token, tid, page, size) => {
  return axios.request({
    url: '/get/student/mission',
    method: 'post',
    data: {
      token, tid, page, size
    }
  })
})


export const updatePapper = ((papper_id, content, status, time) => {
  return axios.request({
    url: '/update/student/papper',
    method: 'post',
    data: {
      papper_id, content, status, time
    }
  })
})


export const addMyGraduation = ((tid, classType, majorType, title, description, time) => {
  return axios.request({
    url: '/add/my/graduation',
    method: 'post',
    data: {
      tid, classType, majorType, title, description, time
    }
  })
})

export const getTeacherMission = ((token, page, size) => {
  return axios.request({
    url: '/get/teacher/mission',
    method: 'post',
    data: {
      token, page, size
    }
  })
})

export const addNewMission = ((title, description, upload, download, token, file, time, deadline, name) => {
  return axios.request({
    url: '/add/new/mission',
    method: 'post',
    data: {
      title, description, upload, download, token, file, time, deadline, name
    }
  })
})


export const confirmMission = ((id, uid, pass) => {
  return axios.request({
    url: '/confirm/teacher/mission',
    method: 'post',
    data: {
      id, uid, pass
    }
  })
})



export const getAllTeacher = ((page, size) => {
  return axios.request({
    url: '/get/all/teacher',
    method: 'post',
    data: {
      page, size
    }
  })
})


export const updateCourseStatus = ((cid, status) => {
  return axios.request({
    url: '/update/course/status',
    method: 'post',
    data: {
      cid, status
    }
  })
})

export const haveTeacherStudent = ((id, page, size) => {
  return axios.request({
    url: '/get/teacher/student',
    method: 'post',
    data: {
      id, page, size
    }
  })
})


export const updateTeacherStudent = ((id, uid,tid,teacher_name) => {
  return axios.request({
    url: '/update/teacher/student',
    method: 'post',
    data: {
      id, uid,tid,teacher_name
    }
  })
})


export const getSetTime = ((time) => {
  return axios.request({
    url: '/get/time',
    method: 'post',
    data: {
      time
    }
  })
})

export const updateTime = ((time, deadline, type, post_time) => {
  return axios.request({
    url: '/update/time',
    method: 'post',
    data: {
      time, deadline, type, post_time
    }
  })
})

export const addNewTeacher = ((teacher) => {
  return axios.request({
    url: '/add/new/teacher',
    method: 'post',
    data: {
      teacher
    }
  })
})
