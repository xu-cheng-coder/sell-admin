<template>
  <div class="home-container">
    <!-- 标题栏 -->
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

    <div class="main-container">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
        <el-menu router unique-opened :default-active="activeMenu" class="el-menu-vertical" :collapse="isCollapse"
          background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
          <template v-for="item in menus">
            <!-- 判断是否有子菜单 -->
            <el-sub-menu v-if="item.children && item.children.length" :index="item.path" :key="item.path">
              <template #title>
                <el-icon>
                  <component :is="item.icon" />
                </el-icon>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
                @click="handleMenuClick(child.path)">
                <el-icon>
                  <component :is="child.icon" />
                </el-icon>
                <span>{{ child.title }}</span>
              </el-menu-item>
            </el-sub-menu>

            <!-- 判断是否没有子菜单 -->

            <el-menu-item v-else :index="item.path" @click="handleMenuClick(item.path)">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAccountInfo } from '@/api/user'
import serviceUrl from '../../utils/component.js';
import { deleteUser } from '@/api/user'
import {
  Menu,
  House,
  Goods,
  ShoppingCart,
  User,
  Shop,
  HelpFilled,
  Notebook,
  List,
  Plus,
  Edit
} from '@element-plus/icons-vue'

const breadcrumbItems = ref([]);
const router = useRouter();
const route = useRoute();
const isCollapse = ref(false)

const userInfo = ref({});
//判断当前路由

// 菜单数据
const menus = ref([
  {
    path: '/home/dashboard',
    title: '首页',
    icon: House
  },
  {
    path: '/home/user',
    title: '用户管理',
    icon: User,
    children: [
      {
        path: '/home/user/userList',
        title: '用户列表',
        icon: List
      },
      {
        path: '/home/user/myinfo',
        title: '个人信息',
        icon: List
      },
      {
        path: '/home/user/updpasword',
        title: '修改密码',
        icon: Edit
      }
    ]
  },
  {
    path: '/home/goods',
    title: '商品管理',
    icon: Goods,
    children: [
      {
        path: '/home/goods/category',
        title: '商品分类',
        icon: List
      },
      {
        path: '/home/goods/goodslist',
        title: '商品列表',
        icon: Goods
      },
      {
        path: '/home/goods/add',
        title: '添加商品',
        icon: Plus
      }
    ]
  },
  {
    path: '/home/order/orderlist',
    title: '订单管理',
    icon: ShoppingCart
  },
  {
    path: '/home/storeInfo',
    title: '店铺设置',
    icon: Shop
  },
  {
    path: '/home/article',
    title: '文章管理',
    icon: Notebook,
    children: [
      {
        path: '/home/article/articlelist',
        title: '文章列表',
        icon: Notebook
      },
      {
        path: '/home/article/articleClassify',
        title: '文章分类',
        icon: Notebook
      },
      {
        path: '/home/article/addArticle',
        title: '添加文章',
        icon: Plus
      }
    ]
  },
  {
    path: '/home/chars',
    title: '报表统计',
    icon: HelpFilled,
    children: [
      {
        path: '/home/chars/orderchar',
        title: '订单统计',
        icon: HelpFilled
      },
      {
        path: '/home/chars/goodschar',
        title: '商品统计',
        icon: HelpFilled
      }
    ]
  }
]);
const opentMenu = ref(false);
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
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
// 动态计算当前激活菜单
const activeMenu = computed(() => {
  return route.path;
});
console.log(route);

const handleMenuClick = (path) => {
  // if (route.path.includes(path)) {
  //   opentMenu.value = true;
  //   console.log(1);
  // }
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
//初始化
onMounted(() => {
  getUserInfo();
})
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

generateBreadcrumb();
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

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

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.aside {
  background-color: #304156;
  transition: width 0.3s;
}

.el-menu-vertical {
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}

.main {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}

.user-avatar {
  overflow: hidden;
}
</style>