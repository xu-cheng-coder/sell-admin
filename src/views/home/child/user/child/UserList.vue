<template>
  <div class="user-list">
    <el-card style="height: 600px;">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="handleAdd">添加用户</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input v-model="searchQuery" placeholder="搜索用户名/手机号" class="search-input" clearable
          @keyup.enter="handleSearch">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-select v-model="userStatus" placeholder="用户状态" class="select-state" clearable>
          <el-option label="正常" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <!-- 用户表格 -->
      <el-table :data="userList" style="width: 100%" v-loading="loading" border>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'danger'">
              {{ row.status === '1' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="handleResetPwd(row)">重置密码</el-button>
            <el-button type="primary" link :type="row.status === '1' ? 'danger' : 'success'"
              @click="handleToggleStatus(row)">
              {{ row.status === '1' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 用户表单弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '添加用户'" width="500px" :close-on-click-modal="false">
      <user-form ref="userFormRef" :is-edit="isEdit" :user-id="currentUserId" @submit="handleFormSubmit"
        @cancel="dialogVisible = false" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import UserForm from './component/UserForm.vue'
import { getUserList } from '@/api/user'
const router = useRouter()
const userFormRef = ref(null)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentUserId = ref(null)

// 搜索相关
const searchQuery = ref('')
const userStatus = ref('')

// 表格数据
const loading = ref(false)
const userList = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 搜索方法
const handleSearch = () => {
  loading.value = true;
  getAllUser(currentPage.value,pageSize.value)
  // TODO: 实现搜索逻辑
  setTimeout(() => {
    loading.value = false
  }, 500)
}
//初始化获取所有用户信息
const getAllUser = async (current, pages) => {
  console.log(current, pages);
  
    const res = await getUserList(
        {
            currentPage: current,
            pageSize: pages,
        }
    );
    if (res.status === 200) {
      userList.value = res.data.data
        console.log(userList.value);

        total.value = res.data.total
    } else {
        ElMessage.error(res.message)
    }
}
onMounted(() => {
  getAllUser(currentPage.value,pageSize.value)
})

// 重置搜索
const resetSearch = () => {
  searchQuery.value = ''
  userStatus.value = ''
  handleSearch()
}

// 分页方法
const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}

// 查看用户详情
const handleView = (row) => {
  router.push(`/home/user/detail/${row.id}`)
}

// 添加用户
const handleAdd = () => {
  isEdit.value = false
  currentUserId.value = null
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  isEdit.value = true
  currentUserId.value = row.id
  dialogVisible.value = true
}

// 重置密码
const handleResetPwd = (row) => {
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
const handleToggleStatus = (row) => {
  const action = row.status === '1' ? '禁用' : '启用'
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

// 处理表单提交
const handleFormSubmit = () => {
  dialogVisible.value = false
  handleSearch() // 刷新列表
}

</script>

<style scoped>
.user-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.search-input {
  width: 200px;
}

.select-state {
  width: 100px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>