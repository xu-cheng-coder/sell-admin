<template>
  <el-card>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="form-content">
      <el-input v-model="input" style="width: 240px" disabled placeholder="Please input" />

      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input :disabled v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input disabled v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input disabled v-model="form.email" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select disabled v-model="form.role" placeholder="请选择角色">
          <el-option label="管理员" value="admin" />
          <el-option label="普通用户" value="user" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="1">正常</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  userId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

// 表单数据
const form = reactive({
  username: '',
  nickname: '',
  phone: '',
  email: '',
  role: 'user',
  status: '1'
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 获取用户信息（编辑时）
const getUserInfo = () => {
  if (props.isEdit && props.userId) {
    // TODO: 调用API获取用户信息
    console.log('获取用户信息:', props.userId)
    // 模拟数据
    Object.assign(form, {
      username: 'admin',
      nickname: '管理员',
      phone: '13800138000',
      email: 'admin@example.com',
      role: 'admin',
      status: '1'
    })
  }
}

// 监听 userId 变化
watch(() => props.userId, (newVal) => {
  if (newVal) {
    getUserInfo()
  } else {
    // 重置表单
    Object.assign(form, {
      username: '',
      nickname: '',
      phone: '',
      email: '',
      role: 'user',
      status: '1'
    })
  }
}, { immediate: true })

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    // TODO: 调用API保存用户信息
    console.log('保存用户信息:', form)
    ElMessage.success(props.isEdit ? '编辑成功' : '添加成功')
    emit('submit')
  } catch (error) {
    console.error('表单验证失败:', error)
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
    props.userId = route.params.id
    getUserInfo()
  }
})
</script>

<style scoped>
.user-form {
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