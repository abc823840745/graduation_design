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

export const getUserInfo = (token) => {
  return axios.request({
    url: '/user/info',
    params: {
      token
    },
    method: 'get'
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


