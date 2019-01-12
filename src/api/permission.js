import axios from '@/libs/api.request'
 //获取权限控制角色
export function getRoles(token) {
    return axios.request({
      url: '/get/permission/list',
      method: 'post',
      data: {
        token
      }
    })
  }
 //添加权限控制角色
  export function addNewRole(form) {
    return axios.request({
      url: '/add/new/role',
      method: 'post',
      data:form
    })
  }
    //更新权限控制角色
  export function updateRole(form) {
    return axios.request({
      url: '/update/role',
      method: 'post',
      data:form
    })
  }
    //删除权限控制角色
  export function deleteRole(id) {
    return axios.request({
      url: '/delete/role',
      method: 'post',
      data:{
        id
      }
    })
  }
  
  //获取权限控制模块
  export function getModules(id) {
    return axios.request({
      url: '/get/modules',
      method: 'post',
      data:{
        id
      }
    })
  }

 //添加权限控制模块
 export function addNewModule(form) {
    return axios.request({
      url: '/add/new/module',
      method: 'post',
      data:form
    })
  }

  //更新权限控制模块
  export function updateModule(form) {
    return axios.request({
      url: '/update/module',
      method: 'post',
      data:form
    })
  }

   //更新权限控制模块
   export function deleteModule(id) {
    return axios.request({
      url: '/delete/module',
      method: 'post',
      data:{
          id
      }
    })
  }
  
  
   //获取权限操作
   export function getHandle(id) {
    return axios.request({
      url: '/get/handle',
      method: 'post',
      data:{
          id
      }
    })
  }
  
   //更新权限操作
   export function updateHandle(form) {
    return axios.request({
      url: '/update/handle',
      method: 'post',
      data:form
    })
  }

    
   //添加权限操作
   export function addNewHandle(form) {
    return axios.request({
      url: '/add/new/handle',
      method: 'post',
      data:form
    })
  }
  
     
   //删除权限操作
   export function deleteHandle(id) {
    return axios.request({
      url: '/delete/handle',
      method: 'post',
      data:{
          id
      }
    })
  }