<template>
    <div class="shop-detail">
        <el-card style="width: 60%;">
            <template #header>
                <div class="card-header">
                    <span>店铺详情</span>
                </div>
            </template>
            <el-form :model="form" label-width="120px" class="form-content">
                <el-form-item label="店铺ID" prop="id">
                    <el-input disabled v-model="form.id" />
                </el-form-item>
                <el-form-item label="店铺名称" prop="name">
                    <el-input :disabled="!isEdit" v-model="form.name" />
                </el-form-item>
                <el-form-item label="店铺公告" prop="bulletin">
                    <el-input :disabled="!isEdit" type="textarea" :rows="3" v-model="form.bulletin" />
                </el-form-item>
                <el-form-item label="店铺头像">
                    <el-image v-if="!isEdit" style="width: 100px; height: 100px; border-radius: 50%;"
                        :src="'http://8.137.157.16:9002/' + form.avatar" :preview-src-list="[form.avatar]"
                        fit="cover" />

                        <el-upload v-else="isEdit"
                         class="avatar-uploader"
                        :action="serviceUrl+'/shop/upload'"
                       :show-file-list="false"
                       :on-success="handleAvatarSuccess"
                       :before-upload="beforeAvatarUpload"
                           >
                         <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                       </el-upload>


                </el-form-item>
                <el-form-item label="配送费(元)" prop="deliveryPrice">
                    <el-input :disabled="!isEdit" v-model="form.deliveryPrice" />
                </el-form-item>
                <el-form-item label="送达时间(分钟)" prop="deliveryTime">
                    <el-input :disabled="!isEdit" v-model="form.deliveryTime" />
                </el-form-item>
                <el-form-item label="配送描述" prop="description">
                    <el-input :disabled="!isEdit" v-model="form.description" />
                </el-form-item>
                <el-form-item label="店铺评分" prop="score">
                    <el-rate v-model="form.score" :disabled="!isEdit" show-score text-color="#ff9900"
                        score-template="{value}" />
                </el-form-item>
                <el-form-item label="月销量" prop="sellCount">
                    <el-input :disabled="!isEdit" v-model="form.sellCount">
                        <template #append>单</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="起送价格" prop="minPrice">
                    <el-input :disabled="!isEdit" v-model="form.minPrice">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="营业时间">

                    <el-time-picker :disabled="!isEdit" v-model="form.date" is-range range-separator="至"
                        start-placeholder="开始时间" end-placeholder="结束时间" format="HH:mm:ss" />
                </el-form-item>
                <el-form-item label="店铺活动">
                    <div class="supports">
                        <el-tag v-if="!isEdit" v-for="(item, index) in form.supports" :key="index" type="success"
                            style="margin-right: 8px;margin-top: 5px;" max="100">
                            {{ item }}
                        </el-tag>

                        <el-checkbox-group v-if="isEdit" v-model="form.supports">
                            <el-checkbox v-for="(item, index) in supports" :key="index" :label="item" :value="item" />
                        </el-checkbox-group>

                    </div>
                </el-form-item>
                <el-form-item label="店铺图片">

                    <el-upload
                    :disabled="!isEdit"
                    v-model:file-list="fileList"
                    :action="serviceUrl+'/shop/upload'"
                    list-type="picture-card"
                     :on-preview="handlePictureCardPreview"
                     :on-remove="handleRemove"
                     :on-success="handleImgSuccess"
                         >
                   <el-icon><Plus /></el-icon>
                  </el-upload>

 
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-if="!isEdit" @click="handleUpdate">编辑信息</el-button>
                    <el-button type="success" v-if="isEdit" @click="handleSuess">完成</el-button>
                    <el-button type="default" v-if="isEdit" @click="handleCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getShopInfo, uploadShopImage, editShop } from '@/api/shop' // 修改为获取店铺详情的接口
import { useRoute } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import serviceUrl from '../../../../../utils/component'
// import OrderForm from './OrderForm.vue' // 注意：这里需要创建一个对应的ShopForm组件
const isEdit = ref(false);
const loading = ref(false)
const route = useRoute()

// 店铺多图
const fileList = ref([])
// 预览图片的弹窗
const dialogVisible = ref(false)
// 预览图片的路径
const dialogImageUrl = ref('')

const supports = ref([
    '单人精彩套餐',
    'VC无限橙果汁全场8折',
    '在线支付满28减5',
    '特价饮品八折抢购',
    '中秋特惠',
    '国庆特价',
    '春节1折折扣'
])

const imageUrl=ref('')

//头像
const handleAvatarSuccess = function (res, uploadFile) {
    console.log(imageUrl.value);
    
    imageUrl.value = URL.createObjectURL(uploadFile.raw);
    console.log(res);
    
    form.avatar=res.imgUrl;

    ElMessage.success('图片上传成功');
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

const handleImgSuccess=(ref,uploadFile)=>{
    ElMessage.success('图片上传成功');
    dialogImageUrl.value = URL.createObjectURL(uploadFile.raw);
    form.pics.push(ref.imgUrl);
    console.log(form.pics);
}
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
  
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

// 表单数据
const form = reactive({
    id: '',
    name: '',
    bulletin: '',
    avatar: '',
    deliveryPrice: 0,
    deliveryTime: 0,
    description: '',
    score: 0,
    sellCount: 0,
    supports: [],
    pics: [
        "1589589155004.jpg",
        "1589589160189.jpg"
    ],
    date: [
        new Date(2016, 9, 10, 8, 40),
        new Date(2016, 9, 10, 9, 40),
    ],
    minPrice: ''
})


// 获取店铺数据
const handleGetShopInfo = async () => {
    try {
        loading.value = true
        const shopId = route.params.id || 1 // 默认获取ID为1的店铺
        const response = await getShopInfo(shopId)
        console.log(response.data.data);


        if (response.status === 200) {
            form.id = response.data.data.id;
            form.name = response.data.data.name;
            form.bulletin = response.data.data.bulletin;
            form.avatar = response.data.data.avatar;
            form.deliveryPrice = response.data.data.deliveryPrice;
            form.deliveryTime = response.data.data.deliveryTime;
            form.description = response.data.data.description;
            form.score = response.data.data.score;
            form.sellCount = response.data.data.sellCount;
            form.minPrice = response.data.data.minPrice;
            form.supports = response.data.data.supports;
            form.date = response.data.data.date;
            form.pics = response.data.data.pics;
                    
            fileList.value = form.pics.map((item)=>{
                return { name:item,url:serviceUrl+item} 
             }) 
            imageUrl.value = serviceUrl+ form.avatar;

            ElMessage.success('获取店铺详情成功')
        } else {
            ElMessage.error('获取店铺详情失败')
        }
    } catch (error) {
        console.error('获取店铺详情失败:', error)
        ElMessage.error('请求失败，请稍后再试')
    } finally {
        loading.value = false
    }
}

// 初始化获取数据
handleGetShopInfo()

// 编辑店铺信息
const handleUpdate = () => {
    isEdit.value = true
}

const handleSuess = async () => {
    isEdit.value = false;
    console.log(form.avatar);
    const slicedPics = form.pics.map(item => item.slice(13));
    console.log(slicedPics);

    const data = {
        id: form.id,
        name: form.name,
        bulletin: form.bulletin,
        avatar: form.avatar.slice(13),
        deliveryPrice: form.deliveryPrice,
        deliveryTime: form.deliveryTime,
        description: form.description,
        score: form.score,
        sellCount: form.sellCount,
        // minPrice:form.minPrice,
        supports: JSON.stringify(form.supports),
        date: JSON.stringify(form.date),
        pics: JSON.stringify(slicedPics)
    }
    console.log(data);

    const response = await editShop(data);
    console.log(response);

    if (response.status === 200) {
        ElMessage.success('编辑店铺信息成功')
        handleGetShopInfo()
    } else {
        ElMessage.error('编辑店铺信息失败')
    }
}
const handleCancel = () => {
    isEdit.value = false;
    ElMessage.success('取消编辑')
}

</script>

<style scoped>
.shop-detail {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 20px 0;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
}

.form-content {
    max-width: 800px;
    margin: 0 auto;
}

.image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.supports {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
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