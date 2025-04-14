import request from './axios'

// 获取订单列表
export function getOrderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params
  })
}

// 获取订单详情
export function getOrderDetail(id) {
  return request({
    url: '/order/detail',
    method: 'get',
    params: { id }
  })
}

// 修改订单
export function editOrder(data) {
  return request({
    url: '/order/edit',
    method: 'post',
    data
  })
}

// 获取首页报表数据
export function getTotalData() {
  return request({
    url: '/order/totaldata',
    method: 'get'
  })
}

// 获取订单报表数据
export function getOrderTotal(date) {
  return request({
    url: '/order/ordertotal',
    method: 'get',
    params: { date: JSON.stringify(date) }
  })
} 