import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'

/**
 * @name 客户管理
 */
export const CustomerApi = {
  page: (params: any) => http.post(COMMON_ADMIN_API + '/customer/page', params),
  list: (params: any) => http.post(COMMON_ADMIN_API + '/customer/list', params),
  saveOrEdit: (params: any) => http.post(COMMON_ADMIN_API + '/customer/saveOrUpdate', params),
  remove: (params: any) => http.post(COMMON_ADMIN_API + '/customer/remove', params),
  export: (params: any) => http.post(COMMON_ADMIN_API + '/customer/export', params, { responseType: 'blob' }),
  toPublic: (params: any) => http.post(COMMON_ADMIN_API + '/customer/toPublic', params),
  toPrivate: (params: any) => http.post(COMMON_ADMIN_API + '/customer/toPrivate', params)
}

import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'

/**
 * @name 商品管理
 */
export const ProductApi = {
  // 商品列表分页查询（核心接口，对应列表页数据加载）
  page: (params: any) => http.post(COMMON_ADMIN_API + '/product/page', params),

  // 商品列表全量查询（可选，用于不需要分页的场景）
  list: (params: any) => http.post(COMMON_ADMIN_API + '/product/list', params),

  // 保存或编辑商品（用于编辑功能）
  saveOrEdit: (params: any) => http.post(COMMON_ADMIN_API + '/product/saveOrUpdate', params),

  // 删除商品（可选，如需删除功能）
  remove: (params: any) => http.post(COMMON_ADMIN_API + '/product/remove', params),

  // 定时上下架操作（对应操作栏的定时上下架功能）
  schedule: (params: any) => http.post(COMMON_ADMIN_API + '/product/schedule', params),

  // 商品导出（可选，如需导出功能）
  export: (params: any) => http.post(COMMON_ADMIN_API + '/product/export', params, { responseType: 'blob' })
}
