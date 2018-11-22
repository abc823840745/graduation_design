import axios from '@/libs/api.request'


export function getMovieList(type, offset, keyword) {
  return axios.request({
    url: '/get/movie',
    method: 'get',
    params: {
      type,
      offset,
      keyword
    }
  })
}






export function addPraise(uid, id) {
  return axios.request({
    url: '/add/movie/praise',
    method: 'get',
    params: {
      uid,
      id
    }
  })
}


export function addComment(mid, uid, name, avatar, content, rateTime, parent_id, to_user_name, to_user_id) {

  return axios.request({
    url: '/add/movie/comment',
    method: 'post',
    data: {
      mid, uid, name, avatar, content, rateTime, parent_id, to_user_name, to_user_id
    }
  })
}

export function delMovie(id) {
  return axios.request({
    url: '/delete/movie',
    method: 'post',
    data: {
      id
    }
  })
}


export function getMovieCommentList(id) {
  return axios.request({
    url: '/get/movie/comment',
    method: 'get',
    params: {
      id
    }
  })
}

export function updateMovie(form) {
  return axios.request({
    url: '/update/movie',
    method: 'post',
    data: {
      form
    }
  })
}




