<template>
  <el-card>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="form-content">
      <el-form-item v-if="isEdit" label="账号ID" prop="id">
        <el-input :disabled="isEdit" v-model="form.id" />
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input placeholder="输入账号" v-model="form.account" />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="输入密码" show-password />
      </el-form-item>
      <el-form-item label="用户组" prop="userGroup">
        <el-select v-model="form.userGroup" placeholder="请选择" size="large" style="width: 240px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
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
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { editUser, addUser } from '@/api/user' // 假设这里有一个 editAccount 方法来调用 /users/edit 接口

// 在 script 顶部添加 loading 状态
const loading = ref(false)

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const options = ref([
  {
    value: '超级管理员',
    label: '超级管理员'
  },
  {
    value: '普通用户',
    label: '普通用户'
  }
])
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  accountInfor: {
    type: Object,
    default: () => ({
      account: '',
      ctime: '',
      userGroup: '',
      id: 0,
      imgUrl: ''
    })
  },
  accountId: {
    type: Number,
    default: 0
  }
})
console.log(props.accountInfor, props.accountId);

const emit = defineEmits(['submit', 'cancel'])

// 表单数据
const form = reactive({
  account: '',
  userGroup: '',
  id: '',
  password: '',
})
// 表单验证规则
const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  userGroup: [
    { required: true, message: '请输入用户组', trigger: 'blur' }
  ],
  id: [
    { required: true, message: '请输入账号ID', trigger: 'blur' },
    { type: 'number', message: '账号ID必须为数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入账号ID', trigger: 'blur' },

    { required: true, min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
  ]
}

// 获取账号信息（编辑时）
const getAccountInfo = () => {
  if (props.isEdit && props.accountInfor.id) {
    console.log('获取账号信息:', props.accountInfor)
    Object.assign(form, {
      account: props.accountInfor.account,
      userGroup: props.accountInfor.userGroup,
      id: props.accountInfor.id
    })
  }
}

// 监听 accountId 变化
watch(() => props.accountId, (newVal) => {
  if (newVal) {
    getAccountInfo()
  } else {
    // 重置表单
    Object.assign(form, {
      account: '',
      userGroup: '',
      id: ''
    })
  }
}, { immediate: true })

// 修改 handleSubmit 方法
const handleSubmit = async () => {
  try {
    loading.value = true // 提交表单时开启loading
    await formRef.value.validate()

    const requestData = {
      id: Number(form.id),
      account: form.account,
      userGroup: form.userGroup
    }
    const requestData1 = {
      password: form.password,
      account: form.account,
      userGroup: form.userGroup
    }

    console.log(requestData, requestData1);

    const response = props.isEdit
      ? await editUser(requestData)
      : await addUser(requestData1)
    if (response.data.code === 0) {
      ElMessage.success(props.isEdit ? '编辑成功' : '添加成功')
      emit('submit')
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('请输入正确的信息')
  } finally {
    loading.value = false // 关闭loading
  }
}

// 取消
const handleCancel = () => {
  emit('cancel')
}

onMounted(() => {
  // 判断是编辑还是添加
  if (route.params.id) {
    props.isEdit = true
    props.accountId = route.params.id
    getAccountInfo()
  }
})
</script>

<style scoped>
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