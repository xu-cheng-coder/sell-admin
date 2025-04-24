<template>
  <div class="user-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户详情</span>
          <el-button @click="router.back()">返回</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ userInfo.nickname }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag :type="userInfo.role === 'admin' ? 'danger' : 'primary'">
            {{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="userInfo.status === '1' ? 'success' : 'danger'">
            {{ userInfo.status === '1' ? '正常' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ userInfo.createTime }}</el-descriptions-item>
        <el-descriptions-item label="最后登录时间">{{ userInfo.lastLoginTime }}</el-descriptions-item>
      </el-descriptions>

      <div class="action-buttons">
        <el-button type="primary" @click="handleEdit">编辑</el-button>
        <el-button type="primary" @click="handleResetPwd">重置密码</el-button>
        <el-button 
          :type="userInfo.status === '1' ? 'danger' : 'success'"
          @click="handleToggleStatus"
        >
          {{ userInfo.status === '1' ? '禁用' : '启用' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userId = route.params.id

const userInfo = ref({
  id: 1,
  username: 'admin',
  nickname: '管理员',
  phone: '13800138000',
  email: 'admin@example.com',
  role: 'admin',
  status: '1',
  createTime: '2024-01-01 12:00:00',
  lastLoginTime: '2024-01-10 12:00:00'
})

// 获取用户详情
const getUserInfo = () => {
  // TODO: 调用API获取用户详情
  console.log('获取用户详情:', userId)
}

// 编辑用户
const handleEdit = () => {
  router.push(`/user/edit/${userId}`)
}

// 重置密码
const handleResetPwd = () => {
  ElMessageBox.confirm(
    '确定要重置该用户的密码吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现重置密码逻辑
    ElMessage.success('密码重置成功')
  })
}

// 切换用户状态
const handleToggleStatus = () => {
  const action = userInfo.value.status === '1' ? '禁用' : '启用'
  ElMessageBox.confirm(
    `确定要${action}该用户吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现状态切换逻辑
    ElMessage.success(`${action}成功`)
  })
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.user-detail {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style> 