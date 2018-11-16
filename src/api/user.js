import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    username: userName,
    password
  }
  return axios.request({
    url: '/sise/login',
    data,
    method: 'post'
  })
}

export const refreshCourse = (username, password) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: '/refresh/course',
    data,
    method: 'post'
  })
}


export const unlock = ({ token, username, password }) => {
  const data = {
    token,
    username,
    password
  }
  return axios.request({
    url: '/view/unlock',
    data,
    method: 'post'
  })
}


export const getUserInfo = (token,role) => {
   const data =  {
      token,
      role
    }
  return axios.request({
    url: '/user/info',
    data,
    method: 'post'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/user/logout',
    params: {
      token
    },
    method: 'get'
  })
}


export const getContentList = (time) => {
  return axios.request({
    url: '/get/index/content',
    params: {
      time
    },
    method: 'get'
  })
}

export const getTeamList = (id) => {
  return axios.request({
    url: '/get/team/list',
    params: {
      id
    },
    method: 'get'
  })
}

export const getContentDetail = (id) => {
  return axios.request({
    url: '/get/content/detail',
    params: {
      id
    },
    method: 'get'
  })
}


export const updateWork = (sid, url, type, team_id, text, name) => {
  return axios.request({
    url: '/update/work',
    method: 'get',
    params: {
      sid,
      url,
      type,
      team_id,
      text,
      name
    }
  })
}




