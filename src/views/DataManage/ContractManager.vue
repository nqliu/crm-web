<template>
  <div class="container-box">
    <div class="select-box">
      <span>筛选：</span>
      <el-select v-model="selectedType" placeholder="选择统计类型" style="width: 240px; margin-left: 20px">
        <el-option label="按状态统计（数量）" value="status" />
      </el-select>
      <el-button type="primary" @click="getStatisData" style="margin-left: 20px">查询</el-button>
    </div>
    <div style="height: 80vh; width: 100%">
      <!-- 空值兜底：避免传递空对象导致图表组件报错 -->
      <ContractPieChart :data="contractData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ContractPieChart from './components/ContractPieChart.vue'
import { ContractApi } from '@/api/modules/contract'
import { ElMessage } from 'element-plus'

// 1. 定义后端返回数据的类型（替代any，消除类型警告）
interface ContractTrendPieVO {
  status: number
  statusName?: string
  count: number
}

// 2. 定义图表组件所需数据类型（与组件props匹配）
interface ContractStatData {
  typeList: string[]
  valueList: number[]
}

// 统计类型：初始值与下拉选项匹配
const selectedType = ref('status')

// 合同统计数据（初始化为空数组，避免undefined）
const contractData = ref<ContractStatData>({
  typeList: [],
  valueList: []
})
// 状态值映射表（抽离为常量，提高可维护性）
const STATUS_MAP = {
  0: '待审核',
  1: '审核中',
  2: '已通过',
  3: '审核未通过'
} as const

// 获取统计数据的方法（完善类型约束和错误处理）
const getStatisData = async () => {
  try {
    // 清空旧数据，避免加载中显示旧数据
    contractData.value = { typeList: [], valueList: [] }
    // 调用接口并指定返回类型（核心：消除res.data未知类型错误）
    const res = (await ContractApi.getContractStatusPieData()) as {
      data: ContractTrendPieVO[]
    }

    // 空值判断：后端返回空数据时提示
    if (!res || !Array.isArray(res.data) || res.data.length === 0) {
      ElMessage.warning('暂无统计数据')
      return
    }

    // 转换数据格式（强类型处理，避免any）
    const typeList = res.data.map((item) => {
      return item.statusName || STATUS_MAP[item.status] || `状态${item.status}`
    })
    const valueList = res.data.map((item) => item.count)

    // 赋值给响应式数据
    contractData.value = { typeList, valueList }
  } catch (error) {
    console.error('获取合同统计数据失败:', error)
    ElMessage.error('获取统计数据失败，请稍后重试')
    // 异常时重置数据，避免图表组件报错
    contractData.value = { typeList: [], valueList: [] }
  }
}

// 页面加载时初始化数据
onMounted(() => {
  getStatisData()
})
</script>
