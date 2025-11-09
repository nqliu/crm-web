// src/api/modules/operLog/index.ts
import { ResPage, SysOperLog } from '@/api/interface/index'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'
import http from '@/api'

/**
 * @name 操作日志模块
 */
// * 获取日志分页列表
export const getOperLogPage = (params: SysOperLog.ReqOperLogParams) => {
  return http.post<ResPage<SysOperLog.ResOperLogList>>(COMMON_ADMIN_API + `/operLog/page`, params)
}

// * 批量删除日志
export const deleteOperLog = (params: number[]) => {
  return http.post(COMMON_ADMIN_API + `/sys/operLog/remove`, params)
}

// * 清空日志
export const cleanOperLog = () => {
  return http.post(COMMON_ADMIN_API + `/sys/operLog/clean`)
}
