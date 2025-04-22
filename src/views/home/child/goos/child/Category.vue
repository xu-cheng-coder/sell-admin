<template>
  <div class="goods-list">
    <el-card style="">
      <template #header>
        <div class="card-header">
          <span>商品分类列表</span>
          <el-button type="primary" @click="handleAdd">添加分类</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input v-model="searchQuery" placeholder="搜索商品名称/编号" class="search-input" clearable
          @keyup.enter="handleTopSearch">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-select v-model="goodsStatus" placeholder="商品状态" class="select-state" clearable>
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <!-- 商品表格 -->
      <el-table :data="catesList" style="width: 100%" v-loading="loading" border>
        <el-table-column type="index" label="序号" width="210">

        </el-table-column>
        <el-table-column prop="id" label="分类编号" width="210" />
        <el-table-column prop="cateName" label="分类名称" width="210">
          <template #default="{ row }">
            <div v-if="row.isEditing">
              <el-input v-model="row.cateName" style="width: 130px" />
            </div>
            <span v-else>{{ row.cateName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="state" label="是否启动" width="230">
          <template #default="{ row }">
            <el-switch v-model="row.state"  :disabled="!row.isEditing" :active-value="1" :inactive-value="0"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
          </template>
        </el-table-column>


        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" plain @click="handleDelet(row)">删除</el-button>
            <el-button type="primary" v-show="!row.isEditing" plain @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="success" v-show="row.isEditing" plain @click="handleSuccess(row)">
              完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 50]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 商品表单弹窗 -->
    <el-dialog v-model="dialogVisible" title="添加分类" width="500px" :close-on-click-modal="false">
      <CateGoryForm ref="goodsFormRef" @submit="handleFormSubmit" @cancel="dialogVisible = false" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getCategoryList, editCategory, deleteCategory } from '@/api/goods'
import CateGoryForm from '@/views/home/child/goos/child/CategoryForm.vue'
const router = useRouter()
const goodsFormRef = ref(null)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentGoodsId = ref(null)

//编辑的数据
const success = ref(false);
const state = ref(true)
// 搜索相关
const searchQuery = ref('')
const goodsStatus = ref('')

// 表格数据
const loading = ref(false)
const catesList = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(100)
const cateInfor = ref({
  id: '',
  cateName: '',
  state: 0
})
// 搜索方法
const handleSearch = () => {
  loading.value = true
  // TODO: 实现搜索逻辑
  handleGoodsList(currentPage.value, pageSize.value);

  setTimeout(() => {
    loading.value = false
  }, 1000)
}
//顶部搜索方法
const handleTopSearch = async () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const resetSearch = () => {
  searchQuery.value = ''
  goodsStatus.value = ''
  handleSearch()
}

// 分页方法
const handleSizeChange = (val) => {
  console.log(val);

  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  console.log(val);

  currentPage.value = val
  handleSearch()
}

// 查看商品详情
const handleDelet = (row) => {
  console.log(row.id);
  const goodsId = row.id
  ElMessageBox.confirm(
    '确定要删除该分类吗？',
    '删除分类',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      //删除商品
      console.log(goodsId);

      const res = await deleteCategory(goodsId)
      console.log(res);

      if (res.data.code === 0) {
        ElMessage.success('删除成功')
        handleSearch()
      } else {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}

// 添加商品
const handleAdd = () => {
  isEdit.value = false
  currentGoodsId.value = null
  dialogVisible.value = true
}

//修改分类方法
const updateCategory = async (cateDate) => {
  const data = {
    id: cateDate.id,
    cateName: cateDate.cateName,
    state: cateDate.state,
  }
  const res = await editCategory(data);
  console.log(res);
  if (res.data.code === 0) {
    ElMessage.success('修改成功');
    handleSearch()

  } else {
    ElMessage.error('修改失败')
  }
}
const handleEdit = (row) => {
  // 将所有行设为非编辑状态
  catesList.value.forEach(item => {
    item.isEditing = false;
  });
  // 设置当前行编辑状态
  row.isEditing = true;
  state.value = false;
  currentGoodsId.value = row.id;
  cateInfor.value = row;
};

const handleSuccess = (row) => {
  updateCategory(row);
  row.isEditing = false; // 只关闭当前行的编辑状态
  state.value = true;
};
// 处理表单提交
const handleFormSubmit = () => {
  dialogVisible.value = false
  handleSearch() // 刷新列表
}

// 初始化加载数据
onMounted(() => {
  handleSearch()
})
console.log(currentPage.value, pageSize.value);

// 初始化获取商品列表
const handleGoodsList = async (current, pages) => {
  const res = await getCategoryList({
    currentPage: current,
    pageSize: pages,
  });
  if (res.status === 200) {
    catesList.value = res.data.data.map(item => ({
      ...item,
      isEditing: false // 添加编辑状态字段
    }));
    total.value = res.data.total;
  } else {
    ElMessage.error(res.message);
  }
};
</script>

<style scoped>
.goods-list {
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