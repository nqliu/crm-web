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
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="success" link :icon="CircleCheckFilled" v-hasPermi="['sys:contract:pass']" @click="showApprovalDialog(scope.row, 0)">审核通过</el-button>
        <el-button type="danger" link :icon="CircleCloseFilled" v-hasPermi="['sys:contract:reject']" @click="showApprovalDialog(scope.row, 1)">审核拒绝</el-button>
      </template>
    </ProTable>

    <!-- 审核意见弹窗（必填） -->
    <el-dialog v-model="approvalDialogVisible" :title="dialogTitle" width="500px" :before-close="handleDialogClose">
      <el-form ref="approvalFormRef" :model="approvalForm" :rules="approvalRules" label-width="80px">
        <el-form-item label="审核意见" prop="comment">
          <el-input v-model="approvalForm.comment" type="textarea" rows="4" placeholder="请输入审核通过/拒绝的原因（必填）" max-length="500"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approvalDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmApproval">确认审核</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="ContractManager">
import { ref, reactive } from 'vue'
import type { FormItemRule as ElFormItemRule } from 'element-plus'
import { ColumnProps, ProTableInstance } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { ContractApi } from '@/api/modules/contract'
import { ContractStatusList } from '@/configs/enum'
import { useHandleData } from '@/hooks/useHandleData'
import { ElMessage, ElForm } from 'element-plus'

const proTable = ref<ProTableInstance | null>(null)
const approvalDialogVisible = ref(false) // 审核弹窗显示状态
const approvalFormRef = ref<InstanceType<typeof ElForm> | null>(null) // 表单引用

// 审核表单数据（包含 comment 字段）
const approvalForm = reactive({
  id: 0, // 合同ID
  type: 0, // 0-通过，1-拒绝
  comment: '' // 审核意见（必填）
})

// 表单校验规则（强制 comment 不能为空）
const approvalRules = reactive<Record<string, ElFormItemRule[]>>({
  comment: [
    { required: true, message: '请输入审核意见', trigger: 'blur' },
    { min: 5, message: '审核意见至少输入5个字符', trigger: 'blur' }
  ]
})

// 弹窗标题（根据审核类型动态切换）
const dialogTitle = ref('')

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

// 表格列配置（保持不变）
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

/**
 * 显示审核弹窗
 * @param row 合同数据
 * @param type 审核类型：0-通过，1-拒绝
 */
const showApprovalDialog = (row: any, type: number) => {
  // 重置表单
  approvalForm.id = row.id
  approvalForm.type = type
  approvalForm.comment = ''
  approvalFormRef.value?.resetFields()

  // 设置弹窗标题
  dialogTitle.value = type === 0 ? '合同审核通过' : '合同审核拒绝'

  // 显示弹窗
  approvalDialogVisible.value = true
}

/**
 * 确认审核（校验表单 + 调用接口）
 */
const confirmApproval = async () => {
  // 表单校验
  if (!approvalFormRef.value) return
  const validateResult = await approvalFormRef.value.validate()
  if (!validateResult) return

  try {
    // 调用审核接口（传入 id、type、comment 三个参数）
    await useHandleData(
      ContractApi.approvalContract,
      {
        id: approvalForm.id,
        type: approvalForm.type,
        comment: approvalForm.comment.trim() // 传递审核意见
      },
      approvalForm.type === 0 ? '合同审核通过' : '合同审核拒绝'
    )

    // 关闭弹窗 + 刷新表格
    approvalDialogVisible.value = false
    proTable.value?.getTableList()
  } catch (error) {
    ElMessage.error('审核失败，请重试')
    console.error('审核接口调用失败:', error)
  }
}

/**
 * 关闭弹窗时重置表单
 */
const handleDialogClose = () => {
  approvalFormRef.value?.resetFields()
  approvalDialogVisible.value = false
}
</script>

<style scoped>
/* 可选：调整弹窗样式 */
.el-dialog__body {
  padding: 20px;
}
.el-textarea {
  width: 100%;
}
</style>
