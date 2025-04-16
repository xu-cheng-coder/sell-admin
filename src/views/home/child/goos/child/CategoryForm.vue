<template>
    <el-card>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="form-content">
            <el-form-item label="分类名称" prop="cateName">
                <el-input v-model="form.cateName" />
            </el-form-item>
            <el-form-item label="分类状态" prop="state">
                <el-select v-model="form.state" placeholder="请选择" style="width: 240px">
                    <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { addCategory } from '@/api/goods'
import { ElMessage } from 'element-plus'
const formRef = ref(null);
const loading = ref(false);
const emit = defineEmits(['submit', 'cancel'])

const form = ref({
    cateName: '',
    state: ''
})
const rules = reactive({
    cateName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ],
    state: [
        { required: true, message: '请选择分类状态', trigger: 'change' },
    ],
})
const states = ref([
    {
        label: '启用',
        value: 1
    },
    {
        label: '禁用',
        value: 0
    }
])
// 重置表单方法
const resetForm = () => {
    form.value = {
        cateName: '',
        state: ''
    };
    if (formRef.value) {
        formRef.value.resetFields();
    }
};
//提交s
const handleSubmit = async () => {
    if (!formRef.value) {
        ElMessage.error('请输入数据')
        return
    }

    try {
        loading.value = true // 提交表单时开启loading
        await formRef.value.validate()

        const requestData = {
            cateName: form.value.cateName,
            state: form.value.state
        }

        const response = await addCategory(requestData)
        console.log(response);

        if (response.data.code === 0) {
            ElMessage.success('添加成功')
            resetForm();

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
    resetForm();

}

</script>

<style scoped></style>