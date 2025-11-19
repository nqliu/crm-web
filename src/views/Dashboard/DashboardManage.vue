<template>
  <div class="dashboard-container">
    <!-- 1. 统计卡片区域：固定高度，在上半部分 -->
    <div class="stats-card-wrapper">
      <div class="statistics-card-group">
        <!-- 新增客户卡片 -->
        <StatisticsCard title="新增客户" :value="statisticsData.newCustomerCount" :change="statisticsData.customerChange" icon="User" color="#4285f4" />
        <!-- 新增线索卡片 -->
        <StatisticsCard title="新增线索" :value="statisticsData.newLeadCount" :change="statisticsData.leadChange" icon="Search" color="#00b42a" />
        <!-- 新增合同卡片 -->
        <StatisticsCard title="新增合同" :value="statisticsData.newContractCount" :change="statisticsData.contractChange" icon="Document" color="#ff7d00" />
        <!-- 合同总金额卡片 -->
        <StatisticsCard
          title="合同总金额"
          :value="formatCurrency(statisticsData.contractAmount)"
          :change="statisticsData.amountChange"
          icon="Money"
          color="#f53f3f"
          :isAmount="true"
        />
      </div>
    </div>

    <!-- 2. 图表区域：自动撑满剩余高度，在下半部分 -->
    <div class="chart-wrapper">
      <el-card class="full-height-card">
        <template #header>近7日数据趋势</template>
        <!-- 图表组件：父容器高度100%，确保图表填充底部 -->
        <TrendChart :chartData="trendData" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// 原有逻辑代码保持不变（数据定义、接口调用等无需修改）
import { ref, onMounted } from 'vue'
import { DashboardApi, DashboardStatistics, DashboardTrend } from '@/api/modules/dashboard'
import StatisticsCard from './components/StatisticsCard.vue'
import TrendChart from './components/TrendChart.vue'

const statisticsData = ref<DashboardStatistics>({
  newCustomerCount: 0,
  customerChange: 0,
  newLeadCount: 0,
  leadChange: 0,
  newContractCount: 0,
  contractChange: 0,
  contractAmount: 0,
  amountChange: 0
})
const trendData = ref<DashboardTrend>({
  dates: [],
  customerData: [],
  leadData: [],
  contractData: []
})

const formatCurrency = (value: number) => `¥${value.toFixed(2)}`

const fetchStatisticsData = async () => {
  try {
    const res = await DashboardApi.getDashboardData()
    if (res.data?.statistics && res.data?.trend) {
      statisticsData.value = res.data.statistics
      trendData.value = res.data.trend
    } else {
      console.error('获取的数据格式不正确')
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => fetchStatisticsData())
</script>

<style scoped>
/* 根容器：Flex垂直布局，占满屏幕高度（减去顶部导航高度，需根据项目实际调整） */
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px); /* 60px=顶部导航高度，适配实际项目 */
  padding: 20px;
  box-sizing: border-box;
  gap: 24px; /* 卡片与图表间距，避免紧贴导致视觉遮挡 */
}

/* 统计卡片区域：固定高度，确保不被压缩 */
.stats-card-wrapper {
  height: 160px; /* 固定高度，适配4个卡片横向排列的高度需求 */
}

/* 卡片组：横向排列+自适应换行，确保卡片完整显示 */
.statistics-card-group {
  display: flex;
  gap: 20px;
  height: 100%;
  align-items: stretch; /* 让所有卡片高度一致 */
  flex-wrap: wrap; /* 屏幕变窄时自动换行，避免卡片挤压 */
}

/* 图表区域：自动撑满剩余高度，占满页面下半部分 */
.chart-wrapper {
  flex: 1; /* 关键：自动填充页面剩余空间 */
  min-height: 350px; /* 最小高度，避免小屏幕下图表过矮 */
}

/* 图表卡片：占满父容器高度，确保图表不溢出 */
.full-height-card {
  height: 100%;
  display: flex;
  flex-direction: column; /* 让卡片头部和内容区垂直布局 */
}

/* 卡片内容区：撑满剩余高度，作为图表父容器 */
.full-height-card .el-card__body {
  flex: 1;
  padding: 16px;
  box-sizing: border-box;
  margin: 0; /* 清除默认margin，避免图表偏移 */
}
</style>
