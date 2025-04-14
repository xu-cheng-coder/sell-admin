<template>
    <div class="goods-list">
        <el-card style="">
            <template #header>
                <div class="card-header">
                    <span>商品列表</span>
                    <el-button type="primary" @click="handleAdd">添加商品</el-button>
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
                    <el-option label="上架" value="1" />
                    <el-option label="下架" value="0" />
                </el-select>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="resetSearch">重置</el-button>
            </div>

            <!-- 商品表格 -->
            <el-table :data="goodsList" style="width: 100%" v-loading="loading" border>
                <el-table-column type="index" label="序号" width="60">

                </el-table-column>

                <el-table-column prop="name" label="商品名称" width="120" />
                <el-table-column prop="id" label="商品编号" width="100" />
                <el-table-column prop="price" label="价格" width="100">
                    <template #default="{ row }">
                        <span style="color: red;">{{ row.price.toFixed(2) }} ￥</span>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsDesc" label="商品描述" width="200" /> />
                <el-table-column prop="imgUrl" label="图片" width="150">
                    <template #default="{ row }">
                        <img :src="'http://8.137.157.16:9002' + row.imgUrl" alt="" style="width: 50px; height: 50px" />
                    </template>
                </el-table-column>
                <el-table-column prop="ctime" label="创建时间" width="180">
                    <template #default="{ row }">
                        {{ row.ctime.substring(0, 10) }}
                    </template>
                </el-table-column>

                <el-table-column prop="category" label="商品分类" width="150" />

                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button type="danger" plain  @click="handleDelet(row)">下架</el-button>
                        <el-button type="primary" plain  @click="handleEdit(row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[5, 10, 20, 50]" :total="total" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </el-card>

        <!-- 商品表单弹窗 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑商品' : '添加商品'" width="500px"
            :close-on-click-modal="false">
            <goods-form ref="goodsFormRef" :is-edit="isEdit" :goodId="currentGoodsId" :goodsInfor="goodsInfor" @submit="handleFormSubmit"
            @cancel="dialogVisible = false" />
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getGoodsList } from '@/api/goods'
import { deleteGoods } from '@/api/goods'
import GoodsForm from './GoodForm.vue'
const router = useRouter()
const goodsFormRef = ref(null)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentGoodsId = ref(null)

// 搜索相关
const searchQuery = ref('')
const goodsStatus = ref('')

// 表格数据
const loading = ref(false)
const goodsList = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(100)
const goodsInfor = ref({
    name:'',
    category:'',
    price:'',
    imgUrl:'',
    goodsDesc:'',
    id:''
})
// 搜索方法
const handleSearch = () => {
    loading.value = true
    // TODO: 实现搜索逻辑
    handleGoodsList(currentPage.value, pageSize.value);

    setTimeout(() => {
        loading.value = false
    },1000)
}
//顶部搜索方法
const handleTopSearch = async () => {
    loading.value = true

    //搜索获取商品信息
    // const res = await getGoodsList(
    //     {
    //         currentPage: current,
    //         pageSize: pages,
    //     }
    // );
    // if (res.status === 200) {
    //     goodsList.value = res.data.data
    //     console.log(goodsList.value);

    //     total.value = res.data.total
    // } else {
    //     ElMessage.error(res.message)
    // }
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
        '确定要删除该商品吗？',
        '删除商品',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //删除商品
            console.log(goodsId);
            
            const res = await deleteGoods(goodsId)
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

// 编辑商品
const handleEdit = (row) => {
    console.log(row);

    isEdit.value = true
    currentGoodsId.value = row.id
    dialogVisible.value = true
    goodsInfor.value=row;
    
    console.log(goodsInfor);
    
}

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
    const res = await getGoodsList(
        {
            currentPage: current,
            pageSize: pages,
        }
    );
    if (res.status === 200) {
        goodsList.value = res.data.data
        console.log(goodsList.value);

        total.value = res.data.total
    } else {
        ElMessage.error(res.message)
    }
}
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