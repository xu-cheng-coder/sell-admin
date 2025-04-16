import request from '../utils/axios'

// 添加分类
export function addCategory(data) {
  return request({
    url: '/goods/addcate',
    method: 'post',
    data
  })
}

// 获取分类列表
export function getCategoryList(params) {
  return request({
    url: '/goods/catelist',
    method: 'get',
    params
  })
}

// 删除分类
export function deleteCategory(id) {
  return request({
    url: '/goods/delcate',
    method: 'get',
    params: { id }
  })
}

// 修改分类
export function editCategory(data) {
  return request({
    url: '/goods/editcate',
    method: 'post',
    data
  })
}

// 获取所有分类名称
export function getAllCategories() {
  return request({
    url: '/goods/categories',
    method: 'get'
  })
}

// 上传商品图片
export function uploadGoodsImage(data) {
  return request({
    url: '/goods/goods_img_upload',
    method: 'post',
    data
  })
}

// 添加商品
export function addGoods(data) {
  return request({
    url: '/goods/add',
    method: 'post',
    data
  })
}

// 获取商品列表
export function getGoodsList(params) {
  return request({
    url: '/goods/list',
    method: 'get',
    params
  })
}

// 删除商品
export function deleteGoods(id) {
  return request({
    url: '/goods/del',
    method: 'get',
    params: { id }
  })
}

// 修改商品
export function editGoods(data) {
  return request({
    url: '/goods/edit',
    method: 'post',
    data
  })
} 