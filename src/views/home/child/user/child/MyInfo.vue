<template>
  <div class="addgood">
    <el-card style="width: 60%;">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
        </div>
      </template>
      <el-form :model="form" label-width="100px" class="form-content">
        <el-form-item label="管理员ID" prop="id">
          <el-input :disabled="true" v-model="form.id" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input :disabled="!isEdit" v-model="form.account" />
        </el-form-item>
        <el-form-item label="创建时间" prop="ctime">
          <el-input disabled v-model="time" />
        </el-form-item>
        <el-form-item label="用户组" prop="userGroup">
          <el-select  :disabled="!isEdit" v-model="form.userGroup" placeholder="Select" style="width: 240px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户头像" prop="imgUrl">
          <img v-if="!isEdit" w-full :src="serviceUrl + form.imgUrl" alt="Preview Image" width="50%" />
          <el-upload v-else="isEdit"
              class="avatar-uploader"
             :action="serviceUrl+'/users/avatar_upload?id='+form.id"
             :show-file-list="false"
             :on-success="handleAvatarSuccess"
             :before-upload="beforeAvatarUpload"
             >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="!isEdit" @click="handleEdit" :loading="loading">修改信息</el-button>
          <el-button type="success" v-if="isEdit" @click="handleSuccess" :loading="loading">完成</el-button>
          <el-button type="default" v-if="isEdit" @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAccountInfo, uploadAvatar, editAvatar, editUser } from '@/api/user'
import { Plus } from '@element-plus/icons-vue'
import serviceUrl from '../../../../../utils/component'
import { userStore } from '../../../../../stores/userStore'
const userstore = userStore()
const time = ref('');
//图片
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const loading = ref(false)
const isEdit = ref(false);
const showimg = ref(false);
const emit = defineEmits(['submit', 'cancel'])
//获取本地登录信息
const userId = localStorage.getItem('userId');
console.log(userId);
const options = reactive([
  {
    value: '普通管理员',
    label: '普通管理员',
  },
  {
    value: '超级管理员',
    label: '超级管理员',
  },
])
// 表单引用
// 表单数据
// 表单数据
const form = ref({
  id: '',
  ctime: '',
  account: '',
  imgUrl: '',
  userGroup: ''
})
const imageUrl = ref('');

const handleAvatarSuccess = function (response, uploadFile) {
  console.log(imageUrl.value);
    userstore.changesstate();
    console.log(userstore.userInfoState);
    
    imageUrl.value = URL.createObjectURL(uploadFile.raw);

    ElMessage.success('图片上传成功');
    handleGetMyinfo();
};

const beforeAvatarUpload = function (file) {
  console.log(file);
    // 判断文件类型必须是 图片
    if(!file.type.includes('image')){
      ElMessage.error('文件类型必须是图片');
      return false;
    }
    if(file.size >10*1024*1024){
      ElMessage.error('文件大小不能超过 10M');
      return false;
    }
  return true ;  
};


// 获取数据
const handleGetMyinfo = async () => {

  try {
    loading.value = true
    const response = await getAccountInfo(userId)
    console.log(response);
    if (response.status === 200) {
      ElMessage.success('获取成功')
      Object.assign(form.value, response.data.accountInfo);
      imageUrl.value = serviceUrl+ form.value.imgUrl;
      console.log(form.value);
      time.value = form.value.ctime.slice(0, 10);
      emit('submit')
    }          
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('请求失败，请稍后再试')
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  handleGetMyinfo();

})
const handleEdit = () => {
  isEdit.value = true;
  // 在点击编辑时将当前头像URL赋给dialogImageUrl
  dialogImageUrl.value = serviceUrl + form.value.imgUrl;
  console.log(dialogImageUrl.value);
  showimg.value = true;
}
const handleSuccess = async () => {
  isEdit.value = false;

  const data = {
    id: form.value.id,
    account: form.value.account,
    userGroup: form.value.userGroup
    }

  console.log(data);
  
  const response = await editUser(data);
  console.log(response);

  if (response.status === 200) {
    ElMessage.success('编辑个人信息成功')
  } else {
    ElMessage.error('编辑个人信息失败')
  }
}
const handleCancel = () => {
  isEdit.value = false;
  ElMessage.success('取消编辑')
  showimg.value = false;
}


// //修改用户头像
// const handleEditAvatar = async () => {
//   const data={
//     id: form.value.id,
//     imgUrl: serviceUrl+form.value.avatar,
//   }
//   console.log(data);
  
//   const response = await editAvatar(data)
    
//   console.log(response);
//   if (response.status === 200) {
//     ElMessage.success('图片上传成功')
//   }
// }

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
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

:deep.avatar-uploader .el-upload {
  border: 1px dashed #cecece;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: #3391de;
}

:deep.avatar-uploader .el-upload:hover {
  border-color: #3391de;
}

:deep.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #c0c0c0;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
