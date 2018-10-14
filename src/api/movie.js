import fetch from '@/utils/fetch'



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

export function deleteSport(id) {
  return axios.request({
    url: '/delete/sport',
    method: 'get',
    params: {
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



export function getSportById(id) {

  return axios.request({
    url: '/get/sport/by',
    method: 'get',
    params: {
      id
    }
  })
}

export function addSportTag(sport_id, tag) {

  return axios.request({
    url: '/add/sport/tag',
    method: 'get',
    params: {
      sport_id,
      tag
    }
  })
}


export function delSportTag(id) {

  return axios.request({
    url: '/delete/sport/tag',
    method: 'get',
    params: {
      id
    }
  })
}

export function addSport(content, addressInfo) {

  return axios.request({
    url: '/add/sport',
    method: 'post',
    data: {
      content,
      addressInfo
    }
  })
}


export function getSportJoiner(id) {

  return axios.request({
    url: '/get/sport/joiner',
    method: 'get',
    params: {
      id
    }
  })
}






