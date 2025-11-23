<!-- src/views/System/OperLogManage.vue -->
<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="操作日志管理"
      :columns="columns"
      :requestApi="getTableList"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
      @selection-change="handleSelectionChange"
    >
      <!-- 表格头部操作按钮 -->
      <template #tableHeader>
        <el-button type="danger" :icon="Delete" v-hasPermi="['sys:operlog:delete']" @click="handleBatchDelete" :disabled="!selectedList.length"> 批量删除 </el-button>
        <el-button type="warning" :icon="Delete" v-hasPermi="['sys:operlog:clean']" @click="handleClean"> 清空日志 </el-button>
      </template>

      <!-- 表格操作列 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" v-hasPermi="['sys:operlog:view']" @click="handleView(scope.row)"> 查看详情 </el-button>
        <el-button type="text" :icon="Delete" text-color="#ff4d4f" v-hasPermi="['sys:operlog:delete']" @click="handleDelete(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>

    <!-- 详情弹窗：保持v-model:visible语法糖调用 -->
    <OperLogDialog v-model:visible="detailVisible" :logInfo="detailInfo" />
  </div>
</template>

<script setup lang="ts" name="OperLogManage">
import { ref, reactive, h } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { getOperLogPage, deleteOperLog, cleanOperLog } from '@/api/modules/operLog'
import { SysOperLog } from '@/api/interface'
import { View, Delete } from '@element-plus/icons-vue'
import OperLogDialog from './components/OperLogDialog.vue'
import { useHandleData } from '@/hooks/useHandleData'
import { ElMessageBox } from 'element-plus'
import { ElTag } from 'element-plus' // 修正组件导入

// 表格实例
const proTable = ref()
const selectedList = ref<SysOperLog.ResOperLogList[]>([])

// 处理选中项变化
const handleSelectionChange = (val: SysOperLog.ResOperLogList[]) => {
  selectedList.value = val
}

// 初始化参数
const initParam = reactive<SysOperLog.ReqOperLogParams>({
  page: 1,
  limit: 10
})

// 处理返回数据
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

// 表格请求方法
const getTableList = (params: any) => {
  // 处理时间范围参数
  if (params.dateRange && params.dateRange.length) {
    params.startTime = params.dateRange[0]
    params.endTime = params.dateRange[1]
    delete params.dateRange
  }
  return getOperLogPage(params)
}

// 详情弹窗状态
const detailVisible = ref(false)
const detailInfo = ref<SysOperLog.ResOperLogList>({} as SysOperLog.ResOperLogList)

// 查看详情
const handleView = (row: SysOperLog.ResOperLogList) => {
  detailInfo.value = row
  detailVisible.value = true
}

// 删除单条日志
const handleDelete = async (row: SysOperLog.ResOperLogList) => {
  // 修正参数命名
  await useHandleData(deleteOperLog, [row.id], `确定要删除【${row.title}】的操作日志吗？`)
  proTable.value.getTableList()
}

// 批量删除
const handleBatchDelete = async () => {
  const ids = selectedList.value.map((item) => item.id)
  await useHandleData(deleteOperLog, ids, `确定要删除选中的${selectedList.value.length}条日志吗？`)
  proTable.value.clearSelection()
  proTable.value.getTableList()
}

// 清空日志
const handleClean = async () => {
  await ElMessageBox.confirm('确定要清空所有操作日志吗？此操作不可恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })

  await useHandleData(cleanOperLog, [], '日志清空成功')
  proTable.value.getTableList()
}

// 表格配置项
const columns: ColumnProps<SysOperLog.ResOperLogList>[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'id',
    label: '日志ID',
    width: 80,
    align: 'center'
  },
  {
    prop: 'title',
    label: '模块标题',
    search: { el: 'input' }
  },
  {
    prop: 'operType',
    label: '业务类型',
    search: {
      el: 'select',
      options: [
        { label: '其它', value: 0 },
        { label: '新增', value: 1 },
        { label: '修改', value: 2 },
        { label: '删除', value: 3 },
        { label: '查询', value: 4 },
        { label: '登录', value: 5 }
      ]
    },
    render: (scope) => {
      const operType = scope.row.operType
      if (operType === 0) {
        return h(ElTag, '其它') // 修正组件名
      } else if (operType === 1) {
        return h(ElTag, { type: 'success' }, '新增')
      } else if (operType === 2) {
        return h(ElTag, { type: 'warning' }, '修改')
      } else if (operType === 3) {
        return h(ElTag, { type: 'danger' }, '删除')
      } else if (operType === 4) {
        return h(ElTag, { type: 'info' }, '查询')
      } else if (operType === 5) {
        return h(ElTag, { type: 'primary' }, '登录')
      } else {
        return null
      }
    }
  },
  {
    prop: 'operName',
    label: '操作人',
    search: { el: 'input' }
  },
  {
    prop: 'operTime',
    label: '操作时间',
    width: 200,
    search: {
      el: 'date-picker',
      type: 'datetimerange',
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    prop: 'operIp',
    label: '主机地址',
    search: { el: 'input' }
  },
  {
    prop: 'operLocation',
    label: '操作地点'
  },
  {
    prop: 'status',
    label: '状态',
    search: {
      el: 'select',
      options: [
        { label: '正常', value: 0 },
        { label: '异常', value: 1 }
      ]
    },
    render: (scope) => {
      return scope.row.status === 0 ? h(ElTag, { type: 'success' }, '正常') : h(ElTag, { type: 'danger' }, scope.row.errorMsg || '异常')
    }
  },
  {
    prop: 'costTime',
    label: '耗时(ms)',
    width: 100
  },
  {
    prop: 'operation',
    label: '操作',
    fixed: 'right',
    width: 200
  }
]
</script>
