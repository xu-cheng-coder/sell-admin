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
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="danger" plain @click="deletAll">批量删除</el-button>
        <el-button plain type="primary" @click="toggleSelection()">取消选择</el-button>

      </div>

      <!-- 用户表格 -->
      <el-table :data="userList" style="width: 100%" v-loading="loading" 
       row-key="id"
       @selection-change="handleSelectionChange" 
       ref="multipleTableRef"
       border>
       <el-table-column type="selection" :selectable="selectable" width="80" />

        <el-table-column prop="id" label="ID" width="150" />

        <el-table-column prop="account" label="用户名" width="150" />
        <el-table-column prop="userGroup" label="角色" width="230" />
   
        <el-table-column prop="ctime" label="注册时间" width="230" >
          <template #default="{ row }">
            <span>{{ row.ctime.slice(0, 10) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDle(row)">删除</el-button>
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
      <user-form ref="userFormRef" :is-edit="isEdit" :accountId="currentUserId" :accountInfor="userInfo" @submit="handleFormSubmit"
        @cancel="dialogVisible = false" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox ,TableInstance} from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import UserForm from './component/UserForm.vue'
import { getUserList,deleteUser,batchDeleteUsers } from '@/api/user'

const router = useRouter()
const userFormRef = ref(null)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentUserId = ref(null)
const userInfo = ref({
  account: '',
  userGroup: '',
  id: 0
});
// 搜索相关
const searchQuery = ref('')
const userStatus = ref('')

// 表格数据
const loading = ref(false)
const userList = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(7)
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



// 分页方法
const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
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
  userInfo.value = row;
  console.log(currentUserId.value);
  
}


// 处理表单提交
const handleFormSubmit = () => {
  dialogVisible.value = false
  handleSearch() // 刷新列表
}


//多选
const multipleTableRef = ref<TableInstance>()
const multipleSelection = ref<User[]>([])
const ids=ref([]) 
const selectable = (row: User) => ![1, 2].includes(row.id)
const toggleSelection = (rows?: User[], ignoreSelectable?: boolean) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(
        row,
        undefined,
        ignoreSelectable
      )
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
  console.log(multipleSelection.value);
  multipleSelection.value.forEach(item=>{
    ids.value.push(item.id);
  })
  console.log(ids.value);
  
}
//批量删除
const deletAll = async () => {
  console.log(ids.value.length);
  
  if(ids.value.length==0){
    ElMessage.error('请勾选删除用户');
    return
  }
  console.log(JSON.stringify(ids.value));
  
  const res = await batchDeleteUsers(ids.value);
 
  if(res.status === 200){
    ElMessage.success('删除成功');
    handleSearch();
  }
}


//删除
const handleDle = async (row) => {
    const res = await deleteUser(row.id);
    console.log(res);
    if(res.status === 200){
      ElMessage.success('删除成功');
      handleSearch();
      
    }
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