<template>
  <!-- 图表容器：占满父容器高度，宽度100% -->
  <div class="chart-container">
    <div id="trendChart" class="echarts-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    default: () => ({
      dates: [],
      customerData: [],
      leadData: [],
      contractData: [],
      approvedData: [],
      rejectedData: []
    })
  }
})

const chartInstance = ref<echarts.ECharts | null>(null)

// 初始化图表：优化grid布局，确保X轴（日期）在底部不遮挡
const initChart = () => {
  const chartDom = document.getElementById('trendChart')
  if (!chartDom) return

  // 销毁旧实例，避免重复渲染
  if (chartInstance.value) chartInstance.value.dispose()

  // 初始化图表：适配高清屏幕，避免模糊
  chartInstance.value = echarts.init(chartDom, null, {
    width: 'auto',
    height: 'auto',
    devicePixelRatio: window.devicePixelRatio || 1
  })
  // 检查数据是否存在，避免undefined错误
  const hasData = props.chartData && props.chartData.dates && props.chartData.dates.length > 0
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      textStyle: { fontSize: 14 }
    },
    legend: {
      data: ['新增客户', '新增线索', '新增合同', '审核通过', '审核拒绝'],
      top: 10,
      left: 'center',
      textStyle: { fontSize: 14 },
      // 处理图例过多的情况
      formatter: function (name: string) {
        return name.length > 4 ? name.substring(0, 4) + '...' : name
      }
    },
    // 关键：调整grid布局，让图表占满容器且X轴在底部
    grid: {
      left: '2%', // 左侧边距，避免内容溢出
      right: '2%', // 右侧边距
      bottom: '10%', // 底部预留足够空间（适配日期标签，避免截断）
      top: '12%', // 顶部适配图例，避免重叠
      containLabel: true // 确保标签不溢出容器
    },
    xAxis: {
      type: 'category',
      data: props.chartData.dates,
      position: 'bottom', // 明确X轴在底部（兼容特殊场景）
      axisLabel: {
        fontSize: 12,
        rotate: 45, // 日期标签旋转45度，避免重叠（解决多日期显示拥挤问题）
        margin: 15 // 标签与轴间距，避免紧贴
      },
      axisLine: { show: true, lineStyle: { color: '#86909c' } } // 显示X轴线，增强视觉边界
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLabel: { fontSize: 12 },
      axisLine: { show: true, lineStyle: { color: '#86909c' } },
      splitLine: { lineStyle: { color: '#86909c' } } // 网格线深色，提升美观度
    },
    series: [
      {
        name: '新增客户',
        type: 'bar',
        data: props.chartData.customerData,
        itemStyle: { color: '#4285f4' },
        barWidth: '28%', // 柱子宽度适配7日数据，避免过宽或过窄
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(66, 133, 244, 0.3)' } } // hover效果
      },
      {
        name: '新增线索',
        type: 'bar',
        data: props.chartData.leadData,
        itemStyle: { color: '#00b42a' },
        barWidth: '28%',
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0, 180, 42, 0.3)' } }
      },
      {
        name: '新增合同',
        type: 'bar',
        data: props.chartData.contractData,
        itemStyle: { color: '#ff7d00' },
        barWidth: '18%'
      },
      // 新增审核通过趋势
      {
        name: '审核通过',
        type: 'bar', // 明确指定类型
        data: hasData ? props.chartData.approvedData : [],
        itemStyle: { color: '#27ae60' },
        barWidth: '18%'
      },
      // 新增审核拒绝趋势
      {
        name: '审核拒绝',
        type: 'bar', // 明确指定类型
        data: hasData ? props.chartData.rejectedData : [],
        itemStyle: { color: '#e74c3c' },
        barWidth: '18%'
      }
    ]
  }

  chartInstance.value.setOption(option)
}

// 监听窗口大小变化，自适应调整图表
const handleResize = () => chartInstance.value?.resize()

// 监听数据变化，重新渲染图表
watch(() => props.chartData, initChart, { deep: true })

// 页面挂载时初始化图表
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

// 页面卸载时销毁图表，避免内存泄漏
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
})
</script>
<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
}

.echarts-container {
  width: 100%;
  height: 100%;
  min-height: 400px; /* 确保图表有足够高度 */
}
</style>
