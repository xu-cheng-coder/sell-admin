import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://8.137.157.16:9002', // 服务器地址
  timeout: 5000 // 请求超时时间
})

// 登录接口
export function login(data) {
  return service({
    url: '/users/checkLogin',
    method: 'post',
    data
  })
}

// 导出 axios 实例
export default service 

