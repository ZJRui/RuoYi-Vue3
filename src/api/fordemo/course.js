import request from '@/utils/request.js'

// 查询课程管理列表
export function listCourse(query) {
  return request({
    url: '/fordemo/course/list',
    method: 'get',
    params: query
  })
}

// 查询课程管理详细
export function getCourse(id) {
  return request({
    url: '/fordemo/course/' + id,
    method: 'get'
  })
}

// 新增课程管理
export function addCourse(data) {
  return request({
    url: '/fordemo/course',
    method: 'post',
    data: data
  })
}

// 修改课程管理
export function updateCourse(data) {
  return request({
    url: '/fordemo/course',
    method: 'put',
    data: data
  })
}

// 删除课程管理
export function delCourse(id) {
  return request({
    url: '/fordemo/course/' + id,
    method: 'delete'
  })
}
