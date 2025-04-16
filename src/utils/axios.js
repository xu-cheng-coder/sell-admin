import axios from 'axios'
import serviceUrl from './component';
// 创建 axios 实例
const service = axios.create({
  baseURL: serviceUrl, // 服务器地址
  timeout: 5000 // 请求超时时间
})

// 添加请求拦截器 ---接口发送给后端的一瞬间的处理
service.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么  --加token 
  // 每次请求接口 都会先加上token 到 请求头中 再进行发送请求
  if(localStorage.getItem('token')){
    let token = localStorage.getItem('token')    
    config.headers.Authorization = 'Bearer '+ token;
  }

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// // 添加响应拦截器-拿到后端的返回数据-可以将数据处理后再返回页面
// request.interceptors.response.use(function (response) {
//   // 2xx 范围内的状态码都会触发该函数。
//   // 对响应数据做点什么
//   return response.data;
// }, function (error) {
//   // 超出 2xx 范围的状态码都会触发该函数。
//   // 对响应错误做点什么
//   return Promise.reject(error);
// });

// 导出 axios 实例
export default service 

