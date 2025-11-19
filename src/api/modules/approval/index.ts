import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'

/**
 * 审核相关API接口
 * 对应ContractApproval.vue中使用的审核记录查询功能
 */
export const ApprovalApi = {
  /**
   * 根据合同ID查询对应的审核记录
   * @param contractId - 合同ID
   * @returns 审核记录对象（包含id等核心字段）
   */
  getByContractId: (contractId: number) => {
    return http.get(`${COMMON_ADMIN_API}/approval/getByContractId`, {
      params: { contractId }
    })
  },

  /**
   * （扩展接口）获取审核记录详情
   * @param approvalId - 审核记录ID
   * @returns 完整的审核记录详情
   */
  getApprovalDetail: (approvalId: number) => {
    return http.get(`${COMMON_ADMIN_API}/approval/detail`, {
      params: { id: approvalId }
    })
  },

  /**
   * （扩展接口）获取审核记录列表
   * @param params - 查询参数（如状态、页码等）
   * @returns 审核记录分页列表
   */
  getApprovalList: (params: any) => {
    return http.get(`${COMMON_ADMIN_API}/approval/list`, {
      params
    })
  }
}
