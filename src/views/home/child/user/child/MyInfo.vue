<template>
    <div class="addgood">
      <el-card style="width: 60%;">
        <template #header>
          <div class="card-header">
            <span>个人信息</span>
          </div>
        </template>
        <el-form  :model="form"  label-width="100px" class="form-content">
          <el-form-item label="管理员ID" prop="id">
            <el-input disabled v-model="form.id" />
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <el-input disabled v-model="form.account" />
          </el-form-item>
          <el-form-item label="创建时间" prop="ctime">
            <el-input disabled v-model="form.ctime" />
          </el-form-item>
          <el-form-item label="用户组" prop="userGroup">
            <el-input disabled v-model="form.userGroup" />
          </el-form-item>
          <el-form-item label="用户头像" prop="imgUrl">
              <img w-full :src="form.imgUrl" alt="Preview Image" width="100%" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  :loading="loading">修改信息</el-button>
            <!-- <el-button @click="handleCancel">取消</el-button> -->
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import { getAccountInfo } from '@/api/user'
  
 
  const loading = ref(false)
  const emit = defineEmits(['submit', 'cancel'])
  //获取本地登录信息
  const userId = JSON.parse(localStorage.getItem('userId'))
  // 表单引用
  // 表单数据
  // 表单数据
  const form = reactive({
    id: '',
    ctime: '',
    account: '',
    imgUrl: '',
    userGroup: ''
  })
  // 获取数据
  const handleGetMyinfo = async () => {
    try {
      loading.value = true  
      const response = await getAccountInfo(userId)

      
      if (response.data.code === 0) {
        ElMessage.success('添加成功')
        resetForm()
        emit('submit')
      }
    } catch (error) {
      console.error('保存失败:', error)
      ElMessage.error('请求失败，请稍后再试')
    } finally {
      loading.value = false
    }
  }
  handleGetMyinfo();

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