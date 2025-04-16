import request from '../utils/axios'

// 登录接口
export function login(data) {
  return request({
    url: '/users/checkLogin',
    method: 'post',
    data
  })
}

// 添加账号
export function addUser(data) {
  return request({
    url: '/users/add',
    method: 'post',
    data
  })
}

// 获取账号列表
export function getUserList(params) {
  return request({
    url: '/users/list',
    method: 'get',
    params
  })
}

// 删除账号
export function deleteUser(id) {
  return request({
    url: '/users/del',
    method: 'get',
    params: { id }
  })
}

// 批量删除账号
export function batchDeleteUsers(ids) {
  return request({
    url: '/users/batchdel',
    method: 'get',
    params: { ids: JSON.stringify(ids) }
  })
}

// 修改账号
export function editUser(data) {
  return request({
    url: '/users/edit',
    method: 'post',
    data
  })
}

// 检查旧密码
export function checkOldPassword(data) {
  return request({
    url: '/users/checkoldpwd',
    method: 'get',
    params: data
  })
}

// 修改密码
export function editPassword(data) {
  return request({
    url: '/users/editpwd',
    method: 'post',
    data
  })
}

// 获取账号信息
export function getAccountInfo(id) {
  return request({
    url: '/users/accountinfo',
    method: 'get',
    params: { id }
  })
}

// 上传头像
export function uploadAvatar(data) {
  return request({
    url: '/users/avatar_upload',
    method: 'post',
    data
  })
}

// 验证token
export function checkToken(token) {
  return request({
    url: '/users/checktoken',
    method: 'get',
    params: { token }
  })
}

// 修改用户头像
export function editAvatar(data) {
  return request({
    url: '/users/avataredit',
    method: 'post',
    data
  })
} 