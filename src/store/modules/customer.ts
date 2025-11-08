import { CustomerApi } from '@/api/modules/customer'
import { usePiniaPersist } from '@/hooks/usePiniaPersist'
import { defineStore } from 'pinia'

interface CustomerState {
  customerList: any
}

export const useCustomerStore = defineStore({
  id: 'CustomerState',
  state: (): CustomerState => ({
    customerList: []
  }),
  actions: {
    async getCustomerList() {
      const res = await CustomerApi.list({})
      this.customerList = res.data
    }
  },
  persist: usePiniaPersist('CustomerStore')
})
