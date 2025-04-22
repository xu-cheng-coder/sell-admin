<template>
    <el-header class="header">
      <div class="header-left">
        <el-icon class="menu-icon" @click="toggleSidebar">
          <Menu />
        </el-icon>
        <div class="title-container">
          <i class="iconfont icon-haitunyouxi logo-icon"></i>
          <span class="title">海豚外卖</span>
        </div>
      </div>
  
      <!-- 面包屑 -->
      <el-breadcrumb class="breadcrumb-container" separator="/">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index" :to="item.to">
          {{ item.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
  
      <div class="header-right">
        <el-dropdown>
          <span class="user-info">
            <el-avatar :src="serviceUrl + userInfo.imgUrl" />
            <span class="username">{{ userInfo.account }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleMenuClick('/home/user/myinfo')">个人信息</el-dropdown-item>
              <el-dropdown-item @click="handleDeletMy">注销账号</el-dropdown-item>
              <el-dropdown-item @click="handleMenuClick('/home/user/updpasword')">修改密码</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
  </template>
  
  <script setup>
  import { ref, watch,onMounted, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router';
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { getAccountInfo } from '@/api/user'
  import serviceUrl from '@/utils/component';
  import { deleteUser } from '@/api/user'
  import { Menu } from '@element-plus/icons-vue'
  import { markRaw } from 'vue';
  import { userStore } from '@/stores/userStore'
  
  const props = defineProps({
    isCollapse: Boolean
  })
  
  const emit = defineEmits(['toggle-sidebar'])
  
  const breadcrumbItems = ref([]);
  const router = useRouter();
  const route = useRoute();
  const userstore = userStore();
  const userInfo = ref({});
  
  const toggleSidebar = () => {
    emit('toggle-sidebar')
  }
  
  //注销账号
  const handleDeletMy = () => {
    ElMessageBox.confirm(
      '确定要注销吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        ElMessage({
          message: '注销成功',
          type: 'success',
        })
        handleDle();
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '成功取消',
        })
      })
  }
  
  //注销
  const userId = localStorage.getItem('userId');
  const handleDle = async () => {
    const res = await deleteUser(Number(userId));
    console.log(res);
    if (res.status === 200) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      router.push('/login')
    }
  }
  
  const handleMenuClick = (path) => {
    router.push(path);
  };
  
  //获取当前用户信息
  const getUserInfo = async () => {
    const userId = localStorage.getItem('userId');
    console.log(userId);
  
    const res = await getAccountInfo(userId);
  
    if (res.status == 200) {
      Object.assign(userInfo.value, res.data.accountInfo);
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
    ElMessage.success('已退出登录')
  }
  
  //面包屑
  const generateBreadcrumb = () => {
    const items = [];
    console.log(route.matched);
  
    route.matched.forEach((matchedRoute) => {
      if (matchedRoute.meta && matchedRoute.meta.breadcrumb) {
        items.push({
          label: matchedRoute.meta.breadcrumb,
          to: { path: matchedRoute.path }
        });
      }
    });
    breadcrumbItems.value = items;
    console.log(breadcrumbItems.value);
  };
  
  watch(() => route.path, () => {
    generateBreadcrumb();
  });
  
  //初始化
  onMounted(() => {
    getUserInfo();
    generateBreadcrumb();
  })
  
  //监听pinia的userstate是否变化，就重新刷新获取
  watch(() => { userstore.userInfoState }, () => {
    console.log(userstore.userInfoState);
    getUserInfo();
  }, { deep: true })
  </script>
  
  <style scoped>
  .header {
    background-color: #fff;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
  }
  
  .breadcrumb-container {
    flex: 1;
    margin-left: 50px;
  }
  
  .header-left {
    display: flex;
    align-items: center;
  }
  
  .menu-icon {
    font-size: 20px;
    cursor: pointer;
    margin-right: 20px;
  }
  
  .title-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .logo-icon {
    font-size: 24px;
    color: #fff;
    background-color: #409EFF;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }
  
  .title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  
  .header-right {
    display: flex;
    align-items: center;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .username {
    margin-left: 10px;
    color: #333;
  }
  </style>