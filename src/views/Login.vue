<template>
  <div class="login-container">
    <div class="login-left">
      <div class="image-card">
        <img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="餐厅图片">
        <div class="image-overlay">
          <h1>欢迎使用外卖管理系统</h1>
          <p>高效管理您的餐厅业务</p>
        </div>
      </div>
    </div>
    <div class="login-right">
      <div class="login-card">
        <h2>外卖管理系统</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="account">
            <el-input v-model="loginForm.account" placeholder="请输入账号">
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password>
              <template #prefix>
                <el-icon>
                  <Lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" :loading="loading" class="login-button">
              登录
            </el-button>
          </el-form-item>
          <div class="register-link">
            <span>还没有账号？</span>
            <el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { login } from '../api/login.js'
const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  account: '',
  password: ''
})

const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await login({
          account: loginForm.account,
          password: loginForm.password
        })

        console.log(res.data);
        
        if (res.data.code === 0) {
          // 登录成功
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userId', res.data.id)
          localStorage.setItem('userRole', res.data.role)

          ElMessage.success('登录成功')
          router.push('/home')
        } else {
          // 登录失败
          ElMessage.error(res.data.msg || '登录失败')
        }
      } catch (error) {
        console.error('登录出错:', error)
        ElMessage.error('登录失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-left {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.image-card {
  width: 100%;
  height: 80%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

.image-overlay h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.image-overlay p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.login-right {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-link span {
  margin-right: 10px;
}
</style>