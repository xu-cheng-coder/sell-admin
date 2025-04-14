<template>
  <el-card>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="form-content">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="form.goodsName" />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input-number v-model="form.price" :min="1" :max="99999" @change="handleChange" />
      </el-form-item>
      <el-form-item label="商品分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择" style="width: 240px">
          <el-option style="width: 240px"  v-for="item in takeoutCategories" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品图片" prop="imgUrl">

        <el-upload action="#" list-type="picture-card" :auto-upload="false" :on-change="handleFileChange"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="fileList">
          <!-- 绑定fileList以显示已有图片 -->
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
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {  Plus } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { addGoods } from '@/api/goods'
import { uploadGoodsImage } from '@/api/goods'
import { editGoods,getAllCategories } from '@/api/goods'

// 在 script 顶部添加 loading 状态
const value = ref({})
//数字框
const num = ref(1)
const handleChange = (value: number | undefined) => {
  console.log(value)
}
const takeoutCategories = ref([]);


//文本框
const textarea2 = ref('');
//上传商品
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileList = ref<UploadFile[]>([])
const currentFile = ref<File | null>(null)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  goodsInfor: {
    type: Object,
    default: () => ({
      name: '',
      category: '',
      price: '',
      imgUrl: '',
      goodsDesc: '',
      id: ''
    })

  },
  goodId:{
    type:Number,
    default:''
  }

})
console.log(props.goodsInfor,props.goodId);

const emit = defineEmits(['submit', 'cancel'])
//获取分类数据
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
// 表单数据
const form = reactive({
  goodsName: '',
  price: 0,
  category: '',
  imgUrl: dialogImageUrl.value,
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
    { required: true, message: '请选择商品分类', trigger: 'blur' }
  ],

  goodsDesc: [
    { required: true, message: '请输入商品描述', trigger: 'blur' }
  ]
}

// 获取商品信息（编辑时）
const getGoodsInfo = () => {
  if (props.isEdit && props.goodsInfor.id) {
    console.log('获取商品信息:', props.goodsInfor.desc)
    Object.assign(form, {
      goodsName: props.goodsInfor.name,
      price: props.goodsInfor.price,
      category: props.goodsInfor.category,
      imgUrl: props.goodsInfor.imgUrl,
      goodsDesc: props.goodsInfor.goodsDesc
    })

    // 设置图片预览URL
    if (props.isEdit) {
      dialogImageUrl.value = props.goodsInfor.imgUrl
      // 初始化文件列表显示已有图片
      fileList.value = [{
        name: '商品图片',
        url: 'http://8.137.157.16:9002' + props.goodsInfor.imgUrl
      }]
    }
  }
}
// 监听 goodsId 变化
watch(() => props.goodId, (newVal) => {
  if (newVal) {
    getGoodsInfo()
  } else {
    // 重置表单
    Object.assign(form, {
      goodsName: '',
      price: 0,
      category: '',
      imgUrl: '',
      goodsDesc: ''
    })
  }
}, { immediate: true })

// 添加文件状态管理


// 在 script 顶部添加 loading 状态
const loading = ref(false)

// 修改 handleFileChange 方法
const handleFileChange = async (file: UploadFile) => {
  currentFile.value = file.raw as File
  fileList.value = [file]
  loading.value = true // 开始上传时开启loading

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
    loading.value = false // 无论成功失败都关闭loading
  }
}

// 修改 handleSubmit 方法
const handleSubmit = async () => {
  if (!form.imgUrl) {
    ElMessage.error('请上传图片')
    return
  }

  try {
    loading.value = true // 提交表单时开启loading
    await formRef.value.validate()

    const requestData = {
      name: form.goodsName,
      category: form.category,
      price: form.price.toString(),
      imgUrl: form.imgUrl.slice(22),
      goodsDesc: form.goodsDesc
    }

    const response = props.isEdit
      ? await editGoods({ ...requestData, id: props.goodsInfor.id })
      : await addGoods(requestData)

    if (response.data.code === 0) {
      ElMessage.success(props.isEdit ? '编辑成功' : '添加成功')
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


onMounted(() => {
  // 判断是编辑还是添加
  if (route.params.id) {
    props.isEdit = true
    props.goodsId = route.params.id
    getGoodsInfo()
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