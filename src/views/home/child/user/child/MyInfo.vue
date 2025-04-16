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
          <el-upload v-if="isEdit" action="#" list-type="picture-card" :auto-upload="false"
            :on-change="handleFileChange" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
            :file-list="fileList">
            <el-icon>
              <Plus />
            </el-icon>

            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" alt="Preview Image" width="100%" />
            </el-dialog>
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

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAccountInfo, uploadAvatar, editAvatar, editUser } from '@/api/user'
import { Plus } from '@element-plus/icons-vue'
import serviceUrl from '../../../../../utils/component'
const fileList = ref<UploadFile[]>([])
const currentFile = ref<File | null>(null)
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

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const form = ref({
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
    console.log(response);
    if (response.status === 200) {
      ElMessage.success('获取成功')
      Object.assign(form.value, response.data.accountInfo);
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

  const response = await editUser(data);
  console.log(response);

  if (response.status === 200) {
    ElMessage.success('编辑店铺信息成功')
  } else {
    ElMessage.error('编辑店铺信息失败')
  }
}
const handleCancel = () => {
  isEdit.value = false;
  ElMessage.success('取消编辑')
  showimg.value = false;
}
// 文件上传处理
const handleFileChange = async (file: UploadFile) => {
  currentFile.value = file.raw as File
  fileList.value = [file]
  loading.value = true

  try {
    const formData = new FormData()
    formData.append('file', currentFile.value)

    const res = await uploadAvatar(formData)
    if (res.data.code === 0) {
      console.log(res.data.imgUrl);

      form.value.avatar = res.data.imgUrl;
      console.log(form.value.avatar);

      dialogImageUrl.value = form.avatar

      handleEditAvatar();
    }
  } catch (error) {
    ElMessage.error('图片上传失败')
    console.error('上传错误:', error)
  } finally {
    loading.value = false
  }
}
//修改用户头像
const handleEditAvatar = async () => {
  console.log(form.value.avatar, form.value.id);
  const response = await editAvatar({
    id: form.value.id,
    imgUrl: form.value.avatar,
  });
  console.log(response);
  if (response.status === 200) {
    ElMessage.success('图片上传成功')
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