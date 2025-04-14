<template>
    <div class="addgood">
        <el-card style="width: 60%;">
            <template #header>
                <div class="card-header">
                    <span>订单详情</span>
                </div>
            </template>
            <el-form :model="form" label-width="100px" class="form-content">
                <el-form-item label="订单ID" prop="id">
                    <el-input disabled v-model="form.id" />
                </el-form-item>
                <el-form-item label="订单号" prop="orderNo">
                    <el-input disabled v-model="form.orderNo" />
                </el-form-item>
                <el-form-item label="下单时间" prop="orderTime">
                    <el-input disabled v-model="form.orderTime" />
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input disabled v-model="form.phone" />
                </el-form-item>
                <el-form-item label="收货人" prop="consignee">
                    <el-input disabled v-model="form.consignee" />
                </el-form-item>
                <el-form-item label="送货地址" prop="deliverAddress">
                    <el-input disabled v-model="form.deliverAddress" />
                </el-form-item>
                <el-form-item label="送达时间" prop="deliveryTime">
                    <el-input disabled v-model="form.deliveryTime" />
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input disabled v-model="form.remarks" />
                </el-form-item>
                <el-form-item label="订单金额" prop="orderAmount">
                    <el-input disabled v-model="form.orderAmount" />
                </el-form-item>
                <el-form-item label="订单状态" prop="orderState">
                    <el-input disabled v-model="form.orderState" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleUpdate" :loading="loading">修改信息</el-button>
                    <!-- <el-button @click="handleCancel">取消</el-button> -->
                </el-form-item>
            </el-form>
        </el-card>
        <el-dialog v-if="dialogVisible" title="编辑订单" v-model="dialogVisible"  width="500px" :close-on-click-modal="false">
        <OrderForm :data="form"
            @submit="handleFormSubmit" @cancel="dialogVisible = false" />
    </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getOrderDetail } from '@/api/order' // 假设这里有获取订单详情的接口
import { useRoute } from 'vue-router'
import OrderForm from './OrderForm.vue'
const loading = ref(false);
const route = useRoute();
const emit = defineEmits(['submit', 'cancel'])
// 获取本地登录信息（假设这里有订单 ID）
const orderId = JSON.parse(localStorage.getItem('orderId'));
const dialogVisible=ref(false)
// 表单数据
const form = reactive({
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
// 获取数据
const handleGetOrderInfo = async () => {
    try {
        loading.value = true
        const orderId = route.params.orderId;
        const response = await getOrderDetail(orderId)
        console.log(response.status);

        console.log(response.data.data);
        
        if (response.status === 200) {
            form.id = response.data.data.id;
            form.orderNo = response.data.data.orderNo;
            form.orderTime = response.data.data.orderTime.substring(0, 10) ;
            form.phone = response.data.data.phone;
            form.consignee = response.data.data.consignee;
            form.deliverAddress = response.data.data.deliverAddress;
            form.deliveryTime = response.data.data.deliveryTime.substring(0, 10) ;
            form.remarks = response.data.data.remarks;
            form.orderAmount = response.data.data.orderAmount;
            form.orderState = response.data.data.orderState;
            ElMessage.success('获取订单详情成功')
        } else {
            ElMessage.error('获取订单详情失败')
        }
    } catch (error) {
        console.error('获取订单详情失败:', error)
        ElMessage.error('请求失败，请稍后再试')
    } finally {
        loading.value = false
    }
}
handleGetOrderInfo();

//修改
const handleUpdate=()=>{
    dialogVisible.value = true;

}
const handleFormSubmit = () => {
    dialogVisible.value = false
    handleGetOrderInfo() // 刷新列表
}
</script>

<style scoped>
.addgood {
    width: 80%;
    display: flex;
    align-items: center;
}

.goods-form {
    padding: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.form-content {
    max-width: 600px;
    margin: 0 auto;
}
</style>