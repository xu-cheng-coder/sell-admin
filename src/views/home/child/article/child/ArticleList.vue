<template>
    <div class="article-list">
        <el-card style="">
            <template #header>
                <div class="card-header">
                    <span>文章列表</span>
                    <el-button type="primary" @click="handleAdd">添加文章</el-button>
                </div>
            </template>

            <!-- 搜索栏 -->
            <div class="search-bar">
                <el-input v-model="searchQuery" placeholder="搜索文章标题" class="search-input" clearable
                >
                    <template #prefix>
                        <el-icon>
                            <Search />
                        </el-icon>
                    </template>
                </el-input>
                <el-select v-model="articleStatus" placeholder="文章状态" class="select-state" clearable>
                    <el-option label="已发布" value="1" />
                    <el-option label="未发布" value="0" />
                </el-select>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="resetSearch">重置</el-button>
            </div>

            <!-- 文章表格 -->
            <el-table :data="articleList" style="width: 100%" v-loading="loading" border>
                <el-table-column type="index" label="序号" width="60" />

                <el-table-column prop="id" label="文章编号" width="100" />
                <el-table-column prop="type_name" label="分类" width="120" />
                <el-table-column prop="title" label="标题" width="150" />
                <el-table-column prop="content" label="内容" width="300">
                    <template #default="{ row }">
                        <div class="content-preview">{{ row.content.substring(0, 50) }}...</div>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="发布时间" width="180" />

                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button type="danger" plain @click="handleDelete(row)">删除</el-button>
                        <el-button type="primary" plain @click="handleEdit(row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination 
                    v-model:current-page="currentPage" 
                    v-model:page-size="pageSize"
                    :page-sizes="[5, 10, 20, 50]" 
                    :total="total" 
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange" 
                    @current-change="handleCurrentChange" 
                />
            </div>
        </el-card>

        <!-- 文章表单弹窗 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑文章' : '添加文章'" width="600px"
            :close-on-click-modal="false">
            <ArticleForm 
                ref="articleFormRef" 
                :is-edit="isEdit" 
                :articleId="currentArticleId" 
                :articleInfo="articleInfo" 
                @submit="handleFormSubmit"
                @cancel="dialogVisible = false" 
            />
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getArticleList, deleteArticle } from '@/api/article'
import ArticleForm from './ArticleForm.vue'

const articleFormRef = ref(null)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentArticleId = ref(null)

// 搜索相关
const searchQuery = ref('')
const articleStatus = ref('')

// 表格数据
const loading = ref(false)
const articleList = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

const articleInfo = ref({
    id: '',
    type_name: '',
    title: '',
    content: '',
    create_time: ''
})

// 获取文章列表
const handleArticleList = async () => {
    loading.value = true
    try {
        const res = await getArticleList({
            currentPage: currentPage.value,
            pageSize: pageSize.value,
        })
        
        if (res.data.code === 0) {
            articleList.value = res.data.data
            total.value = res.data.total
        } else {
            ElMessage.error(res.data.message || '获取文章列表失败')
        }
    } catch (error) {
        ElMessage.error('请求失败')
    } finally {
        loading.value = false
    }
}

// 搜索方法
const handleSearch = () => {
    currentPage.value = 1
    handleArticleList()
}

// 重置搜索
const resetSearch = () => {
    searchQuery.value = ''
    articleStatus.value = ''
    handleSearch()
}

// 分页方法
const handleSizeChange = (val) => {
    pageSize.value = val
    handleArticleList()
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    handleArticleList()
}

// 删除文章
const handleDelete = (row) => {
    ElMessageBox.confirm(
        '确定要删除该文章吗？',
        '删除文章',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        const res = await deleteArticle(row.id)
        if (res.data.code === 0) {
            ElMessage.success('删除成功')
            handleArticleList()
        } else {
            ElMessage.error(res.data.message || '删除失败')
        }
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

// 添加文章
const handleAdd = () => {
    isEdit.value = false
    currentArticleId.value = null
    dialogVisible.value = true
}

// 编辑文章
const handleEdit = (row) => {
    isEdit.value = true
    currentArticleId.value = row.id
    articleInfo.value = { ...row }
    dialogVisible.value = true
}

// 处理表单提交
const handleFormSubmit = () => {
    dialogVisible.value = false
    handleArticleList()
}

// 初始化加载数据
onMounted(() => {
    handleArticleList()
})
</script>

<style scoped>
.article-list {
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

.content-preview {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>