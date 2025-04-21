<template>
    <el-card style="max-width: 100%;height: 100%;">
        <template #header>
            <div class="card-header">
                <span>订单管理</span>
            </div>
        </template>
        <!-- 查询表单 -->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="订单号">
                <el-input v-model="formInline.orderNo" placeholder="订单号" clearable />
            </el-form-item>
            <el-form-item label="收货人">
                <el-input v-model="formInline.consignee" placeholder="收货人" clearable />
            </el-form-item>
            <el-form-item label="收货地址">
                <el-input v-model="formInline.phone" placeholder="收货地址" clearable />
            </el-form-item>
            <el-form-item label="订单状态">
                <el-select v-model="formInline.orderState" placeholder="订单状态" clearable>
                    <el-option label="已受理" value="已受理" />
                    <el-option label="派送中" value="派送中" />
                    <el-option label="已完成" value="已完成" />
                </el-select>
            </el-form-item>

            <el-form-item label="选择时间">
                <div class="block">
                    <el-date-picker v-model="formInline.date" type="daterange" unlink-panels range-separator="至"
                        start-placeholder="开始日期" :shortcuts="shortcuts" end-placeholder="结束日期" />
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="" @click="onSubmit">
                    <el-icon style="margin-right: 5px;">
                        <Search />
                    </el-icon>
                    搜索

                </el-button>
                <el-button @click="resetSearch">重置</el-button>

            </el-form-item>


        </el-form>

        <!-- 订单列表 -->
        <el-table v-loading="loading" :data="orderList" stripe style=" height: 350px;">
            <el-table-column prop="id" label="订单id"></el-table-column>
            <el-table-column prop="orderNo" label="订单号"></el-table-column>
            <el-table-column prop="orderTime" width="100" label="下单时间">
                <template #default="{ row }">
                    <span>{{ row.orderTime.substring(0, 10) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="phone" width="120" label="联系电话"></el-table-column>
            <el-table-column prop="consignee" label="收货人"></el-table-column>
            <el-table-column prop="deliverAddress" label="送货地址"></el-table-column>
            <el-table-column prop="deliveryTime" width="100" label="送达时间">
                <template #default="{ row }">
                    {{ row.deliveryTime.substring(0, 10) }}
                </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column prop="orderAmount" label="订单金额"></el-table-column>
            <el-table-column prop="orderState" label="订单状态"></el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
                <template #default="{ row }">
                    <el-button type="danger" plain @click="handleDetale(row)">查看</el-button>
                    <el-button type="primary" plain @click="handleEdit(row)">编辑</el-button>
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
    <el-dialog v-if="dialogVisible" title="编辑订单" v-model="dialogVisible"  width="500px" :close-on-click-modal="false">
        <OrderForm :data="orderInfor"
            @submit="handleFormSubmit" @cancel="dialogVisible = false" />
    </el-dialog>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { getOrderList } from '@/api/order.js'
import OrderForm from './OrderForm.vue'
const loading = ref(false);
//弹窗
const dialogVisible = ref(false);
const orderInfor = reactive({
    id: '',
    orderNo: '',
    orderTime: '',
    phone: '',
    consignee: '',
    deliverAddress: '',
    deliveryTime: '',
    remarks: '',
    orderAmount: '',
    orderState: ''
})
//分页
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(100)
const router = useRouter();
const isEdit = ref(false)
const handleSizeChange = (val) => {
    pageSize.value = val
    getOrderLists()
}
const handleCurrentChange = (val) => {
    currentPage.value = val
    getOrderLists()
}
const formInline = reactive({
    orderNo: '',
    consignee: '',
    phone: '',
    orderState: '',
    date: ''
})

const onSubmit = () => {
    console.log(formInline.date[0]);
    handleSearch();

}
//重置表格
const resetSearch = () => {

    formInline.orderNo = '';
    formInline.consignee = '';
    formInline.phone = '';
    formInline.orderState = '';
    formInline.date = '';
    // 重置当前页码
    currentPage.value = 1;
    ElMessage.success('重置成功')

    handleSearch()
}
//编辑
const handleEdit = (row) => {
    dialogVisible.value = true;
    orderInfor.id = row.id;
    orderInfor.orderNo = row.orderNo;
    orderInfor.orderTime = row.orderTime;
    orderInfor.phone = row.phone;
    orderInfor.consignee = row.consignee;
    orderInfor.deliverAddress = row.deliverAddress;
    orderInfor.deliveryTime = row.deliveryTime;
    orderInfor.remarks = row.remarks;
    orderInfor.orderState = row.orderState;
    orderInfor.orderAmount = row.orderAmount;

}

//// 处理表单提交
const handleFormSubmit = () => {
    dialogVisible.value = false
    handleSearch() // 刷新列表

}
//表格
const orderList = ref([])
//获取表格信息
const getOrderLists = async () => {

    const data = {
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        orderNo: formInline.orderNo,
        consignee: formInline.consignee,
        phone: formInline.phone,
        orderState: formInline.orderState,
        // 处理日期范围格式
        date: formInline.date ? formInline.date.map(date => date.toISOString().split('T')[0] + ' 00:00:00') : []
    };
    console.log(data);

    const res = await getOrderList(data)
    console.log(res);

    if (res.status == 200) {
        orderList.value = res.data.data;
        total.value = res.data.total;
        console.log(orderList.value);

    }
}

//搜索订单
// 搜索方法
const handleSearch = () => {
    loading.value = true
    // TODO: 实现搜索逻辑
    getOrderLists();

    setTimeout(() => {
        loading.value = false

    }, 1000)
}
// 初始化加载数据
onMounted(() => {
    handleSearch()
})
//查看详情
const handleDetale = (row) => {
    router
    router.push(`/home/order/orderdetail/${row.id}`)
}
//日期

const shortcuts = [
    {
        text: 'Last week',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: 'Last month',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: 'Last 3 months',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]
</script>

<style scoped>
.demo-form-inline .el-input {
    --el-input-width: 220px;
}

.demo-form-inline .el-select {
    --el-select-width: 220px;
}

.demo-date-picker {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
}

.demo-date-picker .block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
}

.demo-date-picker .block:last-child {
    border-right: none;
}

.demo-date-picker .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
}

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>