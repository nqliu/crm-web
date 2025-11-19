<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="合同列表"
      rowKey="id"
      :columns="columns"
      :requestApi="ContractApi.page"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
    >
      <!-- 操作栏按钮 -->
      <template #operation="scope">
        <el-button type="success" link :icon="CircleCheckFilled" v-hasPermi="['sys:contract:pass']" @click="approvalContract(scope.row, 0)">审核通过</el-button>
        <el-button type="danger" link :icon="CircleCloseFilled" v-hasPermi="['sys:contract:reject']" @click="approvalContract(scope.row, 1)">审核不通过</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="ContractApproval">
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { ContractApi } from '@/api/modules/contract'
import { ContractStatusList } from '@/configs/enum'
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { useHandleData } from '@/hooks/useHandleData'
const proTable = ref()
const props = defineProps({
  isShowHeader: {
    type: Boolean,
    default: true
  }
})

defineExpose({
  proTable
})

const initParam = reactive({ status: 1 })

// 处理接口返回数据格式
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

// 表格列配置
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'name',
    label: '合同名称',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'number',
    label: '合同编号',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'customerName',
    label: '客户姓名',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'amount',
    label: '合同金额',
    minWidth: 100,
    formatter: (row: any) => `¥${row.amount.toFixed(2)}`
  },
  {
    prop: 'receivedAmount',
    label: '已收款项',
    minWidth: 140,
    formatter: (row: any) => `¥${row.receivedAmount.toFixed(2)}`
  },
  {
    prop: 'status',
    label: '合同状态',
    minWidth: 120,
    enum: Object.values(ContractStatusList),
    search: { el: 'select' }
  },
  {
    prop: 'signTime',
    label: '签约时间',
    minWidth: 140
  },
  {
    prop: 'startTime',
    label: '合同开始时间',
    minWidth: 140
  },
  {
    prop: 'endTime',
    label: '合同结束时间',
    minWidth: 140
  },
  {
    prop: 'operation',
    label: '操作',
    fixed: 'right',
    width: 330,
    isShow: props.isShowHeader
  }
]
//合同审核
const approvalContract = async (row: any, type: number) => {
  useHandleData(ContractApi.approvalContract, { id: row.id, type }, type === 0 ? '合同审核通过' : '合同审核未通过')
  proTable.value.getTableList()
}
</script>
