import request from '../utils/axios'

// 获取店铺详情
export function getShopInfo() {
  return request({
    url: '/shop/info',
    method: 'get'
  })
}

// 上传店铺图片
export function uploadShopImage(data) {
  return request({
    url: '/shop/upload',
    method: 'post',
    data
  })
}

// 修改店铺信息
export function editShop(data) {
  return request({
    url: '/shop/edit',
    method: 'post',
    data
  })
} 