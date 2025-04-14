<template>
  <div class="addgood">
    <el-card style="width: 60%;">
      <template #header>
        <div class="card-header">
          <span>添加商品</span>
        </div>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="form-content">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="form.goodsName" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="1" :max="99999" @change="handleChange" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择" style="width: 240px">
            <el-option style="width: 240px" v-for="item in takeoutCategories" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品图片" prop="imgUrl">
          <el-upload action="#" list-type="picture-card" :auto-upload="false" :on-change="handleFileChange"
            :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="fileList">
            <el-icon>
              <Plus />
            </el-icon>
            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" alt="Preview Image" width="100%" />
            </el-dialog>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品描述" prop="goodsDesc">
          <el-input v-model="form.goodsDesc" style="width: 240px" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
            placeholder="输入商品描述" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { addGoods } from '@/api/goods'
import { uploadGoodsImage, getAllCategories } from '@/api/goods'
import { useRouter } from 'vue-router'
// 数字框
const num = ref(1)
const handleChange = (value: number | undefined) => {
  console.log(value)
}
const router = useRouter();
// 商品分类选项
const takeoutCategories = ref([])
const getCategory = async () => {
  const res = await getAllCategories();
  if(res.status === 200) {
    console.log(res.data);
    
    takeoutCategories.value = res.data.categories.map(item => ({
      value: item.cateName , // 确保有value字段
      label: item.cateName // 确保有label字段
    }));
    console.log('处理后的分类数据:', takeoutCategories.value);
  }
}
getCategory();
// 图片上传相关
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileList = ref<UploadFile[]>([])
const currentFile = ref<File | null>(null)

const handleRemove = (uploadFile: UploadFile, uploadFiles: UploadFile[]) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

// 表单相关
const formRef = ref(null)
const loading = ref(false)
const emit = defineEmits(['submit', 'cancel'])

// 表单数据
const form = reactive({
  goodsName: '',
  price: 0,
  category: '',
  imgUrl: '',
  goodsDesc: ''
})
// 表单验证规则
const rules = {
  goodsName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
  ],
  category: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  goodsDesc: [
    { required: true, message: '请输入商品描述', trigger: 'blur' }
  ]
}

// 文件上传处理
const handleFileChange = async (file: UploadFile) => {
  currentFile.value = file.raw as File
  fileList.value = [file]
  loading.value = true

  try {
    const formData = new FormData()
    formData.append('file', currentFile.value)

    const res = await uploadGoodsImage(formData)
    if (res.data.code === 0) {
      form.imgUrl = res.data.imgUrl
      dialogImageUrl.value = form.imgUrl
      ElMessage.success('图片上传成功')
    }
  } catch (error) {
    ElMessage.error('图片上传失败')
    console.error('上传错误:', error)
  } finally {
    loading.value = false
  }
}

// 表单提交
const handleSubmit = async () => {
  if (!form.imgUrl) {
    ElMessage.error('请上传图片')
    return
  }

  try {
    loading.value = true
    await formRef.value.validate()

    const response = await addGoods({
      name: form.goodsName,
      category: form.category,
      price: form.price.toString(),
      imgUrl: form.imgUrl.slice(22), // 移除可能的前缀
      goodsDesc: form.goodsDesc
    })

    if (response.data.code === 0) {
      console.log(1);
      
      ElMessage.success('添加成功')
      router.push('/home/goods/goodslist');
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

// 表单重置
const resetForm = () => {
  formRef.value?.resetFields()
  form.imgUrl = ''
  dialogImageUrl.value = ''
  fileList.value = []
}

// 取消
const handleCancel = () => {
  resetForm()
  emit('cancel')
}
</script>

<style scoped>
.addgood {
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
  margin-top: 50px;
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