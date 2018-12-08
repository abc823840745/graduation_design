import axios from '@/libs/api.request'

export const getMessage = ({ uid, start}) => {
    const data = {
        uid, start
    }
    return axios.request({
        url: '/get/message',
        data,
        method: 'post'
    })
}

export const getNewMessage = ({ uid}) => {
    const data = {
        uid
    }
    return axios.request({
        url: '/get/new/message',
        data,
        method: 'post'
    })
}


export const addNewNotice = (title, description,time, notice,role) => {
    const data = {
        title, description,time, notice,role
    }
    return axios.request({
        url: '/add/new/message',
        data,
        method: 'post'
    })
}


