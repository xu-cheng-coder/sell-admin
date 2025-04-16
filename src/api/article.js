import request from '../utils/axios'

// 文章分类获取
export function getArticleTypeList(params) {
  return request({
    url: '/article/typeList',
    method: 'get',
    params
  })
}

// 文章分类添加
export function addArticleType(data) {
  return request({
    url: '/article/addArticleType',
    method: 'post',
    data
  })
}

// 文章分类删除
export function deleteArticleType(id) {
  return request({
    url: '/article/delType',
    method: 'post',
    data: { Id: id }
  })
}

// 文章添加
export function addArticle(data) {
  return request({
    url: '/article/add',
    method: 'post',
    data
  })
}

// 文章列表
export function getArticleList(params) {
  return request({
    url: '/article/list',
    method: 'get',
    params
  })
}

// 文章详情
export function getArticleDetail(id) {
  return request({
    url: '/article/info',
    method: 'get',
    params: { Id: id }
  })
}

// 修改文章
export function editArticle(data) {
  return request({
    url: '/article/edit',
    method: 'post',
    data
  })
}

// 删除文章
export function deleteArticle(id) {
  return request({
    url: '/article/del',
    method: 'get',
    params: { id }
  })
}    