import request from '../utils/axios'
// 登录
export function login (data) {
    return request({
      url: '/users/checkLogin',
      method: 'post',
      data
    })
  }