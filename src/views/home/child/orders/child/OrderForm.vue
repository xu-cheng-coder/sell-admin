<template>
    <el-card>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="form-content">
            <el-form-item label="订单ID" prop="id">
                <el-input disabled v-model.number="form.id" />
            </el-form-item>
            <el-form-item label="订单号" prop="orderNo">
                <el-input disabled v-model="form.orderNo" />
            </el-form-item>
            <el-form-item label="下单时间" prop="orderTime">
                <el-input disabled v-model="form.orderTime" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="form.phone" />
            </el-form-item>
            <el-form-item label="收货人" prop="consignee">
                <el-input v-model="form.consignee" />
            </el-form-item>
            <el-form-item label="送货地址" prop="deliverAddress">
                <el-input v-model="form.deliverAddress" />
            </el-form-item>
            <el-form-item label="送达时间" prop="deliveryTime">
                <div class="block">
                    <el-date-picker  value-format="YYYY-MM-DD" v-model="form.deliveryTime" type="date"  />
                </div>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
                <el-input v-model="form.remarks" />
            </el-form-item>
            <el-form-item label="订单金额" prop="orderAmount">
                <el-input v-model="form.orderAmount" />
            </el-form-item>
            <el-form-item label="订单状态" prop="orderState">
                <el-select v-model="form.orderState" placeholder="请选择" style="width: 240px">
                    <el-option v-for="item in orderStates" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
// 这里假设你有对应的API函数，实际请替换为真实的API
import { editOrder } from '@/api/order'
import { ElMessage } from 'element-plus'
const formRef = ref(null);
const loading = ref(false);
const emit = defineEmits(['submit', 'cancel'])
//接受父组件传来的订单数据
const props = defineProps({
    data: {
        type: Object,
        default: () => ({
            id: null,
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
    }
})
console.log(props.data);
const form = ref({
    id: props.data.id,
    orderNo: props.data.orderNo,
    orderTime: props.data.orderTime.substring(0, 10),
    phone: props.data.phone,
    consignee: props.data.consignee,
    deliverAddress: props.data.deliverAddress,
    deliveryTime: props.data.deliveryTime.substring(0, 10),
    remarks: props.data.remarks,
    orderAmount: props.data.orderAmount,
    orderState: props.data.orderState
})



const rules = reactive({
    id: [
        { required: true, message: '请输入订单ID', trigger: 'blur' },
        { type: 'number', message: '订单ID必须为数字', trigger: 'blur' }
    ],
    orderNo: [
        { required: true, message: '请输入订单号', trigger: 'blur' },
    ],
    orderTime: [
        { required: true, message: '请输入下单时间', trigger: 'blur' },
    ],
    phone: [
        { required: true, message: '请输入电话', trigger: 'blur' },
    ],
    consignee: [
        { required: true, message: '请输入收货人', trigger: 'blur' },
    ],
    deliverAddress: [
        { required: true, message: '请输入送货地址', trigger: 'blur' },
    ],
    deliveryTime: [
        { required: true, message: '请输入送达时间', trigger: 'blur' },
    ],
    remarks: [
        { required: true, message: '请输入备注', trigger: 'blur' },
    ],
    orderAmount: [
        { required: true, message: '请输入订单金额', trigger: 'blur' },
    ],
    orderState: [
        { required: true, message: '请选择订单状态', trigger: 'change' },
    ],
})
const orderStates = ref([
    {
        label: '已受理',
        value: '已受理'
    },
    {
        label: '派送中',
        value: '派送中'
    },
    {
        label: '已完成',
        value: '已完成'
    }
])
// 重置表单方法
// const resetForm = () => {
//     form.value = {
//         id: null,
//         orderNo: '',
//         orderTime: '',
//         phone: '',
//         consignee: '',
//         deliverAddress: '',
//         deliveryTime: '',
//         remarks: '',
//         orderAmount: '',
//         orderState: ''
//     };
//     if (formRef.value) {
//         formRef.value.resetFields();
//     }
// };
//提交
const handleSubmit = async () => {
    if (!formRef.value) {
        ElMessage.error('请输入数据')
        return
    }

    try {
        loading.value = true // 提交表单时开启loading
        await formRef.value.validate()

        const requestData = {
            id: form.value.id,
            orderNo: form.value.orderNo,
            orderTime: form.value.orderTime,
            phone: form.value.phone,
            consignee: form.value.consignee,
            deliverAddress: form.value.deliverAddress,
            deliveryTime: form.value.deliveryTime,
            remarks: form.value.remarks,
            orderAmount: form.value.orderAmount,
            orderState: form.value.orderState
        }
        console.log(requestData);
        
        const response = await editOrder(requestData)
        console.log(response);

        if (response.data.code === 0) {
            ElMessage.success('修改成功')

            emit('submit')
        }
    } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('请求失败，请稍后再试')
    } finally {
        loading.value = false // 关闭loading
    }
}
// 取消
const handleCancel = () => {
    emit('cancel')

}


//时间

</script>

<style scoped>
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
</style>