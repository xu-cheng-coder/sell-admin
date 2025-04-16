<template>
  <div class="addgood">
    <el-card style="width: 60%;">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
        </div>
      </template>
      <el-form ref="ruleFormRef" :model="form" label-width="100px" :rules="rules" class="form-content">
        <el-form-item :required="true" label="旧密码" prop="password">
          <el-input type="password" placeholder="请输入旧密码" show-password v-model="form.password" />
        </el-form-item>
        <el-form-item :required="true" label="新密码" prop="newPassword">
          <el-input type="password" placeholder="请输入新密码" show-password v-model="form.newPassword" />
        </el-form-item>

        <el-form-item :required="true" label="确认密码" prop="confirmPassword">
          <el-input type="password" placeholder="请确认新密码" show-password v-model="form.confirmPassword" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleUpd" :loading="loading">保存</el-button>
          <el-button type="default" @click="handleCancel">重置密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { editPassword, checkOldPassword } from '@/api/user'
import { da } from 'element-plus/es/locales.mjs'

const userId = localStorage.getItem('userId')
const loading = ref(false)
const form = ref({
  password: '',
  newPassword: '',
  confirmPassword: ''
})
const ruleFormRef = ref(null)

//自定义密码校验规则
const validatePass2 = (rule, value, callback) => {
  // rule是整个input的校验规则
  // value是当前input的值
  // callback是回调函数，校验通过调用callback，校验不通过调用callback(new Error('错误信息'))
  let reg = /^([a-z]|[0-9]){4,11}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('密码格式不正确'))
  }
}
//自定义确认密码校验规则
const validatePass3 = (rule, value, callback) => {
  if (value === form.value.newPassword) {
    callback()
  }
  else {
    callback(new Error('两次密码不一致'))
  }
}
//自定义新密码校验规则
const validatePass4 = (rule, value, callback) => {
  if (value != form.value.password) {
    callback()
  }
  else {
    callback(new Error('新密码和旧密码不能一样'))
  }
}
const rules = reactive({
  password: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    {
      validator: validatePass2, trigger: 'blur'
    }

  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      validator: validatePass2, trigger: 'blur'
    },
    {
      validator: validatePass4, trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请再次确认密码', trigger: 'blur' },
    {
      validator: validatePass2, trigger: 'blur'
    },
    {
      validator: validatePass3, trigger: 'blur'
    }
  ]
})


const handleUpd = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      checkOldPasswords();
      // if(result==false){
      //   ElMessage.error('旧密码错误')
      //   return
      // }
      const data = {
        id: Number(userId),
        newPwd: form.value.newPassword,

      }
      console.log(data);

      const response = await editPassword(data);
      console.log(response);

      if (response.status === 200) {
        ElMessage.success('修改密码成功')
      } else {
        ElMessage.error('修改密码失败')
      }
    }

  })

}
//检查旧密码是否正确
const checkOldPasswords = async () => {

  const data = {
    id: Number(userId),
    oldPwd: form.value.password,
  }
  console.log(data);

  const response = await checkOldPassword(data);
  console.log(response);

  if (response.status === 200) {
    return true
  } else {

    return false
  }
}
const handleCancel = () => {
  form.value = {
    id: '',
    account: '',
    userGroup: ''
  }
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